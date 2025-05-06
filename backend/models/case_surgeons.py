import uuid
from datetime import datetime, timezone
from enum import Enum
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy import Column, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from config.extensions import db


class CaseSurgeon(db.Model):
    __tablename__ = 'case_surgeons'
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    case_id = Column(UUID(as_uuid=True), ForeignKey(
        'cases.id', ondelete="CASCADE"), nullable=False)
    surgeon_id = Column(UUID(as_uuid=True), ForeignKey(
        'doctors.id', ondelete="CASCADE"), nullable=False)
    created_at = Column(DateTime, nullable=False,
                        default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, nullable=False, default=lambda: datetime.now(
        timezone.utc), onupdate=lambda: datetime.now(timezone.utc))
    active = Column(Boolean, nullable=False, default=True)

    case = relationship('Case', back_populates='surgeons',
                        passive_deletes=True)
    surgeon = relationship(
        'Doctor', back_populates='case_links', passive_deletes=True)

    def to_dict(self, include=None, exclude=None):
        include = set(include or [])
        exclude = set(exclude or [])

        data = {
            "id": str(self.id),
            "case_id": str(self.case_id),
            "surgeon_id": str(self.surgeon_id),
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
            "active": self.active
        }

        if include:
            data = {k: v for k, v in data.items() if k in include}
        if exclude:
            data = {k: v for k, v in data.items() if k not in exclude}

        return data
