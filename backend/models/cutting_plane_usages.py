# import uuid
# from datetime import datetime, timezone
# from sqlalchemy.dialects.postgresql import UUID
# from sqlalchemy import Column, String, DateTime, ForeignKey, Enum as PgEnum, Text, Date, Integer
# from sqlalchemy.orm import relationship
# from config.extensions import db
# from .enums import GenderEnum
# from datetime import datetime, date
# # Auto-increment case_number if not set
# from sqlalchemy import event, select, func



# class CuttingPlaneUsage(db.Model):
#     __tablename__ = "cutting_plane_usages"
#     id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
#     cutting_plane_id = Column(UUID(as_uuid=True), ForeignKey("cutting_planes.id", ondelete="CASCADE"), nullable=False)
#     version_id = Column(UUID(as_uuid=True), ForeignKey("case_file_versions.id", ondelete="CASCADE"), nullable=False)
# # todo: add created at
#     version = relationship("CaseFileVersion", back_populates="cutting_plane_usages", foreign_keys=[version_id])

#     def to_dict(self, include=None, exclude=None):
#         data = {
#             "id": str(self.id),
#             "cutting_plane_id": str(self.cutting_plane_id),
#             "version_id": str(self.version_id),
#         }

#         if include:
#             data = {k: v for k, v in data.items() if k in include}
#         if exclude:
#             data = {k: v for k, v in data.items() if k not in exclude}

#         return data
