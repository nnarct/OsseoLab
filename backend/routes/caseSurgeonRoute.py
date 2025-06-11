from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from services.authService import admin_required, roles_required
from models.case_surgeons import CaseSurgeon
from models.cases import Case
from config.extensions import db
# Technician access check
from flask_jwt_extended import get_jwt
from models.technicians import Technician
from models.case_technicians import CaseTechnician

case_surgeon_bp = Blueprint("case_surgeon", __name__)


@case_surgeon_bp.route("/case-surgeon/add", methods=["POST"])
@jwt_required()
@roles_required("admin", "technician")
def add_case_surgeon():
    try:
        data = request.get_json()
        case_id = data.get("case_id")
        doctor_id = data.get("doctor_id")

        if not case_id or not doctor_id:
            return jsonify({"statusCode": 400, "message": "case_id and doctor_id are required"}), 400

        existing = CaseSurgeon.query.filter_by(
            case_id=case_id, surgeon_id=doctor_id).first()
        if existing:
            return jsonify({"statusCode": 409, "message": "This surgeon is already assigned to the case"}), 409

        new_relation = CaseSurgeon(case_id=case_id, surgeon_id=doctor_id)
        db.session.add(new_relation)
        db.session.commit()
        return jsonify({"statusCode": 201, "message": "Surgeon added to case successfully"}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"statusCode": 500, "message": "Failed to add surgeon", "error": str(e)}), 500


@case_surgeon_bp.route("/case-surgeon/case/<case_id>", methods=["GET"])
@jwt_required()
@roles_required("admin", "technician")
def get_surgeons_by_case(case_id):
    try:
    
        claims = get_jwt()
        user_id = claims.get("sub")
        role = claims.get("userData", {}).get("role")

        if role == "technician":
            technician = Technician.query.filter_by(user_id=user_id).first()
            if not technician:
                return jsonify({"statusCode": 403, "message": "Technician not found"}), 403

            case_tech = CaseTechnician.query.filter_by(case_id=case_id, technician_id=technician.id).first()
            if not case_tech:
                return jsonify({"statusCode": 403, "message": "Access denied for this case"}), 403

        case = Case.query.get(case_id)
        surgeons = CaseSurgeon.query.filter_by(
            case_id=case_id).order_by(CaseSurgeon.created_at).all()
        result = []
        for s in surgeons:
            doctor = s.surgeon
            if doctor and doctor.user:
                result.append({
                    "pair_id": str(s.id),
                    "doctor_id": str(doctor.id),
                    "firstname": doctor.user.firstname,
                    "lastname": doctor.user.lastname,
                    "active": s.active
                })
        return jsonify({"statusCode": 200, "data": {"surgeons": result, "main_surgeon": case.surgeon_id}}), 200
    except Exception as e:
        return jsonify({"statusCode": 500, "message": "Failed to fetch additional surgeons", "error": str(e)}), 500


@case_surgeon_bp.route("/case-surgeon/<pairing_id>/toggle-active", methods=["PATCH"])
@jwt_required()
@roles_required('admin','technician')
def toggle_case_surgeon_active(pairing_id):
    try:
        pairing = CaseSurgeon.query.get(pairing_id)
        if not pairing:
            return jsonify({"statusCode": 404, "message": "Pairing not found"}), 404

        claims = get_jwt()
        user_id = claims.get("sub")
        role = claims.get("userData", {}).get("role")

        if role == "technician":
            technician = Technician.query.filter_by(user_id=user_id).first()
            if not technician:
                return jsonify({"statusCode": 403, "message": "Technician not found"}), 403

            case_tech = CaseTechnician.query.filter_by(case_id=pairing.case_id, technician_id=technician.id).first()
            if not case_tech:
                return jsonify({"statusCode": 403, "message": "Access denied for this case"}), 403
        elif role != "admin":
            return jsonify({"statusCode": 403, "message": "Unauthorized role"}), 403

        pairing.active = not pairing.active
        db.session.commit()
        return jsonify({
            "statusCode": 200,
            "message": "Pairing status updated",
            "data": {
                "id": str(pairing.id),
                "active": pairing.active
            }
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"statusCode": 500, "message": "Failed to update pairing status", "error": str(e)}), 500


@case_surgeon_bp.route("/case-surgeon/<pairing_id>", methods=["DELETE"])
@jwt_required()
@admin_required
def delete_case_surgeon(pairing_id):
    try:
        pairing = CaseSurgeon.query.get(pairing_id)
        if not pairing:
            return jsonify({"statusCode": 404, "message": "Pairing not found"}), 404

        db.session.delete(pairing)
        db.session.commit()
        return jsonify({"statusCode": 200, "message": "Pairing deleted successfully"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"statusCode": 500, "message": "Failed to delete pairing", "error": str(e)}), 500
