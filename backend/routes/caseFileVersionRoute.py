import os
from models.case_file_versions import CaseFileVersion
from werkzeug.utils import secure_filename
from services.url_secure_service import generate_secure_url_case_file, serializer
from flask import Blueprint, request, jsonify, send_from_directory, send_file, current_app
from config.extensions import db
import uuid
from models.case_files import CaseFile
from models.quick_case_files import QuickCaseFile
from itsdangerous import URLSafeTimedSerializer, BadSignature

from flask_jwt_extended import jwt_required, get_jwt_identity

case_file_version_bp = Blueprint("case_file_version", __name__)


@case_file_version_bp.route('/case-file-versions/<case_id>', methods=['GET'])
@jwt_required()
def get_case_file_versions(case_id):
    try:
        case_file_entries = CaseFile.query.filter_by(case_id=case_id).all()
        case_file_ids = [cf.id for cf in case_file_entries]
        versions = CaseFileVersion.query.filter(CaseFileVersion.case_file_id.in_(case_file_ids)).all()
        return jsonify({
            "statusCode": 200,
            "data": [version.to_dict() for version in versions]
        }), 200
    except Exception as e:
        current_app.logger.error(e)
        return jsonify({"statusCode": 500, "message": str(e)}), 500


# Route to reverse the current case file version based on a given case file version ID
@case_file_version_bp.route('/case-file-version/reverse/<case_file_version_id>', methods=['PUT'])
@jwt_required()
def reverse_case_file_version(case_file_version_id):
    try:
        version_entry = CaseFileVersion.query.get(case_file_version_id)
        if not version_entry:
            return jsonify({"statusCode": 404, "message": "Case file version not found"}), 404

        case_file_entry = CaseFile.query.get(version_entry.case_file_id)
        if not case_file_entry:
            return jsonify({"statusCode": 404, "message": "Related case file not found"}), 404

        # Set this version as current
        case_file_entry.current_version_id = version_entry.id
        db.session.add(case_file_entry)

        # Find and delete all versions after this one
        subsequent_versions = CaseFileVersion.query.filter(
            CaseFileVersion.case_file_id == case_file_entry.id,
            CaseFileVersion.version_number > version_entry.version_number
        ).all()
        for v in subsequent_versions:
            db.session.delete(v)

        db.session.commit()

        return jsonify({
            "statusCode": 200,
            "message": "Case file version reversed successfully",
            "new_version_id": version_entry.id
        }), 200
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(e)
        return jsonify({"statusCode": 500, "message": str(e)}), 500



# Route to update the nickname of a case file version by its ID
@case_file_version_bp.route('/case-file-version/<case_file_version_id>/rename', methods=['PATCH'])
@jwt_required()
def update_case_file_version_nickname(case_file_version_id):
    try:
        data = request.get_json()
        new_nickname = data.get("nickname")

        if not new_nickname:
            return jsonify({"statusCode": 400, "message": "Nickname is required"}), 400

        version_entry = CaseFileVersion.query.get(case_file_version_id)
        if not version_entry:
            return jsonify({"statusCode": 404, "message": "Case file version not found"}), 404

        version_entry.nickname = new_nickname
        db.session.commit()

        return jsonify({
            "statusCode": 200,
            "message": "Nickname updated successfully",
            "data": version_entry.to_dict()
        }), 200
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(e)
        return jsonify({"statusCode": 500, "message": str(e)}), 500
      