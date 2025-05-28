import os
from werkzeug.utils import secure_filename
from services.url_secure_service import generate_secure_url_case_file, serializer
from flask import Blueprint, request, jsonify, send_from_directory, send_file, current_app
from config.extensions import db
import uuid
from models.case_files import CaseFile
from models.quick_case_files import QuickCaseFile
from itsdangerous import URLSafeTimedSerializer, BadSignature
from services.smart_filename import resolve_filename_conflict

from flask_jwt_extended import jwt_required, get_jwt_identity

case_file_bp = Blueprint("case_file", __name__)


def get_case_files_upload_folder():
    return os.path.join(current_app.root_path, "uploads", "case_files")


@case_file_bp.route("/case-file/upload", methods=["POST"])
@jwt_required()
def add_new_case_file():
    try:
        if "file" not in request.files or "nickname" not in request.form:
            return jsonify({"error": "Missing file or filename"}), 400

        # get case id
        case_id = request.form["case_id"]
        file = request.files["file"]
        nickname = request.form["nickname"].strip()
        # get current user id
        user_id = get_jwt_identity()

        if file.filename == "":
            return jsonify({"statusCode": 400, "error": "No selected file"}), 400

        filename = secure_filename(file.filename)
        upload_folder = os.path.join(
            get_case_files_upload_folder(), str(case_id))
        filename = resolve_filename_conflict(upload_folder, filename)
        os.makedirs(upload_folder, exist_ok=True)
        filepath = os.path.join(upload_folder, filename)
        file.save(filepath)

        # get file size
        file.stream.seek(0, os.SEEK_END)
        filesize = file.stream.tell()
        file.stream.seek(0)

        from models.case_file_versions import CaseFileVersion

        # Create a temporary CaseFile to get an ID
        temp_case_file = CaseFile(
            case_id=case_id,
            original_filename=filename,

        )
        db.session.add(temp_case_file)
        db.session.flush()  # Get temp_case_file.id without full commit

        new_version = CaseFileVersion(
            case_file_id=temp_case_file.id,
            version_number=1,
            file_path=os.path.relpath(
                filepath, start=get_case_files_upload_folder()),
            filename=filename,
            nickname=nickname,
            filetype=file.content_type,
            filesize=filesize,
            uploaded_by=user_id  # Set user ID if available
        )
        db.session.add(new_version)
        db.session.flush()  # Get new_version.id

        # Now update temp_case_file with the version
        temp_case_file.current_version_id = new_version.id
        db.session.commit()

        return jsonify({
            "statusCode": 201,
            "message": "File uploaded",
            "data": {
                "id": temp_case_file.id,
                "filename": filename,
                "filetype": file.content_type,
                "filesize": filesize,
                "url": generate_secure_url_case_file(str(new_version.id)),
                "created_at": int(temp_case_file.created_at.timestamp()),
                "version_id": str(new_version.id),
                "version_number": new_version.version_number
            }
        }), 201
    except Exception as e:
        return jsonify({"statusCode": 500, "error": "Internal Server Error",  "message": str(e)}), 500

# Secure CaseFile download token verification (never expires)


def verify_case_file_token(token):
    try:
        case_file_id = serializer.loads(token)
        print(f'${case_file_id}')
        return case_file_id
    except BadSignature:
        return None


@case_file_bp.route("/case-file/<string:token>", methods=["GET"])
def serve_case_file(token):
    try:
        from models.case_file_versions import CaseFileVersion
        try:
            version_id = serializer.loads(token)
        except BadSignature:
            return jsonify({"statusCode": 403, "error": "Invalid or expired token"}), 403

        version_entry = CaseFileVersion.query.get(version_id)
        if version_entry:
            return send_file(os.path.join(get_case_files_upload_folder(), version_entry.file_path), as_attachment=True, mimetype='application/octet-stream')

        print("Send successfully")
        return jsonify({"statusCode": 404, "error": "File not found", "payload": {"version_id": version_id, "version_entry": version_entry}}), 404
    except Exception as e:
        print("Send failed")
        return jsonify({"statusCode": 500, "error": "Internal Server Error", "message": str(e)}), 500


