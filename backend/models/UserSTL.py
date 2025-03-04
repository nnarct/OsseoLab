from config.extensions import db
import uuid

class UserSTL(db.Model):  # Junction Table
    __tablename__ = 'user_stl'

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    userid = db.Column(db.String(36), db.ForeignKey('user.id', ondelete='CASCADE'), index=True)
    stlid = db.Column(db.String(36), db.ForeignKey('stl.id', ondelete='CASCADE'), index=True)

    # Define relationships
    user = db.relationship('User', back_populates='user_stl_associations')
    stl = db.relationship('STL', back_populates='users')

    def __repr__(self):
        return f"<UserSTL user_id={self.userid} stl_id={self.stlid}>"