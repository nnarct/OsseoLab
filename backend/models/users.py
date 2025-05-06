import uuid
from datetime import datetime, timezone
from enum import Enum
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy import Column, String, DateTime, ForeignKey, Enum as PgEnum, Text, Date
from sqlalchemy.orm import relationship
from flask_sqlalchemy import SQLAlchemy
from config.extensions import db
from .enums import GenderEnum, RoleEnum


class User(db.Model):
    __tablename__ = 'user'
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    firstname = Column(String(255))
    lastname = Column(String(255))
    username = Column(String(255), nullable=True)
    email = Column(String(255))
    phone = Column(String(20), nullable=True)
    password = Column(String(255))
    dob = Column(Date, nullable=True)
    role = Column(PgEnum(RoleEnum))
    gender = Column(PgEnum(GenderEnum), nullable=True)
    country = Column(String(255), nullable=True)
    created_at = Column(
        DateTime, nullable=False,
        default=lambda: datetime.now(timezone.utc))
    updated_at = Column(
        DateTime, nullable=False, default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc))
    profile_image = Column(UUID(as_uuid=True),  ForeignKey(
        'profile_pic_files.id'), nullable=True)

    doctor_profile = relationship(
        'Doctor', back_populates='user', uselist=False)
    technician_profile = relationship(
        'Technician', back_populates='user', uselist=False)
    profile_pic = relationship(
        'ProfilePicFile', back_populates='user',  foreign_keys='ProfilePicFile.user_id')
    created_cases = relationship('Case', back_populates='creator')
    created_groups = relationship('CaseFileGroup', back_populates='creator')

    def to_dict(self, exclude: set[str] = None):
        data = {
            "id": str(self.id),
            "firstname": self.firstname,
            "lastname": self.lastname,
            "username": self.username,
            "email": self.email,
            "phone": self.phone,
            "dob": int(datetime.combine(self.dob, datetime.min.time()).timestamp()) if self.dob else None,
            "role": self.role.value if isinstance(self.role, Enum) else self.role,
            "gender": self.gender.name if self.gender else None,
            "country": self.country,
            "created_at": int(self.created_at.timestamp()),
            "updated_at": int(self.updated_at.timestamp()),
            "profile_image": str(self.profile_image) if self.profile_image else None
        }
        if exclude:
            return {k: v for k, v in data.items() if k not in exclude}
        return data