@case_file_bp.route("/case-file/<string:file_id>", methods=["DELETE"])
def delete_case_file(file_id):
    try:
        case_file = CaseFile.query.filter_by(id=file_id).first()
        if not case_file:
            return jsonify({"statusCode": 404, "message": "File not found"}), 404

    # Delete all versioned files from disk before deleting the CaseFile
        from models.case_file_versions import CaseFileVersion
        versions = CaseFileVersion.query.filter_by(
            case_file_id=case_file.id).all()
        for version in versions:
            file_path = os.path.join(
                get_case_files_upload_folder(), version.file_path)
            if os.path.exists(file_path):
                os.remove(file_path)

            # Delete from database
        db.session.delete(case_file)
        db.session.commit()

        return jsonify({"statusCode": 200, "message": "File deleted successfully"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"statusCode": 500, "message": "Failed to delete file", "error": str(e)}), 500


# Endpoint to rename a CaseFile by its ID
# @case_file_bp.route("/case-file/<string:file_id>/rename", methods=["PATCH"])
# def rename_case_file(file_id):
#     try:
#         data = request.get_json()
#         new_name = data.get("filename", "").strip()

#         if not new_name:
#             return jsonify({"statusCode": 400, "message": "New filename is required"}), 400

#         case_file = CaseFile.query.filter_by(id=file_id).first()
#         if not case_file:
#             return jsonify({"statusCode": 404, "message": "File not found"}), 404

#         case_file.filename = new_name
#         db.session.commit()

#         return jsonify({
#             "statusCode": 200,
#             "message": "Filename updated successfully",
#             "data": {
#                 "id": str(case_file.id),
#                 "filename": case_file.filename
#             }
#         }), 200
#     except Exception as e:
#         db.session.rollback()
#         return jsonify({"statusCode": 500, "message": "Failed to update filename", "error": str(e)}), 500


