from models.users import User
from models.technicians import Technician
from models.doctors import Doctor
from services.authService import admin_required,tech_required
from flask import Blueprint, request, jsonify, send_from_directory, current_app
from flask_jwt_extended import jwt_required, get_jwt, get_jwt_identity
import os
import uuid
from config.extensions import db
from datetime import datetime, timezone
from models.enums import RoleEnum
from models.case_technicians import CaseTechnician

dashboard_bp = Blueprint("dashboard", __name__)  # Blueprint instance


def get_users_by_role():

    user_count = User.query.count()
    admin_count = User.query.filter(User.role == RoleEnum.admin.value).count()
    tech_count = Technician.query.count()
    doctor_count = Doctor.query.count()

    return {
        "user": user_count,
        "admin": admin_count,
        "tech": tech_count,
        "doctor": doctor_count
    }


@dashboard_bp.route("/dashboard/admin", methods=["GET"])
@jwt_required()
@admin_required
def get_admin_dashboard():
    try:
        user_count = get_users_by_role()
        data = {"users": user_count}
        return jsonify({"statusCode": 200, "message": "Admin Dashboard Data", "data": data}), 200
    except Exception as e:
        return jsonify({"statusCode": 500, "error": "Internal Server Error", "message": str(e)}), 500


@dashboard_bp.route("/dashboard/technician", methods=["GET"])
@jwt_required()
@tech_required
def get_technician_dashboard():
    try:
        claims = get_jwt()
        user_id = claims.get("sub")
        technician = Technician.query.filter_by(user_id=user_id).first()
        if not technician:
            return jsonify({"statusCode": 404, "message": "Technician not found"}), 404

        case_techs = CaseTechnician.query.filter_by(technician_id=technician.id).all()
        case_ids = [str(ct.case_id) for ct in case_techs]

        data = {"assigned_case_ids": case_ids}
        return jsonify({"statusCode": 200, "message": "Engineer Dashboard Data", "data": data}), 200
    except Exception as e:
        return jsonify({"statusCode": 500, "error": "Internal Server Error", "message": str(e)}), 500
