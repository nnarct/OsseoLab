from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from services.authService import admin_required
from models.case_technicians import CaseTechnician
from config.extensions import db

case_technician_bp = Blueprint("case_technician", __name__)


@case_technician_bp.route("/case-technician/add", methods=["POST"])
@jwt_required()
@admin_required
def add_case_technician():
    try:
        data = request.get_json()
        case_id = data.get("case_id")
        technician_id = data.get("technician_id")

        if not case_id or not technician_id:
            return jsonify({"statusCode": 400, "message": "case_id and technician_id are required"}), 400

        existing = CaseTechnician.query.filter_by(
            case_id=case_id, technician_id=technician_id).first()
        if existing:
            return jsonify({"statusCode": 409, "message": "This technician is already assigned to the case"}), 409

        new_relation = CaseTechnician(
            case_id=case_id, technician_id=technician_id)
        db.session.add(new_relation)
        db.session.commit()

        return jsonify({"statusCode": 201, "message": "Surgeon added to case successfully"}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"statusCode": 500, "message": "Failed to add technician", "error": str(e)}), 500


@case_technician_bp.route("/case-technician/case/<case_id>", methods=["GET"])
@jwt_required()
@admin_required
def get_technicians_by_case(case_id):
    try:
        technicians = CaseTechnician.query.filter_by(
            case_id=case_id).order_by(CaseTechnician.created_at).all()
        result = []
        for s in technicians:
            technician = s.technician
            if technician and technician.user:
                result.append({
                    "pair_id": str(s.id),
                    "technician_id": str(technician.id),
                    "firstname": technician.user.firstname,
                    "lastname": technician.user.lastname,
                    "active": s.active
                })
        return jsonify({"statusCode": 200, "data": result}), 200
    except Exception as e:
        return jsonify({"statusCode": 500, "message": "Failed to fetch additional technicians", "error": str(e)}), 500


@case_technician_bp.route("/case-technician/<pairing_id>/toggle-active", methods=["PATCH"])
@jwt_required()
@admin_required
def toggle_case_technician_active(pairing_id):
    try:
        pairing = CaseTechnician.query.get(pairing_id)
        if not pairing:
            return jsonify({"statusCode": 404, "message": "Pairing not found"}), 404

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


@case_technician_bp.route("/case-technician/<pairing_id>", methods=["DELETE"])
@jwt_required()
@admin_required
def delete_case_technician(pairing_id):
    try:
        pairing = CaseTechnician.query.get(pairing_id)
        if not pairing:
            return jsonify({"statusCode": 404, "message": "Pairing not found"}), 404

        db.session.delete(pairing)
        db.session.commit()
        return jsonify({"statusCode": 200, "message": "Pairing deleted successfully"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"statusCode": 500, "message": "Failed to delete pairing", "error": str(e)}), 500
