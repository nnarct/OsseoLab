
import uuid
from datetime import datetime, timezone
from enum import Enum
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy import Column, String, DateTime, ForeignKey, Enum as PgEnum, Text, Date
from sqlalchemy.orm import relationship
from flask_sqlalchemy import SQLAlchemy
from config.extensions import db
from .enums import GenderEnum

class Case(db.Model):
    __tablename__ = 'cases'
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    surgeon_id = Column(UUID(as_uuid=True), ForeignKey('doctors.id'))
    patient_name = Column(String(255))
    patient_gender = Column(PgEnum(GenderEnum), nullable=True)
    scan_type = Column(String(255))
    surgery_date = Column(Date)
    patient_dob = Column(Date)
    additional_note = Column(Text)
    problem_description = Column(Text)
    created_at = db.Column(db.DateTime, nullable=False,
                           default=lambda: datetime.now(timezone.utc))
    last_updated = db.Column(db.DateTime, nullable=False, default=lambda: datetime.now(timezone.utc),
                             onupdate=lambda: datetime.now(timezone.utc))

    surgeon = relationship('Doctor', back_populates='cases')
    files = relationship('CaseFile', back_populates='case')
    surgeons = relationship('CaseSurgeon', back_populates='case')


