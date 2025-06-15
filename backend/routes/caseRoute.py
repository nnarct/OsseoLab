
import os
from constants.paths import UPLOAD_FOLDER
from services.url_secure_service import generate_secure_url_case_file
from models.case_files import CaseFile
from flask import Blueprint, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt, get_jwt_identity
from services.authService import admin_required, roles_required
from services.authService import get_current_user
from models.enums import RoleEnum
from models.cases import Case
from models.doctors import Doctor
from models.technicians import Technician

from models.case_surgeons import CaseSurgeon
from models.case_technicians import CaseTechnician
from models.case_file_versions import CaseFileVersion

from flask import request, jsonify
from datetime import datetime, date
from models.enums import GenderEnum
from config.extensions import db
from werkzeug.utils import secure_filename
from services.file_service import get_case_files_upload_folder

case_bp = Blueprint("case", __name__)


@case_bp.route("/case/list", methods=["GET"])
@jwt_required()
@roles_required(RoleEnum.admin.value, RoleEnum.doctor.value, RoleEnum.technician.value)
def list_cases():
    try:
        user = get_current_user()

        if user.role == RoleEnum.admin:
            cases = Case.query.order_by(Case.created_at.asc()).all()
        elif user.role == RoleEnum.doctor:
            doctor = Doctor.query.filter_by(user_id=user.id).first()
            if not doctor:
                return jsonify({"statusCode": 404, "message": "Case list not found"}), 404
            case_ids = [cs.case_id for cs in CaseSurgeon.query.filter_by(
                surgeon_id=doctor.id, active=True).all()]
            cases = Case.query.filter(Case.id.in_(case_ids)).order_by(
                Case.created_at.asc()).all()
        elif user.role == RoleEnum.technician:
            technician = Technician.query.filter_by(user_id=user.id).first()
            if not technician:
                return jsonify({"statusCode": 404, "message": "Case list not found"}), 404
            case_ids = [cs.case_id for cs in CaseTechnician.query.filter_by(
                technician_id=technician.id, active=True).all()]
            cases = Case.query.filter(Case.id.in_(case_ids)).order_by(
                Case.created_at.asc()).all()
        else:
            return jsonify({"statusCode": 403, "message": "Forbidden"}), 403

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
                "case_code": case.case_code,
                "case_number": case.case_number,
                "surgery_date": int(case.surgery_date.timestamp()) if isinstance(case.surgery_date, datetime) else int(datetime.combine(case.surgery_date, datetime.min.time()).timestamp()) if case.surgery_date else None,
                "created_at": int(case.created_at.timestamp()) if isinstance(case.created_at, datetime) else int(datetime.combine(case.created_at, datetime.min.time()).timestamp()) if case.created_at else None,
                "uploaded_at": int(case.updated_at.timestamp()) if isinstance(case.updated_at, datetime) else int(datetime.combine(case.updated_at, datetime.min.time()).timestamp()) if case.updated_at else None,
                "order": index,
            })
        return jsonify({"statusCode": 200, "data": case_list}), 200
    except Exception as e:
        return jsonify({"statusCode": 500, "message": "Internal Server Error", "error": str(e)}), 500


# Route for creating a new case
@case_bp.route("/case/create", methods=["POST"])
@jwt_required()
@roles_required('admin', 'technician')
def create_case():
    try:
        # Accept both JSON and form-data for flexibility with files
        if request.content_type and request.content_type.startswith("multipart/form-data"):
            data = request.form
        else:
            data = request.get_json()
        created_by = get_jwt()["userData"]["id"]

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
            problem_description=data.get("problem_description"),
            case_code=data.get("case_code"),
            status=data.get("status"),
            priority=data.get("priority"),
            created_by=created_by,
            product=data.get("product"),
            anticipated_ship_date=datetime.fromisoformat(data["anticipated_ship_date"]).date(
            ) if data.get("anticipated_ship_date") else None,
        )

        db.session.add(new_case)
        db.session.commit()

        # Create CaseTechnician relationship if created by technician
        creator = get_current_user()
        if creator.role == RoleEnum.technician:
            technician = Technician.query.filter_by(user_id=created_by).first()
            if technician:
                new_relation = CaseTechnician(
                    case_id=new_case.id, technician_id=technician.id)
                db.session.add(new_relation)
                db.session.commit()

        # --- Save uploaded files ---
        upload_folder = os.path.join(
            get_case_files_upload_folder(), str(new_case.id))
        os.makedirs(upload_folder, exist_ok=True)
        upload_folder = os.path.join(
            get_case_files_upload_folder(), str(new_case.id))
        os.makedirs(upload_folder, exist_ok=True)
        files = request.files.getlist("files")
        user_id = get_jwt_identity()
        from models.case_file_versions import CaseFileVersion
        from services.file_service import resolve_filename_conflict

        for file in files:

            filename = secure_filename(file.filename)
            filename = resolve_filename_conflict(upload_folder, filename)
            filepath = os.path.join(upload_folder, filename)
            file.save(filepath)

            # get file size
            file.stream.seek(0, os.SEEK_END)
            filesize = file.stream.tell()
            file.stream.seek(0)

            temp_case_file = CaseFile(
                case_id=new_case.id,
                original_filename=filename,
            )

            db.session.add(temp_case_file)
            db.session.flush()

            new_version = CaseFileVersion(
                case_file_id=temp_case_file.id,
                version_number=1,
                file_path=os.path.relpath(
                    filepath, start=get_case_files_upload_folder()),
                filename=filename,
                nickname=filename,
                filetype=file.content_type,
                filesize=filesize,
                uploaded_by=user_id
            )
            db.session.add(new_version)
            db.session.flush()

            temp_case_file.current_version_id = new_version.id
            db.session.add(temp_case_file)

        db.session.commit()

        return jsonify({"statusCode": 201, "message": "Case created successfully", "data": {"id": str(new_case.id)}}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"statusCode": 500, "message": "Failed to create case", "error": str(e)}), 500


