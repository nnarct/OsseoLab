import datetime
from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token
from services.authService import get_user_role
# Add user existence check endpoint
from flask_jwt_extended import get_jwt, jwt_required

from models.doctors import Doctor
from models.technicians import Technician
from models.users import User
from models.enums import RoleEnum
from config.extensions import db

auth_bp = Blueprint("auth", __name__)


@auth_bp.route("/health", methods=["GET"])
def health_check():
    """Health check endpoint"""
    return jsonify({"statusCode": 200, "message": "Server is running"}), 200


@auth_bp.route("/register", methods=["POST"])
def register():
    print("Frontend Request to Register")
    data = request.json
    firstname = data.get("firstname")
    lastname = data.get("lastname")
    username = data.get("username")
    email = data.get("email")
    password = data.get("password")
    role = data.get("role")

    if not firstname or not lastname or not username or not email or not password or not role:
        return jsonify({"statusCode": 400, "error": "Invalid Body", "message": "Missing required fields"}), 400

    if not RoleEnum.has_value(role):
        return jsonify({"statusCode": 400, "error": f"Invalid role. Choose from {', '.join(RoleEnum)}"}), 400
    try:
        existing_user = User.query.filter_by(email=email).first()
        if existing_user:
            return jsonify({"statusCode": 409, "error": "Email is already registered"}), 409
    except Exception as e:
        return jsonify({"statusCode": 500, "error": "Internal Server Error", "message": str(e)}), 500

    try:
        hashed_password = generate_password_hash(
            password, method='pbkdf2:sha256')
        new_user = User(
            firstname=firstname,
            lastname=lastname,
            username=username,
            email=email,
            password=hashed_password,
            role=role
        )

        db.session.add(new_user)
        db.session.commit()

        if role == RoleEnum.doctor.value:
            new_doctor = Doctor(user_id=new_user.id, hospital=None)
            db.session.add(new_doctor)

        if role == RoleEnum.technician.value:
            # new_tech = Technician(user_id=new_user.id, department=None)
            new_tech = Technician(user_id=new_user.id)
            db.session.add(new_tech)

        db.session.commit()

        return jsonify({
            "statusCode": 201,
            "message": "User registered successfully",
            "data": {
                "id": new_user.id,
                "role": new_user.role.value
            }
        }), 201

    except Exception as e:
        db.session.rollback()
        db.session.delete(new_user)
        db.session.commit()

        return jsonify({
            "statusCode": 500,
            "error": "Registration failed. Please try again.",
            "message": str(e)
        }), 500


@auth_bp.route("/login", methods=["POST"])
def login():
    """Handles user login"""
    try:
        print("Frontend Request to Login")
        data = request.json
        email = data.get("email")
        password = data.get("password")

        if not email or not password:
            return jsonify({"error": "Missing email or password"}), 400

        user = User.query.filter_by(email=email).first()

        if not user or not check_password_hash(user.password, password):
            return jsonify({"statusCode": 401, "error": "Invalid email or password"}), 401

        user_data = {
            "id": user.id,
            "role": user.role.value,
            "firstname": user.firstname,
            "lastname": user.lastname,
            "email": user.email
        }
        expires = datetime.timedelta(weeks=4)

        access_token = create_access_token(
            identity=user.id,
            additional_claims={"userData": user_data},
            expires_delta=expires
        )

        return jsonify({
            "statusCode": 200,
            "message": "Login successful",
            "data": {
                "accessToken": access_token,
                "userData": user_data
            }
        }), 200

    except Exception as e:
        print(f"An error occurred: {e}")
        return jsonify({
            "statusCode": 500,
            "message": "Internal Server Error",
            "error": f"An error occurred: {e}"
        }), 500


@auth_bp.route("/auth/permission", methods=["GET"])
def get_role():
    """Returns the role of the authenticated user or 'visitor' if unauthenticated"""
    try:
        role = get_user_role()
        return jsonify({
            "statusCode": 200,
            "message": f"You have permission of {role}",
            "data": {
                "role": role.value,
            }
        }), 200
    except Exception as e:
        return jsonify({
            "statusCode": 500,
            "message": "Internal Server Error",
            "error": str(e)
        }), 500


@auth_bp.route("/auth/exist", methods=["GET"])
@jwt_required()
def check_user_exists():
    try:
        claims = get_jwt()
        user_data = claims.get("userData")
        user_id = user_data.get("id")

        user = User.query.get(user_id)
        if not user:
            return jsonify({
                "statusCode": 404,
                "message": "User not found"
            }), 404

        return jsonify({
            "statusCode": 200,
            "message": "User exists"
        }), 200

    except Exception as e:
        return jsonify({
            "statusCode": 500,
            "message": "Error verifying user existence",
            "error": str(e)
        }), 500
