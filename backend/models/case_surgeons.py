import uuid
from datetime import datetime, timezone
from enum import Enum
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy import Column, String, DateTime, ForeignKey, Enum as PgEnum, Text, Date
from sqlalchemy.orm import relationship
from flask_sqlalchemy import SQLAlchemy
from config.extensions import db
class CaseSurgeon(db.Model):
    __tablename__ = 'case_surgeons'
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    case_id = Column(UUID(as_uuid=True), ForeignKey(
        'cases.id'), nullable=False)
    surgeon_id = Column(UUID(as_uuid=True), ForeignKey(
        'doctors.id'), nullable=False)
    created_at = db.Column(db.DateTime, nullable=False,
                           default=lambda: datetime.now(timezone.utc))
    active = Column(db.Boolean, nullable=False, default=True)

    case = relationship('Case', back_populates='surgeons')
    surgeon = relationship('Doctor', back_populates='case_links')
