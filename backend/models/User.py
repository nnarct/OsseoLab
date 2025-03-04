from config.extensions import db
import uuid


class User(db.Model):
    __tablename__ = 'user'

    id = db.Column(db.String(36), primary_key=True,
                   default=lambda: str(uuid.uuid4()))
    role = db.Column(db.String(20), nullable=False)
    firstname = db.Column(db.String(100), nullable=False)
    lastname = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(255), unique=True, nullable=False)
    password = db.Column(db.Text, nullable=False)

    # Relationship to UserSTL
    user_stl_associations = db.relationship(
        'UserSTL', back_populates='user', cascade="all, delete-orphan")

    # ✅ Fix: Add doctor and tech relationships
    doctor_profile = db.relationship(
        'Doctor', back_populates='user', uselist=False, cascade="all, delete-orphan")
    tech_profile = db.relationship(
        'Tech', back_populates='user', uselist=False, cascade="all, delete-orphan")

    def __repr__(self):
        return f"<User {self.firstname} {self.lastname}>"

    def to_dict(self, include_sensitive=False):
        user_dict = {
            "id": self.id,
            "role": self.role,
            "firstname": self.firstname,
            "lastname": self.lastname,
            "email": self.email
        }
        if include_sensitive:
            # Optional, avoid exposing passwords in responses
            user_dict["password"] = self.password
        return user_dict
