from config.extensions import db
import uuid

class Doctor(db.Model):
    __tablename__ = 'doctor'

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = db.Column(db.String(36), db.ForeignKey('user.id', ondelete='CASCADE'), unique=True, nullable=False)
    hospital = db.Column(db.String(255), nullable=True)  # Hospital name

    user = db.relationship('User', back_populates='doctor_profile')

    def __repr__(self):
        return f"<Doctor {self.user.firstname} {self.user.lastname} (Hospital: {self.hospital})>"

# {
#   "message": "User registered successfully",
#   "role": "admin",
#   "user_id": "caebdea3-9dce-4698-82e2-44dba6e99dc6"
# }