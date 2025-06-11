import uuid
from datetime import datetime, timezone
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy import Column, String, Date, Text
from config.extensions import db


class QuickCase(db.Model):
    __tablename__ = 'quick_cases'

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    firstname = Column(String(255), nullable=False)
    lastname = Column(String(255), nullable=False)
    email = Column(String(255), nullable=False)
    phone = Column(String(20), nullable=False)
    country = Column(String(100), nullable=False)
    product = Column(String(255), nullable=False)
    other_product = Column(String(255), nullable=True)
    anatomy = Column(String(255), nullable=False)
    surgery_date = Column(Date, nullable=False)
    additional_info = Column(Text, nullable=True)
    created_at = Column(
        db.DateTime, nullable=False,
        default=lambda: datetime.now(timezone.utc))

    def to_dict(self, include=None, exclude=None):
        data = {
            "id": str(self.id),
            "firstname": self.firstname,
            "lastname": self.lastname,
            "email": self.email,
            "phone": self.phone,
            "country": self.country,
            "product": self.product,
            "other_product": self.other_product,
            "anatomy": self.anatomy,
            "surgery_date": int(datetime.combine(self.surgery_date, datetime.min.time()).timestamp()) if self.surgery_date else None,
            "additional_info": self.additional_info,
            "created_at": int(self.created_at.timestamp()) if self.created_at else None,
        }

        if include:
            data = {k: v for k, v in data.items() if k in include}
        if exclude:
            data = {k: v for k, v in data.items() if k not in exclude}

        return data
