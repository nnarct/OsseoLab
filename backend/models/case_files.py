import uuid
from datetime import datetime, timezone
from enum import Enum
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy import Column, String, DateTime, ForeignKey, Integer, Boolean
from sqlalchemy.orm import relationship
from config.extensions import db
from .case_file_versions import CaseFileVersion


class CaseFile(db.Model):
    __tablename__ = 'case_files'
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    case_id = Column(UUID(as_uuid=True), ForeignKey('cases.id'), nullable=False)
    active = Column(Boolean, default=True, nullable=False)
    pre = Column(Boolean, default=True, nullable=False)
    post = Column(Boolean, default=False, nullable=False)
    created_at = Column(
        DateTime, nullable=False, default=lambda: datetime.now(timezone.utc)
    )
    updated_at = Column(
        DateTime, nullable=False,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc)
    )
    original_filename = Column(String(255), nullable=True)
    current_version_id = Column(String, ForeignKey("case_file_versions.id"))

    case = relationship('Case', back_populates='files')
    # group_items = relationship("CaseFileGroupItem", back_populates="case_file")

    versions = db.relationship(
        "CaseFileVersion",
        backref="case_file",
        cascade="all, delete-orphan",
        passive_deletes=True,
        foreign_keys=[CaseFileVersion.case_file_id]
    )

    current_version = relationship(
        "CaseFileVersion",
        back_populates="file_as_current",
        foreign_keys=[current_version_id],
        uselist=False
    )

    def to_dict(self, include=None, exclude=None):
        data = {
            "id": str(self.id),
            "case_id": str(self.case_id),
            "active": self.active,
            "pre": self.pre,
            "post": self.post,
            "created_at": int(self.created_at.timestamp()) if self.created_at else None,
            "updated_at": int(self.updated_at.timestamp()) if self.updated_at else None,
            "original_filename": self.original_filename,
            "current_version_id": self.current_version_id,
        }

        if include:
            data = {k: v for k, v in data.items() if k in include}
        if exclude:
            for key in exclude:
                data.pop(key, None)

        return data