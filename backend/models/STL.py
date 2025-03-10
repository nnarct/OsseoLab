from config.extensions import db
import uuid


class STL(db.Model):
    __tablename__ = 'stl'

    id = db.Column(db.String(36), primary_key=True,
                   default=lambda: str(uuid.uuid4()))
    filename = db.Column(db.String(255), nullable=False)
    filepath = db.Column(db.Text, nullable=False)
    original_filename = db.Column(db.String(255), nullable=False)

    # Relationship to UserSTL
    users = db.relationship(
        'UserSTL', back_populates='stl', cascade="all, delete-orphan")

    def __repr__(self):
        return f"<STL {self.filename} (ID: {self.id})>"
