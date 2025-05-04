import os
import uuid
from datetime import datetime, timezone
from flask import current_app
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy import Column, String, DateTime, Integer, ForeignKey
from config.extensions import db
from sqlalchemy import event

class QuickCaseFile(db.Model):
    __tablename__ = 'quick_case_files'

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    quick_case_id = Column(UUID(as_uuid=True), ForeignKey(
        'quick_cases.id', ondelete='CASCADE'), nullable=False)
    filename = Column(String(255), nullable=False)
    filepath = Column(String(255), nullable=False)
    filetype = Column(String(100))
    filesize = Column(Integer)
    uploaded_at = Column(db.DateTime, nullable=False,
                         default=lambda: datetime.now(timezone.utc))

    quick_case = db.relationship(
        'QuickCase', backref=db.backref('files', cascade='all, delete'))

    @staticmethod
    def delete_files_from_disk(quick_case_id: str):
        folder_path = os.path.join(current_app.root_path, "uploads", "quick_cases", quick_case_id)
        if os.path.exists(folder_path):
            for f in os.listdir(folder_path):
                os.remove(os.path.join(folder_path, f))
            os.rmdir(folder_path)

    def to_dict(self, exclude: set[str] = None, include: set[str] = None):
        data = {
            "id": str(self.id),
            "quick_case_id": str(self.quick_case_id),
            "filename": self.filename,
            "filepath": self.filepath,
            "filetype": self.filetype,
            "filesize": self.filesize,
            "uploaded_at": int(self.uploaded_at.timestamp()) if self.uploaded_at else None,
        }

        if include is not None:
            if exclude:
                return {k: v for k, v in data.items() if k in include and k not in exclude}
            return {k: v for k, v in data.items() if k in include}
        if exclude:
            return {k: v for k, v in data.items() if k not in exclude}

        return data



@event.listens_for(QuickCaseFile, 'after_delete')
def delete_file_from_disk(mapper, connection, target):
    file_path = os.path.join(current_app.root_path, target.filepath)
    try:
        if os.path.exists(file_path):
            os.remove(file_path)

        # Attempt to remove the case folder if it's empty
        folder_path = os.path.dirname(file_path)
        if os.path.isdir(folder_path) and not os.listdir(folder_path):
            os.rmdir(folder_path)
    except Exception:
        pass
