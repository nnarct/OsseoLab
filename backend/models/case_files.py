import uuid
from datetime import datetime, timezone
from enum import Enum
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy import Column, String, DateTime, ForeignKey, Integer
from sqlalchemy.orm import relationship
from config.extensions import db


class CaseFile(db.Model):
    __tablename__ = 'case_files'
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    case_id = Column(UUID(as_uuid=True), ForeignKey(
        'cases.id'), nullable=False)
    nickname = Column(String(255))
    filename = Column(String(255))
    filepath = Column(String(255), nullable=False)
    filetype = Column(String(100))
    filesize = Column(Integer)
    uploaded_at = Column(
        DateTime, nullable=False,
        default=lambda: datetime.now(timezone.utc))
    updated_at = Column(
        DateTime, nullable=False, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))
    current_version_id = Column(String, ForeignKey("case_file_versions.id"))

    case = relationship('Case', back_populates='files')
    group_items = relationship("CaseFileGroupItem", back_populates="case_file")
    versions = relationship(
        "CaseFileVersion",
        backref="file",
        cascade="all, delete-orphan",
        foreign_keys="CaseFileVersion.case_file_id"
    )

    def to_dict(self, include=None, exclude=None):
        data = {
            "id": str(self.id),
            "case_id": str(self.case_id),
            "nickname": self.nickname,
            "filename": self.filename,
            "filepath": self.filepath,
            "filetype": self.filetype,
            "filesize": self.filesize,
            "uploaded_at": int(self.uploaded_at.timestamp()) if self.uploaded_at else None,
            "updated_at": int(self.updated_at.timestamp()) if self.updated_at else None,
            "current_version_id": self.current_version_id,
        }

        if include:
            data = {k: v for k, v in data.items() if k in include}
        if exclude:
            for key in exclude:
                data.pop(key, None)

        return data
