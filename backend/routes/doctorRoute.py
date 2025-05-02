from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required
from services.authService import admin_required
from models.doctors import Doctor
from models.users import User

doctor_bp = Blueprint("doctor", __name__)

@doctor_bp.route("/doctor/select-options", methods=["GET"])
@jwt_required()
@admin_required
def get_doctor_dropdown_options():
    try:
        doctors = Doctor.query.join(Doctor.user).order_by(
            User.firstname.asc(), User.lastname.asc()).all()
        return jsonify({
            "statusCode": 200,
            "data": [
                {
                    "id": str(doctor.id),
                    "firstname": doctor.user.firstname,
                    "lastname": doctor.user.lastname
                }
                for doctor in doctors if doctor.user
            ]
        }), 200
    except Exception as e:
        return jsonify({
            "statusCode": 500,
            "message": "Failed to fetch doctor options",
            "error": str(e)
        }), 500
