from functools import wraps
from flask import request, jsonify, abort
from werkzeug.exceptions import HTTPException
from flask_jwt_extended import get_jwt
from models.enums import Role


def admin_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        claims = get_jwt()
        user_data = claims.get('userData')
        if user_data.get('role') != Role.ADMIN:

            abort(403, description="Access denied. Admin Only.")

        return f(*args, **kwargs)

    return decorated_function


def tech_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        claims = get_jwt()
        user_data = claims.get('userData')
        if user_data.get('role') != Role.TECH:

            abort(403, description="Access denied. Technician Only")
        return f(*args, **kwargs)
    return decorated_function


def doctor_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        claims = get_jwt()
        user_data = claims.get('userData')
        if user_data.get('role') != Role.DOCTOR:

            abort(403, description="Access denied. Doctor Only.")

        return f(*args, **kwargs)

    return decorated_function
