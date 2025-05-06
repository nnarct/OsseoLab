
import uuid
from datetime import datetime, timezone
from enum import Enum
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy import Column, String, DateTime, ForeignKey, Enum as PgEnum, Text, Date
from sqlalchemy.orm import relationship
from flask_sqlalchemy import SQLAlchemy
from config.extensions import db


class Technician(db.Model):
    __tablename__ = 'technicians'
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey(
        'user.id', ondelete="CASCADE"), nullable=False)
    created_at = Column(
        DateTime, nullable=False,
        default=lambda: datetime.now(timezone.utc))
    updated_at = Column(
        DateTime, nullable=False, default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc))

    user = relationship(
        'User', back_populates='technician_profile', passive_deletes=True)
    case_links = relationship(
        'CaseTechnician',
        back_populates='technician',
        passive_deletes=True,
        cascade='all, delete-orphan'
    )

    def to_dict(self, include=None, exclude=None):
        include = set(include or [])
        exclude = set(exclude or [])

        data = {
            "id": str(self.id),
            "user_id": str(self.user_id),
            "created_at": int(self.created_at.timestamp()) if self.created_at else None,
            "updated_at":  int(self.updated_at.timestamp()) if self.updated_at else None,
        }

        if include:
            data = {k: v for k, v in data.items() if k in include}
        if exclude:
            data = {k: v for k, v in data.items() if k not in exclude}

        return data
