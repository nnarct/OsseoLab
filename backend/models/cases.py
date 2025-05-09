import uuid
from datetime import datetime, timezone
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy import Column, String, DateTime, ForeignKey, Enum as PgEnum, Text, Date, Integer
from sqlalchemy.orm import relationship
from config.extensions import db
from .enums import GenderEnum
from datetime import datetime, date
# Auto-increment case_number if not set
from sqlalchemy import event, select, func


class Case(db.Model):
    __tablename__ = 'cases'
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    case_number = Column(
        Integer, autoincrement=True,
        unique=True, nullable=True)
    case_code = Column(String(255), nullable=True)
    status = Column(String(255), nullable=True)
    priority = Column(String(255), nullable=True)
    created_by = Column(UUID(as_uuid=True),
                        ForeignKey('user.id'), nullable=False)
    product = Column(String(255), nullable=True)
    anticipated_ship_date = Column(Date, nullable=True)
    surgeon_id = Column(UUID(as_uuid=True), ForeignKey('doctors.id'))
    patient_name = Column(String(255))
    patient_gender = Column(PgEnum(GenderEnum), nullable=True)
    scan_type = Column(String(255))
    surgery_date = Column(Date)
    patient_dob = Column(Date)
    additional_note = Column(Text)
    problem_description = Column(Text)
    created_at = Column(
        DateTime, nullable=False,
        default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, nullable=False, default=lambda: datetime.now(
        timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    surgeon = relationship('Doctor', back_populates='cases')
    files = relationship(
        'CaseFile', back_populates='case',
        passive_deletes=True)
    surgeons = relationship('CaseSurgeon', back_populates='case')
    creator = relationship('User', back_populates='created_cases')
    technicians = relationship(
        'CaseTechnician',
        back_populates='case',
        passive_deletes=True,
        cascade='all, delete-orphan'
    )
    # groups = relationship(
    #     "CaseFileGroup", backref="case", cascade="all, delete-orphan")

    def to_dict(self, exclude: set[str] = None, include: set[str] = None):
        data = {
            "id": str(self.id),
            "case_number": self.case_number,
            "case_code": self.case_code,
            "status": self.status,
            "priority": self.priority,
            "created_by": {
                "id": str(self.creator.id),
                "username": self.creator.username,
                "firstname": self.creator.firstname,
                "lastname": self.creator.lastname,
            } if self.creator else str(self.created_by),
            "created_by_id": str(self.created_by),
            "product": self.product,
            "anticipated_ship_date": int(datetime.combine(self.anticipated_ship_date, datetime.min.time()).timestamp()) if self.anticipated_ship_date else None,
            "surgeon_id": str(self.surgeon_id) if self.surgeon_id else None,
            "surgeon": {
                "id": str(self.surgeon.id),
                "firstname": self.surgeon.user.firstname,
                "lastname": self.surgeon.user.lastname,
            } if self.surgeon else None,
            "patient_name": self.patient_name,
            "patient_gender": self.patient_gender.name if self.patient_gender else None,
            "scan_type": self.scan_type,
            "surgery_date": int(datetime.combine(self.surgery_date, datetime.min.time()).timestamp()) if self.surgery_date else None,
            "patient_dob": int(datetime.combine(self.patient_dob, datetime.min.time()).timestamp()) if self.patient_dob else None,
            "patient_age": date.today().year - self.patient_dob.year if self.patient_dob else None,
            "additional_note": self.additional_note,
            "problem_description": self.problem_description,
            "created_at": int(self.created_at.timestamp()) if self.created_at else None,
            "updated_at": int(self.updated_at.timestamp()) if self.updated_at else None,
        }

        if include:
            data = {k: v for k, v in data.items() if k in include}
        if exclude:
            data = {k: v for k, v in data.items() if k not in exclude}

        return data


@event.listens_for(Case, 'before_insert')
def set_case_number(mapper, connect, target):
    if target.case_number is None:
        result = connect.execute(select(func.max(Case.case_number)))
        max_number = result.scalar()
        target.case_number = (max_number or 0) + 1
