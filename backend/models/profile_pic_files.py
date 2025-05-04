import uuid
from datetime import datetime, timezone
from enum import Enum
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy import Column, String, DateTime, ForeignKey, Enum as PgEnum, Text, Date
from sqlalchemy.orm import relationship
from flask_sqlalchemy import SQLAlchemy
from config.extensions import db


class ProfilePicFile(db.Model):
    __tablename__ = 'profile_pic_files'
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey('user.id'))
    filename = Column(String(255))
    filepath = Column(String(255))
    created_at = db.Column(db.DateTime, nullable=False,
                           default=lambda: datetime.now(timezone.utc))

    user = relationship(
        'User',
        back_populates='profile_pic',
        foreign_keys=[user_id]
    )
