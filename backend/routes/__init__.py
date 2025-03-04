from flask import Blueprint
from .authRoute import auth_bp
from .stlRoute import stl_bp
from .userRoute import user_bp

def register_routes(app):
    app.register_blueprint(auth_bp)
    app.register_blueprint(stl_bp)
    app.register_blueprint(user_bp)
