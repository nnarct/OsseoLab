from functools import wraps
from flask import request, jsonify, abort
from werkzeug.exceptions import HTTPException
from flask_jwt_extended import get_jwt, verify_jwt_in_request
from flask_jwt_extended.exceptions import NoAuthorizationError
from models.enums import RoleEnum
from models.users import User


def admin_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        claims = get_jwt()
        user_data = claims.get('userData')
        user_id = user_data.get('id')
        try:
            user = User.query.get(user_id)
        except Exception:
            abort(500, description="Database error while verifying user role.")
        if not user or user.role != RoleEnum.admin:
            abort(403, description="Access denied. Admin Only.")
        return f(*args, **kwargs)

    return decorated_function


def tech_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        claims = get_jwt()
        user_data = claims.get('userData')
        user_id = user_data.get('id')
        try:
            user = User.query.get(user_id)
        except Exception:
            abort(500, description="Database error while verifying user role.")
        if not user or user.role != RoleEnum.technician:
            abort(403, description="Access denied. Technician Only")
        return f(*args, **kwargs)
    return decorated_function


def doctor_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        claims = get_jwt()
        user_data = claims.get('userData')
        user_id = user_data.get('id')
        try:
            user = User.query.get(user_id)
        except Exception:
            abort(500, description="Database error while verifying user role.")
        if not user or user.role != RoleEnum.doctor:
            abort(403, description="Access denied. Doctor Only.")
        return f(*args, **kwargs)

    return decorated_function


def get_user_role():
    try:
        claims = get_jwt()
        user_data = claims.get('userData', {})
        role = user_data.get('role')
        if role in RoleEnum:
            return role
    except NoAuthorizationError:
        pass
    except Exception:
        pass
    return "visitor"
