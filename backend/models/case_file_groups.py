import uuid
from config.extensions import db
from datetime import datetime, timezone
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy import Column, ForeignKey, Text, String, DateTime
from sqlalchemy.orm import relationship


class CaseFileGroup(db.Model):
    __tablename__ = "case_file_groups"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    case_id = Column(String, ForeignKey("cases.id"), nullable=False)
    name = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    created_at = Column(DateTime, nullable=False,
                        default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))
    created_by = Column(String, ForeignKey("user.id"), nullable=True)

    items = relationship(
        "CaseFileGroupItem", backref="group", cascade="all, delete-orphan")
    creator = relationship("User", back_populates="created_groups")

    def to_dict(self, include=None, exclude=None):
        data = {
            "id": str(self.id),
            "case_id": self.case_id,
            "name": self.name,
            "description": self.description,
            "created_at": int(self.created_at.timestamp()) if self.created_at else None,
            "updated_at": int(self.updated_at.timestamp()) if self.updated_at else None,
            "created_by": self.created_by,
        }

        if include:
            data = {k: v for k, v in data.items() if k in include}
        if exclude:
            for key in exclude:
                data.pop(key, None)

        return data