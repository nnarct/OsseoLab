import uuid
from datetime import datetime, timezone
from enum import Enum
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy import Column, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from config.extensions import db


class ProfilePicFile(db.Model):
    __tablename__ = 'profile_pic_files'
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey('user.id'))
    filename = Column(String(255))
    filepath = Column(String(255))
    created_at = Column(DateTime, nullable=False,
                        default=lambda: datetime.now(timezone.utc))

    user = relationship(
        'User',
        back_populates='profile_pic',
        foreign_keys=[user_id]
    )

    def to_dict(self, include=None, exclude=None):
        data = {
            "id": str(self.id),
            "user_id": str(self.user_id),
            "filename": self.filename,
            "filepath": self.filepath,
            "created_at": int(self.created_at.timestamp()) if self.created_at else None,
        }

        if include:
            data = {k: v for k, v in data.items() if k in include}
        if exclude:
            for key in exclude:
                data.pop(key, None)

        return data
