from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from services.authService import admin_required
from werkzeug.security import generate_password_hash
from models.enums import RoleEnum
from models.users import User
from models.doctors import Doctor
from models.technicians import Technician
from config.extensions import db
from datetime import datetime

create_user_bp = Blueprint("create_user", __name__)


@create_user_bp.route("/admin/create/doctor", methods=["POST"])
@jwt_required()
@admin_required
def admin_create_doctor():
    data = request.json
    required_fields = ["firstname", "lastname",
                       "username", "email", "password", "role"]
    if not all(data.get(field) for field in required_fields):
        return jsonify({"statusCode": 400, "message": "Missing required fields"}), 400

    if not RoleEnum.doctor.value == data["role"]:
        return jsonify({"statusCode": 400, "message": "Invalid role"}), 400

    if User.query.filter_by(email=data["email"]).first():
        return jsonify({"statusCode": 409, "message": "Email already exists"}), 409

    try:
        hashed_pw = generate_password_hash(
            data["password"], method='pbkdf2:sha256')
        phone = data.get("phone")
        country = data.get("country")
        gender = data.get("gender")
        dob_str = data.get("dob")
        dob = datetime.fromisoformat(dob_str) if dob_str else None

        new_user = User(
            firstname=data["firstname"],
            lastname=data["lastname"],
            username=data["username"],
            email=data["email"],
            password=hashed_pw,
            role=RoleEnum.doctor,
            phone=phone,
            country=country,
            gender=gender,
            dob=dob
        )
        db.session.add(new_user)
        db.session.commit()

        if data["role"] == RoleEnum.doctor.value:
            db.session.add(Doctor(user_id=new_user.id))

        db.session.commit()

        return jsonify({"statusCode": 201, "message": "User created successfully", "data": {"id": new_user.id}}), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"statusCode": 500, "message": "Failed to create user", "error": str(e)}), 500


@create_user_bp.route("/admin/create/admin", methods=["POST"])
@jwt_required()
@admin_required
def admin_create_admin():
    data = request.json
    required_fields = ["firstname", "lastname",
                       "username", "email", "password", "role"]
    if not all(data.get(field) for field in required_fields):
        return jsonify({"statusCode": 400, "message": "Missing required fields"}), 400

    if not RoleEnum.admin.value == data["role"]:
        return jsonify({"statusCode": 400, "message": "Invalid role"}), 400

    if User.query.filter_by(email=data["email"]).first():
        return jsonify({"statusCode": 409, "message": "Email already exists"}), 409

    try:
        hashed_pw = generate_password_hash(
            data["password"], method='pbkdf2:sha256')
        phone = data.get("phone")
        country = data.get("country")
        gender = data.get("gender")
        dob_str = data.get("dob")
        dob = datetime.fromisoformat(dob_str) if dob_str else None

        new_user = User(
            firstname=data["firstname"],
            lastname=data["lastname"],
            username=data["username"],
            email=data["email"],
            password=hashed_pw,
            role=RoleEnum.admin,
            phone=phone,
            country=country,
            gender=gender,
            dob=dob
        )
        db.session.add(new_user)
        db.session.commit()

        db.session.commit()

        return jsonify({"statusCode": 201, "message": "User created successfully", "data": {"id": new_user.id}}), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"statusCode": 500, "message": "Failed to create user", "error": str(e)}), 500
