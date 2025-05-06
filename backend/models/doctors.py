import uuid
from datetime import datetime, timezone
from enum import Enum
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy import Column, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from config.extensions import db


class Doctor(db.Model):
    __tablename__ = 'doctors'
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(
        UUID(as_uuid=True),
        ForeignKey('user.id', ondelete="CASCADE"),
        nullable=False
    )
    hospital = Column(String(255))
    doctor_registration_id = Column(String(255), nullable=True)
    reference = Column(String(255), nullable=True)
    created_at = Column(
        DateTime, nullable=False,
        default=lambda: datetime.now(timezone.utc))
    updated_at = Column(
        DateTime, nullable=False, default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc))

    user = relationship(
        'User', back_populates='doctor_profile', passive_deletes=True)
    cases = relationship('Case', back_populates='surgeon')
    case_links = relationship('CaseSurgeon', back_populates='surgeon')

    def to_dict(self, include=None, exclude=None):
        include = set(include or [])
        exclude = set(exclude or [])

        data = {
            "id": str(self.id),
            "user_id": str(self.user_id),
            "firstname": self.user.firstname if self.user else None,
            "lastname": self.user.lastname if self.user else None,
            "hospital": self.hospital,
            "email": self.user.email if self.user else None,
            "phone": self.user.phone if self.user else None,
            "username": self.user.username if self.user else None,
            "doctor_registration_id": self.doctor_registration_id,
            "reference": self.reference,
            "created_at": int(self.created_at.timestamp()) if self.created_at else None,
            "updated_at": int(self.updated_at.timestamp()) if self.updated_at else None,
        }

        if include:
            data = {k: v for k, v in data.items() if k in include}
        if exclude:
            data = {k: v for k, v in data.items() if k not in exclude}

        return data
