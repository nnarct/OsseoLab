from config.extensions import db
import uuid

class Tech(db.Model):
    __tablename__ = 'tech'

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = db.Column(db.String(36), db.ForeignKey('user.id', ondelete='CASCADE'), unique=True, nullable=False)
    department = db.Column(db.String(255), nullable=True) 

    user = db.relationship('User', back_populates='tech_profile')

    def __repr__(self):
        return f"<Tech {self.user.firstname} {self.user.lastname} (Department: {self.department})>"
