from config.extensions import db
from datetime import datetime, timezone
from uuid import uuid4
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy import Column, String, DateTime, ForeignKey, Enum as PgEnum, Text, Date, Boolean


class Notification(db.Model):
    __tablename__ = 'notifications'

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey('user.id'), nullable=False)
    message = Column(String(255), nullable=False)
    related_case_id = Column(UUID(as_uuid=True), nullable=True)
    case_type = Column(String(50), nullable=True)  # e.g., 'quick', 'full'
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime, nullable=False,
                        default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, nullable=False, default=lambda: datetime.now(
        timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    user = db.relationship('User', backref=db.backref(
        'notifications', lazy='dynamic'))

    def to_dict(self, include=None, exclude=None):
        include = set(include or [])
        exclude = set(exclude or [])

        data = {
            "id": str(self.id),
            "user_id": str(self.user_id),
            "message": self.message,
            "related_case_id": str(self.related_case_id) if self.related_case_id else None,
            "case_type": self.case_type,
            "is_read": self.is_read,
            "created_at": self.created_at.isoformat(),
            "updated_at": self.updated_at.isoformat() if self.updated_at else None
        }

        if include:
            data = {k: v for k, v in data.items() if k in include}
        if exclude:
            data = {k: v for k, v in data.items() if k not in exclude}

        return data
