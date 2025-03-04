import datetime
from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token

from models.Doctor import Doctor
from models.Tech import Tech
from models.User import User
from models.enums import Role
from config.extensions import db

auth_bp = Blueprint("auth", __name__)


@auth_bp.route("/register", methods=["POST"])
def register():
    """Handles user registration"""
    data = request.json
    firstname = data.get("firstname")
    lastname = data.get("lastname")
    email = data.get("email")
    password = data.get("password")
    role = data.get("role")

    if not firstname or not lastname or not email or not password or not role:
        return jsonify({"statusCode": 400, "error": "Invalid Body", "message": "Missing required fields"}), 400

    if not Role.has_value(role):
        return jsonify({"statusCode": 400, "error": f"Invalid role. Choose from {', '.join(Role)}"}), 400

    existing_user = User.query.filter_by(email=email).first()
    if existing_user:
        return jsonify({"statusCode": 409, "error": "Email is already registered"}), 409

    hashed_password = generate_password_hash(password, method='pbkdf2:sha256')

    try:
        new_user = User(
            firstname=firstname,
            lastname=lastname,
            email=email,
            password=hashed_password,
            role=role
        )

        db.session.add(new_user)
        db.session.commit()

        if role == Role.DOCTOR:
            new_doctor = Doctor(user_id=new_user.id, hospital=None)
            db.session.add(new_doctor)

        if role == Role.TECH:
            new_tech = Tech(user_id=new_user.id, department=None)
            db.session.add(new_tech)

        db.session.commit()

        return jsonify({
            "statusCode": 201,
            "message": "User registered successfully",
            "data": {
                "id": new_user.id,
                "role": new_user.role
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
            "role": user.role,
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
