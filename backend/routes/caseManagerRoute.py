import os
from constants.paths import UPLOAD_FOLDER
from werkzeug.utils import secure_filename
from services.url_secure_service import generate_secure_url_case_file
from flask import Blueprint, request, jsonify, send_from_directory, send_file,current_app
from config.extensions import db
import uuid
from models.case_files import CaseFile
from models.quick_case_files import QuickCaseFile
from itsdangerous import URLSafeTimedSerializer

case_manager_bp = Blueprint("case_manager", __name__)
SECRET_KEY = os.getenv("STL_SECRET_KEY")

serializer = URLSafeTimedSerializer(SECRET_KEY)

# Import models for endpoints
# from models.case_file_group_items import CaseFileGroupItem
# from models.case_file_groups import CaseFileGroup
from models.case_file_versions import CaseFileVersion
from models.case_files import CaseFile
from models.cutting_planes import CuttingPlane


# Endpoint: Get all CaseFileGroupItems
# @case_manager_bp.route('/case-file-group-items', methods=['GET'])
# def get_case_file_group_items():
#     try:
#         items = CaseFileGroupItem.query.all()
#         return jsonify({
#             "statusCode": 200,
#             "data": [item.to_dict() for item in items]
#         }), 200
#     except Exception as e:
#         current_app.logger.error(e)
#         return jsonify({"statusCode": 500, "message": str(e)}), 500

# # Endpoint: Get all CaseFileGroups
# @case_manager_bp.route('/case-file-groups', methods=['GET'])
# def get_case_file_groups():
#     try:
#         groups = CaseFileGroup.query.all()
#         return jsonify({
#             "statusCode": 200,
#             "data": [group.to_dict() for group in groups]
#         }), 200
#     except Exception as e:
#         current_app.logger.error(e)
#         return jsonify({"statusCode": 500, "message": str(e)}), 500

# Endpoint: Get all CaseFileVersions
@case_manager_bp.route('/case-file-versions', methods=['GET'])
def get_case_file_versions():
    try:
        versions = CaseFileVersion.query.all()
        return jsonify({
            "statusCode": 200,
            "data": [version.to_dict() for version in versions]
        }), 200
    except Exception as e:
        current_app.logger.error(e)
        return jsonify({"statusCode": 500, "message": str(e)}), 500

# Endpoint: Get all CaseFiles
@case_manager_bp.route('/case-files', methods=['GET'])
def get_case_files():
    try:
        files = CaseFile.query.all()
        return jsonify({
            "statusCode": 200,
            "data": [f.to_dict() for f in files]
        }), 200
    except Exception as e:
        current_app.logger.error(e)
        return jsonify({"statusCode": 500, "message": str(e)}), 500

# Endpoint: Get all CuttingPlanes
@case_manager_bp.route('/cutting-planes', methods=['GET'])
def get_cutting_planes():
    try:
        planes = CuttingPlane.query.all()
        return jsonify({
            "statusCode": 200,
            "data": [plane.to_dict() for plane in planes]
        }), 200
    except Exception as e:
        current_app.logger.error(e)
        return jsonify({"statusCode": 500, "message": str(e)}), 500


