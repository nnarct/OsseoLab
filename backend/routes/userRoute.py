from config.extensions import db
import os
from models.case_files import CaseFile
from models.case_surgeons import CaseSurgeon
from models.cases import Case
import datetime
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity, create_access_token
from models.users import User
from models.enums import RoleEnum
from services.file_service import get_case_files_upload_folder
from services.authService import admin_required
# from werkzeug.exceptions import HTTPException

user_bp = Blueprint("user", __name__, url_prefix="/user")

@user_bp.route("/list", methods=["GET"])
@jwt_required()
@admin_required
def list_users():
    users = User.query.order_by(
        User.created_at.asc()).all()
    return jsonify({
        "statusCode": 200,
        "data": [
            {**user.to_dict(), "order": index + 1}
            for index, user in enumerate(users)
        ]
    }), 200


@user_bp.route("/admin/list", methods=["GET"])
@jwt_required()
@admin_required
def list_admins():
    admins = User.query.filter_by(role=RoleEnum.admin.value).order_by(
        User.created_at.asc()).all()
    return jsonify({
        "statusCode": 200,
        "data": [
            {**user.to_dict(), "order": index + 1}
            for index, user in enumerate(admins)
        ]
    }), 200


@user_bp.route("/technician/list", methods=["GET"])
@jwt_required()
@admin_required
def list_technicians():
    technicians = User.query.filter_by(role=RoleEnum.technician.value).order_by(
        User.created_at.asc()).all()
    return jsonify({
        "statusCode": 200,
        "data": [
            {**user.to_dict(), "order": index + 1}
            for index, user in enumerate(technicians)
        ]
    }), 200


@user_bp.route("/doctor/list", methods=["GET"])
@jwt_required()
@admin_required
def list_doctors():
    doctors = User.query.filter_by(role=RoleEnum.doctor.value).order_by(
        User.created_at.asc()).all()
    return jsonify({
        "statusCode": 200,
        "data": [
            {**user.to_dict(), "order": index + 1}
            for index, user in enumerate(doctors)
        ]
    }), 200


@user_bp.route("/me", methods=["GET"])
@jwt_required()
def get_current_user():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if not user:
        return jsonify({"statusCode": 404, "error": "User not found"}), 404
    data = user.to_dict()
    if user.role == RoleEnum.doctor and user.doctor_profile:
        data["hospital"] = user.doctor_profile.hospital
        data["reference"] = user.doctor_profile.reference
        data["doctor_registration_id"] = user.doctor_profile.doctor_registration_id
    return jsonify({
        "statusCode": 200,
        "data": data
    }), 200


@user_bp.route("/me", methods=["PUT"])
@jwt_required()
def update_current_user():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if not user:
        return jsonify({"statusCode": 404, "error": "User not found"}), 404

    data = request.get_json()
    print(data)
    restricted_fields = {
        "id",
        "password",
        "email",
        "role",
        "profile_pic_image"}

    for key, value in data.items():
        if key in restricted_fields:
            continue
        if hasattr(user, key):
            setattr(user, key, value)

    from config.extensions import db

    # Update doctor profile fields if user is a doctor
    if user.role == RoleEnum.doctor:
        doctor_profile = user.doctor_profile
        if doctor_profile:
            if "hospital" in data:
                doctor_profile.hospital = data["hospital"]
            if "reference" in data:
                doctor_profile.reference = data["reference"]
            if "doctor_registration_id" in data:
                doctor_profile.doctor_registration_id = data["doctor_registration_id"]

    db.session.commit()
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
        additional_claims={
            "userData": user_data},
        expires_delta=expires
    )

    return jsonify({
        "statusCode": 200,
        "message": "User updated successfully",
        "accessToken": access_token,
        "data": user.to_dict(exclude={"created_at", "last_updated"})
    }), 200


@user_bp.route("/<user_id>", methods=["DELETE"])
@jwt_required()
@admin_required
def delete_user(user_id):
    try:
        user = User.query.get(user_id)
        if not user:
            return jsonify({"statusCode": 404, "message": "User not found"}), 404

        # If user is a doctor, delete all related cases
        if user.technician_profile:
            db.session.delete(user.technician_profile)

        if user.doctor_profile:
            doctor = user.doctor_profile
            doctor_id = doctor.id
            # doctor_case_surgeon = CaseSurgeon.query.filter_by(
            #     surgeon_id=doctor_id).delete()

            doctor_cases = Case.query.filter_by(surgeon_id=doctor_id).all()
            for case in doctor_cases:
                #    Delete case surgeons
                CaseSurgeon.query.filter_by(case_id=case.id).delete()

            # Delete case files from DB and disk
                case_files = CaseFile.query.filter_by(case_id=case.id).all()
                for file in case_files:
                    filepath = os.path.join(
                        get_case_files_upload_folder(), file.filepath)
                    if os.path.exists(filepath):
                        os.remove(filepath)
                    db.session.delete(file)

                db.session.delete(case)

            db.session.delete(doctor)

        db.session.delete(user)
        db.session.commit()

        return jsonify({"statusCode": 200, "message": "User and related data deleted successfully"}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"statusCode": 500, "message": "Failed to delete user", "error": str(e)}), 500


@user_bp.route("/<user_id>", methods=["GET"])
@jwt_required()
@admin_required
def get_user_by_id(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({"statusCode": 404, "error": "User not found"}), 404
    return jsonify({
        "statusCode": 200,
        "data": user.to_dict()
    }), 200


@user_bp.route("/<user_id>", methods=["PUT"])
@jwt_required()
@admin_required
def update_user_by_id(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({"statusCode": 404, "error": "User not found"}), 404

    data = request.get_json()
    restricted_fields = {
        "id", "password",  "role", "profile_pic_image"
    }

    for key, value in data.items():
        if key in restricted_fields:
            continue
        if hasattr(user, key):
            setattr(user, key, value)

    db.session.commit()
    return jsonify({
        "statusCode": 200,
        "message": "User updated successfully",
        "data": user.to_dict()
    }), 200