# Route for retrieving a case by ID
@case_bp.route("/case/<case_id>", methods=["GET"])
@jwt_required()
@roles_required("admin", "doctor", "technician")
def get_case_by_id(case_id):
    try:
        case = Case.query.get(case_id)
        if not case:
            return jsonify({"statusCode": 404, "message": "Case not found"}), 404

        files = CaseFile.query.filter_by(
            case_id=case_id).order_by(CaseFile.created_at).all()
        file_list = []
        urls = []
        names = []
        for index, f in enumerate(files):
            version = f.current_version
            if version:
                file_list.append({
                    "id": str(f.id),
                    "version_id": version.id,
                    "filename": version.filename,
                    "nickname": version.nickname,
                    # "urls": generate_secure_url_case_file(str(version.id)),
                    # "urls": urls,
                    "active": f.active,
                    "filetype": version.filetype,
                    "filesize": version.filesize,
                    "created_at": int(f.created_at.timestamp()) if f.created_at else None,
                    "order": index + 1
                })
                if (f.active):
                    urls.append(generate_secure_url_case_file(
                        str(f.current_version_id)))
                    names.append(version.nickname)

        return jsonify({"statusCode": 200, "data": {
            **case.to_dict(),
            "urls": urls,
            'names': names,
            "files": file_list
        }}), 200
    except Exception as e:
        return jsonify({"statusCode": 500, "message": "Failed to retrieve case", "error": str(e)}), 500


@case_bp.route("/case/<case_id>", methods=["PUT"])
@jwt_required()
@roles_required('admin', 'doctor', 'technician')
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
        case.case_code = data.get("case_code")
        case.status = data.get("status")
        case.priority = data.get("priority")
        case.product = data.get("product")
        case.anticipated_ship_date = datetime.fromisoformat(
            data["anticipated_ship_date"]).date() if data.get("anticipated_ship_date") else None
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

        CaseSurgeon.query.filter_by(case_id=case_id).delete()

        case_files = CaseFile.query.filter_by(case_id=case_id).all()
        for file in case_files:
            current_version_id = file.current_version_id
            current_version = CaseFileVersion.query.get(current_version_id)
            filepath = os.path.join(
                get_case_files_upload_folder(), current_version.file_path)
            if os.path.exists(filepath):
                os.remove(filepath)
            db.session.delete(file)

        db.session.delete(case)
        db.session.commit()

        return jsonify({"statusCode": 200, "message": "Case and all related data deleted"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"statusCode": 500, "message": "Failed to delete case", "error": str(e)}), 500

# Route to get case number by case ID


@case_bp.route("/case/<case_id>/number", methods=["GET"])
@jwt_required()
@roles_required("admin", "doctor", "technician")
def get_case_number(case_id):
    try:
        case = Case.query.get(case_id)
        if not case:
            return jsonify({"statusCode": 404, "message": "Case not found"}), 404

        return jsonify({
            "statusCode": 200,
            "data": {
                "case_number": case.case_number
            }
        }), 200
    except Exception as e:
        return jsonify({"statusCode": 500, "message": "Failed to retrieve case number", "error": str(e)}), 500


# Route to check if a case exists
@case_bp.route("/case/<case_id>/exists", methods=["GET"])
@jwt_required()
@roles_required("admin", "doctor", "technician")
def check_case_exists(case_id):
    try:
        case = Case.query.get(case_id)
        if case:
            return jsonify({"statusCode": 200, "exists": True}), 200
        else:
            return jsonify({"statusCode": 404, "exists": False, "message": "Case not found"}), 404
    except Exception as e:
        return jsonify({"statusCode": 500, "message": "Error checking case existence", "error": str(e)}), 500
