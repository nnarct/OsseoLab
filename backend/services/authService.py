from functools import wraps
from flask import request, jsonify, abort
from werkzeug.exceptions import HTTPException
from flask_jwt_extended import get_jwt, verify_jwt_in_request, get_jwt_identity
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
        except Exception as e:
            abort(500, description=f"Database error while verifying user. {e}")
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
        except Exception as e:
            abort(500, description=f"Database error while verifying user. {e}")
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
        except Exception as e:
            abort(500, description=f"Database error while verifying user. {e}")
        if not user or user.role != RoleEnum.doctor:
            abort(403, description="Access denied. Doctor Only.")
        return f(*args, **kwargs)

    return decorated_function


# New decorator for allowing multiple roles
def roles_required(*allowed_roles):
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            try:
                claims = get_jwt()
                user_data = claims.get('userData')
                user_id = user_data.get('id')
                user_role = user_data.get('role')
            except Exception:
                abort(401, description="Invalid or missing token.")

            if user_role not in allowed_roles:
                abort(403, description="Access denied. Role not permitted.")

            try:
                user = User.query.get(user_id)
            except Exception as e:
                abort(500, description=f"Database error while verifying user. {e}")

            if not user:
                abort(403, description="User not found.")

            return f(*args, **kwargs)
        return decorated_function
    return decorator


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

def get_current_user():
    user_id = get_jwt_identity()
    return User.query.get(user_id)