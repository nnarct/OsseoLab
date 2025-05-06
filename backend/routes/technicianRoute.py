from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required
from services.authService import admin_required
from models.technicians import Technician
from models.users import User

technician_bp = Blueprint("technician", __name__)

@technician_bp.route("/technician/select-options", methods=["GET"])
@jwt_required()
@admin_required
def get_technician_dropdown_options():
    try:
        technicians = Technician.query.join(Technician.user).order_by(
            User.firstname.asc(), User.lastname.asc()).all()
        return jsonify({
            "statusCode": 200,
            "data": [
                {
                    "id": str(technician.id),
                    "firstname": technician.user.firstname,
                    "lastname": technician.user.lastname
                }
                for technician in technicians if technician.user
            ]
        }), 200
    except Exception as e:
        return jsonify({
            "statusCode": 500,
            "message": "Failed to fetch technician options",
            "error": str(e)
        }), 500


# New route: /technician/list
@technician_bp.route("/technician/list", methods=["GET"])
@jwt_required()
@admin_required
def list_technicians():
    try:
        technicians = Technician.query.order_by(Technician.created_at.asc()).all()
        return jsonify({
            "statusCode": 200,
            "data": [technician.to_dict() for technician in technicians]
        }), 200
    except Exception as e:
        return jsonify({
            "statusCode": 500,
            "message": "Failed to fetch technicians",
            "error": str(e)
        }), 500
