import uuid
from config.extensions import db
from datetime import datetime, timezone
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy import Column, ForeignKey, Integer, String, DateTime
from sqlalchemy.orm import relationship
from .case_files import CaseFile


class CaseFileVersion(db.Model):
    __tablename__ = "case_file_versions"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    case_file_id = Column(String, ForeignKey("case_files.id"), nullable=False)
    version_number = Column(Integer, nullable=False)
    file_path = Column(String, nullable=False)
    uploaded_at = Column(DateTime, default=datetime.utcnow)
    uploaded_by = Column(String)  # user_id

    cutting_planes = relationship(
        "models.cutting_planes.CuttingPlane", backref="version", cascade="all, delete-orphan")

    # backref for current version reference
    file_as_current = relationship(
        "CaseFile", backref="current_version", foreign_keys=[
            CaseFile.current_version_id], uselist=False)

    def to_dict(self, include=None, exclude=None):
        data = {
            "id": str(self.id),
            "case_file_id": self.case_file_id,
            "version_number": self.version_number,
            "file_path": self.file_path,
            "uploaded_at": int(self.uploaded_at.timestamp()) if self.uploaded_at else None,
            "uploaded_by": self.uploaded_by,
        }

        if include:
            data = {k: v for k, v in data.items() if k in include}
        if exclude:
            for key in exclude:
                data.pop(key, None)

        return data
