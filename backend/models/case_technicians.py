import uuid
from datetime import datetime, timezone
from enum import Enum
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy import Column, DateTime, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from config.extensions import db

# New model: CaseTechnician


class CaseTechnician(db.Model):
    __tablename__ = 'case_technicians'
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    case_id = Column(UUID(as_uuid=True), ForeignKey(
        'cases.id', ondelete="CASCADE"), nullable=False)
    technician_id = Column(UUID(as_uuid=True), ForeignKey(
        'technicians.id', ondelete="CASCADE"), nullable=False)
    created_at = Column(DateTime, nullable=False,
                        default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, nullable=False, default=lambda: datetime.now(
        timezone.utc), onupdate=lambda: datetime.now(timezone.utc))
    active = Column(Boolean, nullable=False, default=True)

    case = relationship(
        'Case', back_populates='technicians', passive_deletes=True)
    technician = relationship(
        'Technician', back_populates='case_links', passive_deletes=True)

    def to_dict(self, include=None, exclude=None):
        include = set(include or [])
        exclude = set(exclude or [])

        data = {
            "id": str(self.id),
            "case_id": str(self.case_id),
            "technician_id": str(self.technician_id),
            "created_at": int(self.created_at.timestamp()) if self.created_at else None,
            "updated_at": int(self.updated_at.timestamp()) if self.updated_at else None,
            "active": self.active
        }

        if include:
            data = {k: v for k, v in data.items() if k in include}
        if exclude:
            data = {k: v for k, v in data.items() if k not in exclude}

        return data