# Toggle active status endpoint
@case_file_bp.route("/case-file/<string:file_id>/toggle-active", methods=["PATCH"])
@jwt_required()
def toggle_case_file_active(file_id):
    try:
        case_file = CaseFile.query.filter_by(id=file_id).first()
        if not case_file:
            return jsonify({"statusCode": 404, "message": "Case file not found"}), 404

        case_file.active = not case_file.active
        db.session.commit()

        return jsonify({
            "statusCode": 200,
            "message": "Case file active status toggled",
            "data": {
                "id": str(case_file.id),
                "active": case_file.active
            }
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({
            "statusCode": 500,
            "message": "Failed to toggle active status",
            "error": str(e)
        }), 500


@case_file_bp.route("/case-file/by-case/<string:case_id>", methods=["GET"])
@jwt_required()
def get_case_files_by_case_id(case_id):
    try:
        case_files = CaseFile.query.filter_by(case_id=case_id).order_by(CaseFile.created_at.asc()).all()
        if not case_files:
            return jsonify({"statusCode": 404,
                            "message": "No case files found for this case ID",
                            "data": {"case_files": jsonify(case_files), "case_id": case_id}}), 404

        from models.case_file_versions import CaseFileVersion

        result = []
        for index, file in enumerate(case_files, start=1):
            current_version = CaseFileVersion.query.get(
                file.current_version_id)
            result.append({
                "case_file_id": str(file.id),
                "filename": file.original_filename,
                "created_at": int(file.created_at.timestamp()),
                "active": file.active,
                "version_id": str(current_version.id) if current_version else None,
                "version_number": current_version.version_number if current_version else None,
                "nickname": current_version.nickname if current_version else None,
                "filesize": current_version.filesize if current_version else None,
                "uploaded_by": current_version.uploaded_by if current_version else None,
                "uploaded_at": int(file.updated_at.timestamp()),
                "url": (generate_secure_url_case_file(
                    str(file.current_version_id))),
                "order": index,
                "post": file.post,
                "pre": file.pre
            })

        return jsonify({
            "statusCode": 200,
            "message": "Case files retrieved successfully",
            "data": result
        }), 200
    except Exception as e:
        return jsonify({
            "statusCode": 500,
            "message": "Failed to retrieve case files",
            "error": str(e)
        }), 500


@case_file_bp.route("/case-file/<string:file_id>/set-pre", methods=["PATCH"])
@jwt_required()
def set_case_file_pre(file_id):
    try:
        data = request.get_json()
        value = data.get("pre")
        if value is None:
            return jsonify({"statusCode": 400, "message": "Missing 'pre' field"}), 400

        case_file = CaseFile.query.filter_by(id=file_id).first()
        if not case_file:
            return jsonify({"statusCode": 404, "message": "Case file not found"}), 404

        case_file.pre = bool(value)
        db.session.commit()

        return jsonify({
            "statusCode": 200,
            "message": "'pre' status updated",
            "data": {
                "id": str(case_file.id),
                "pre": case_file.pre
            }
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"statusCode": 500, "message": "Failed to update 'pre' status", "error": str(e)}), 500


@case_file_bp.route("/case-file/<string:file_id>/set-post", methods=["PATCH"])
@jwt_required()
def set_case_file_post(file_id):
    try:
        data = request.get_json()
        value = data.get("post")
        if value is None:
            return jsonify({"statusCode": 400, "message": "Missing 'post' field"}), 400

        case_file = CaseFile.query.filter_by(id=file_id).first()
        if not case_file:
            return jsonify({"statusCode": 404, "message": "Case file not found"}), 404

        case_file.post = bool(value)
        db.session.commit()

        return jsonify({
            "statusCode": 200,
            "message": "'post' status updated",
            "data": {
                "id": str(case_file.id),
                "post": case_file.post
            }
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"statusCode": 500, "message": "Failed to update 'post' status", "error": str(e)}), 500


@case_file_bp.route("/case-files/<string:case_id>/active", methods=["GET"])
@jwt_required()
def get_active_case_files_by_case_id(case_id):
    try:
        case_files = CaseFile.query.filter_by(
            case_id=case_id, active=True).all()
        result = []
        from models.case_file_versions import CaseFileVersion
        for cf in case_files:
            current_version = CaseFileVersion.query.get(cf.current_version_id)
            result.append({
                "id": str(cf.id),
                "name": current_version.nickname if current_version else "",
                "pre": cf.pre,
                "post": cf.post
            })
        return jsonify(result), 200
    except Exception as e:
        return jsonify({"statusCode": 500, "message": "Failed to get active case files", "error": str(e)}), 500


@case_file_bp.route("/case-files/update-pre-post", methods=["PATCH"])
@jwt_required()
def update_pre_post_flags():
    try:
        data = request.get_json()
        for file_id, flags in data.items():
            case_file = CaseFile.query.filter_by(id=file_id).first()
            if case_file:
                if "pre" in flags:
                    case_file.pre = bool(flags["pre"])
                if "post" in flags:
                    case_file.post = bool(flags["post"])
        db.session.commit()
        return jsonify({"statusCode": 200, "message": "Pre/Post flags updated successfully"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"statusCode": 500, "message": "Failed to update Pre/Post flags", "error": str(e)}), 500


@case_file_bp.route("/case-file/by-case/<string:case_id>/model", methods=["GET"])
@jwt_required()
def get_case_models_by_case_id(case_id):
    try:
        case_files = CaseFile.query.filter_by(case_id=case_id).order_by(CaseFile.created_at.asc()).all()
        if not case_files:
            return jsonify({"statusCode": 404, "message": "No case model found for this case ID"}), 404

        from models.case_file_versions import CaseFileVersion

        result = []
        for index, file in enumerate(case_files, start=1):
            current_version = CaseFileVersion.query.get(
                file.current_version_id)
            result.append({
                "case_file_id": str(file.id),
                "active": file.active,
                "version_id": str(current_version.id) if current_version else None,
                "name": current_version.nickname if current_version else None,
                "pre": file.pre,
                "post": file.post,
                "url": (generate_secure_url_case_file(
                    str(file.current_version_id))),
                "order": index
            })

        return jsonify({
            "statusCode": 200,
            "message": "Case models retrieved successfully",
            "data": result
        }), 200
    except Exception as e:
        return jsonify({
            "statusCode": 500,
            "message": "Failed to retrieve case models",
            "error": str(e)
        }), 500
