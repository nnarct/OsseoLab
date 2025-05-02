import os
from constants.paths import UPLOAD_FOLDER
from services.url_secure_service import generate_secure_url_case_file
from models.case_files import CaseFile
from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required
from services.authService import admin_required
from models.cases import Case
from models.doctors import Doctor

from models.case_surgeons import CaseSurgeon

from flask import request, jsonify
from datetime import datetime, date
from models.enums import GenderEnum
from config.extensions import db

case_bp = Blueprint("case", __name__)

UPLOAD_FOLDER = os.getenv("CASE_FILE_UPLOAD_FOLDER")

@case_bp.route("/case/list", methods=["GET"])
@jwt_required()
@admin_required
def list_cases():
    try:
        cases = Case.query.order_by(Case.created_at.asc()).all()
        case_list = []
        for index, case in enumerate(cases, start=1):
            surgeon = case.surgeon
            case_list.append({
                "id": str(case.id),
                "surgeon": {
                    "id": str(surgeon.id),
                    "firstname": surgeon.user.firstname,
                    "lastname": surgeon.user.lastname,
                } if surgeon else None,
                "patient_name": case.patient_name,
                "patient_gender": case.patient_gender.name if case.patient_gender else None,
                "case_number": case.case_number,
                "surgery_date": int(case.surgery_date.strftime("%s")) if case.surgery_date else None,
                "created_at": int(case.created_at.timestamp()),
                "last_updated": int(case.last_updated.timestamp()),
                "order": index,
            })
        return jsonify({"statusCode": 200, "data": case_list}), 200
    except Exception as e:
        return jsonify({"statusCode": 500, "message": "Internal Server Error", "error": str(e)}), 500


# Route for creating a new case
@case_bp.route("/case/create", methods=["POST"])
@jwt_required()
@admin_required
def create_case():
    try:
        data = request.get_json()

        new_case = Case(
            surgeon_id=data.get("surgeon_id"),
            patient_name=data.get("patient_name"),
            patient_gender=GenderEnum[data["patient_gender"]] if data.get(
                "patient_gender") else None,
            scan_type=data.get("scan_type"),
            surgery_date=datetime.fromisoformat(
                data["surgery_date"]) if data.get("surgery_date") else None,
            patient_dob=datetime.fromisoformat(
                data["patient_dob"]) if data.get("patient_dob") else None,
            additional_note=data.get("additional_note"),
            problem_description=data.get("problem_description")
        )

        db.session.add(new_case)
        db.session.commit()

        return jsonify({"statusCode": 201, "message": "Case created successfully", "data": {"id": str(new_case.id)}}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"statusCode": 500, "message": "Failed to create case", "error": str(e)}), 500


# Route for retrieving a case by ID


@case_bp.route("/case/<case_id>", methods=["GET"])
@jwt_required()
@admin_required
def get_case_by_id(case_id):
    try:
        case = Case.query.get(case_id)
        if not case:
            return jsonify({"statusCode": 404, "message": "Case not found"}), 404

        files = CaseFile.query.filter_by(case_id=case_id).order_by(CaseFile.created_at).all()
        file_list = [
            {
                "id": str(f.id),
                "filename": f.filename,
                "url": generate_secure_url_case_file(str(f.id)),
                "created_at": int(f.created_at.timestamp()),
                "order": index + 1
            }
            for index, f in enumerate(files)
        ]
        print(files)

        return jsonify({"statusCode": 200, "data": {
            **case.to_dict(),
            "files": file_list
        }}), 200
    except Exception as e:
        return jsonify({"statusCode": 500, "message": "Failed to retrieve case", "error": str(e)}), 500


@case_bp.route("/case/<case_id>", methods=["PUT"])
@jwt_required()
@admin_required
def update_case(case_id):
    try:
        data = request.get_json()
        case = Case.query.get(case_id)

        if not case:
            return jsonify({"statusCode": 404, "message": "Case not found"}), 404
        print(data)

        case.patient_name = data.get("patient_name")
        case.patient_gender = GenderEnum[data["patient_gender"]] if data.get(
            "patient_gender") else None
        case.surgery_date = datetime.fromisoformat(
            data["surgery_date"]) if data.get("surgery_date") else None
        case.patient_dob = datetime.fromisoformat(
            data["patient_dob"]).date() if data.get("patient_dob") else None
        case.scan_type = data.get("scan_type")
        case.additional_note = data.get("additional_note")
        case.problem_description = data.get("problem_description")
        print(data)

        db.session.commit()
        return jsonify({"statusCode": 200, "message": "Case updated successfully"}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"statusCode": 500, "message": "Error updating case", "error": str(e)}), 500


# GET route for case select options
@case_bp.route("/case/select-options", methods=["GET"])
@jwt_required()
@admin_required
def get_case_options():
    try:
        cases = Case.query.order_by(Case.case_number).all()
        result = [
            {
                "label": f"CASE{str(case.case_number).zfill(3)}",
                "value": str(case.id)
            }
            for case in cases if case.case_number is not None
        ]
        return jsonify({"statusCode": 200, "data": result}), 200
    except Exception as e:
        return jsonify({"statusCode": 500, "message": "Failed to fetch case options", "error": str(e)}), 500


# Route for deleting a case and all related data
@case_bp.route("/case/<case_id>", methods=["DELETE"])
@jwt_required()
@admin_required
def delete_case(case_id):
    try:
        case = Case.query.get(case_id)
        if not case:
            return jsonify({"statusCode": 404, "message": "Case not found"}), 404

        # Delete related case surgeons
        CaseSurgeon.query.filter_by(case_id=case_id).delete()

        # Delete related case files and their disk files
        case_files = CaseFile.query.filter_by(case_id=case_id).all()
        for file in case_files:
            filepath = os.path.join(UPLOAD_FOLDER, file.filepath)
            if os.path.exists(filepath):
                os.remove(filepath)
            db.session.delete(file)

        db.session.delete(case)
        db.session.commit()

        return jsonify({"statusCode": 200, "message": "Case and all related data deleted"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"statusCode": 500, "message": "Failed to delete case", "error": str(e)}), 500