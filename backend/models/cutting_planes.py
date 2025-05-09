import uuid
from config.extensions import db
from datetime import datetime, timezone
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy import Column, ForeignKey, Boolean, String, DateTime
from sqlalchemy.orm import relationship


class CuttingPlane(db.Model):
    __tablename__ = "cutting_planes"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)

    # Store both original and resulting version IDs
    original_version_id = Column(String, ForeignKey(
        "case_file_versions.id", ondelete="CASCADE"), nullable=False)
    resulting_version_id = Column(String, ForeignKey(
        "case_file_versions.id", ondelete="CASCADE"), nullable=False)

    name = Column(String)
    position = Column(db.JSON, nullable=False)  # {"x": .., "y": .., "z": ..}
    normal = Column(db.JSON, nullable=False)    # {"x": .., "y": .., "z": ..}
    is_visible = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime, nullable=False,
                        default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime,  nullable=False,
                        default=lambda: datetime.now(timezone.utc),
                        onupdate=lambda: datetime.now(timezone.utc))

    # Optionally add relationships (if needed)
    # original_version = relationship("CaseFileVersion", foreign_keys=[original_version_id])
    # resulting_version = relationship("CaseFileVersion", foreign_keys=[resulting_version_id])

    def to_dict(self, include=None, exclude=None):
        data = {
            "id": str(self.id),
            "original_version_id": self.original_version_id,
            "resulting_version_id": self.resulting_version_id,
            "name": self.name,
            "position": self.position,
            "normal": self.normal,
            "is_visible": self.is_visible,
            "created_at": int(self.created_at.timestamp()) if self.created_at else None,
            "updated_at": int(self.updated_at.timestamp()) if self.updated_at else None,
        }

        if include:
            data = {k: v for k, v in data.items() if k in include}
        if exclude:
            for key in exclude:
                data.pop(key, None)

        return data
