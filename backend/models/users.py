
import uuid
from datetime import datetime, timezone
from enum import Enum
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy import Column, String, DateTime, ForeignKey, Enum as PgEnum, Text, Date
from sqlalchemy.orm import relationship
from flask_sqlalchemy import SQLAlchemy
from config.extensions import db
from .enums import GenderEnum


class User(db.Model):
    __tablename__ = 'user'
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    firstname = Column(String(255))
    lastname = Column(String(255))
    username = Column(String(255), nullable=True)
    email = Column(String(255))
    password = Column(String(255))
    dob = Column(Date, nullable=True)
    role = Column(String(255))
    gender = Column(PgEnum(GenderEnum), nullable=True)
    country = Column(String(255), nullable=True)
    created_at = db.Column(db.DateTime, nullable=False,
                           default=lambda: datetime.now(timezone.utc))
    last_updated = db.Column(db.DateTime, nullable=False, default=lambda: datetime.now(timezone.utc),
                             onupdate=lambda: datetime.now(timezone.utc))
    profile_image = Column(UUID(as_uuid=True),  ForeignKey(
        'profile_pic_files.id'), nullable=True)

    doctor_profile = relationship(
        'Doctor', back_populates='user', uselist=False)
    technician_profile = relationship(
        'Technician', back_populates='user', uselist=False)
    profile_pic = relationship(
        'ProfilePicFile', back_populates='user',  foreign_keys='ProfilePicFile.user_id')
