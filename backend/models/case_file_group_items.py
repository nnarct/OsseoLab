# import uuid
# from config.extensions import db
# from datetime import datetime, timezone
# from sqlalchemy.dialects.postgresql import UUID
# from sqlalchemy import Column, ForeignKey
# from sqlalchemy.orm import relationship
# from sqlalchemy import Column, Boolean, String, DateTime, ForeignKey, Integer


# class CaseFileGroupItem(db.Model):
#     __tablename__ = "case_file_group_items"
#     id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
#     group_id = Column(String, ForeignKey(
#         "case_file_groups.id"), nullable=False)
#     case_file_id = Column(String, ForeignKey(
#         "case_files.id"), nullable=False)
#     display_order = Column(Integer, default=0)
#     is_visible = Column(Boolean, default=True)
#     created_at = Column(
#         DateTime, nullable=False,
#         default=lambda: datetime.now(timezone.utc))
#     updated_at = Column(DateTime, default=lambda: datetime.now(
#         timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

#     case_file = relationship("CaseFile", back_populates="group_items")

#     def to_dict(self, include=None, exclude=None):
#         data = {
#             "id": str(self.id),
#             "group_id": self.group_id,
#             "case_file_id": self.case_file_id,
#             "display_order": self.display_order,
#             "is_visible": self.is_visible,
#             "created_at": int(self.created_at.timestamp()) if self.created_at else None,
#             "updated_at":  int(self.created_at.timestamp() )if self.updated_at else None,
#         }

#         if include:
#             data = {k: v for k, v in data.items() if k in include}
#         if exclude:
#             for key in exclude:
#                 data.pop(key, None)

#         return data
