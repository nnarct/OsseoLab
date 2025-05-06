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

case_file_bp = Blueprint("case_file", __name__)
SECRET_KEY = os.getenv("STL_SECRET_KEY")
serializer = URLSafeTimedSerializer(SECRET_KEY)


def get_case_files_upload_folder():
    return os.path.join(current_app.root_path, "uploads", "case_files")


@case_file_bp.route("/case-file/upload", methods=["POST"])
def add_new_case():
    try:
        if "file" not in request.files or "nickname" not in request.form:
            return jsonify({"error": "Missing file or filename"}), 400

        # get case id
        case_id = request.form["case_id"]
        file = request.files["file"]
        nickname = request.form["nickname"].strip()

        if file.filename == "":
            return jsonify({"statusCode": 400, "error": "No selected file"}), 400

        filename = secure_filename(file.filename)
        upload_folder = os.path.join(get_case_files_upload_folder(), str(case_id))
        os.makedirs(upload_folder, exist_ok=True)
        filepath = os.path.join(upload_folder, filename)
        file.save(filepath)

        # get file size
        file.stream.seek(0, os.SEEK_END)
        filesize = file.stream.tell()
        file.stream.seek(0)
        
        
        new_case_file = CaseFile(
            case_id=case_id,
            nickname=nickname,
            filename = filename,
            filepath = filepath,
            filetype=file.content_type,
            filesize=filesize
        )
        
        file.stream.seek(0)  # Reset the stream position after reading
        db.session.add(new_case_file)
        db.session.commit()

        return jsonify({
            "statusCode": 201,
            "message": "File uploaded",
            "data": {
                "id": new_case_file.id,
                "nickname": nickname,
                "url": generate_secure_url_case_file(str(new_case_file.id)),
                "uploaded_at": int(new_case_file.uploaded_at.timestamp())
            }
        }), 201
    except Exception as e:
        return jsonify({"statusCode": 500, "error": "Internal Server Error",  "message": str(e)}), 500

# Secure CaseFile download token verification (never expires)


def verify_case_file_token(token):
    try:
        case_file_id = serializer.loads(token)
        return case_file_id
    except BadSignature:
        return None


@case_file_bp.route("/case-file/<string:token>", methods=["GET"])
def serve_case_file(token):
    try:
        case_file_id = verify_case_file_token(token)
        if not case_file_id:
            return jsonify({"statusCode": 403, "error": "Invalid or expired token"}), 403

        case_file_entry = CaseFile.query.get(case_file_id)
        if case_file_entry:
            # relative_path = case_file_entry.filepath.lstrip("/")
            return send_file(case_file_entry.filepath, as_attachment=True, mimetype=case_file_entry.filetype or 'application/octet-stream')

        quick_case_file_entry = QuickCaseFile.query.filter_by(
            id=case_file_id).first()
        if quick_case_file_entry:
            relative_path = quick_case_file_entry.filepath.lstrip("/")
            return send_from_directory(UPLOAD_FOLDER, relative_path)

        return jsonify({"statusCode": 404, "error": "File not found"}), 404
    except Exception as e:
        return jsonify({"statusCode": 500, "error": "Internal Server Error", "message": str(e)}), 500


@case_file_bp.route("/case-file/<string:file_id>", methods=["DELETE"])
def delete_case_file(file_id):
    try:
        case_file = CaseFile.query.filter_by(id=file_id).first()
        if not case_file:
            return jsonify({"statusCode": 404, "message": "File not found"}), 404

        # Delete the file from disk
        file_path = os.path.join(UPLOAD_FOLDER, case_file.filepath)
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
@case_file_bp.route("/case-file/<string:file_id>/rename", methods=["PATCH"])
def rename_case_file(file_id):
    try:
        data = request.get_json()
        new_name = data.get("filename", "").strip()

        if not new_name:
            return jsonify({"statusCode": 400, "message": "New filename is required"}), 400

        case_file = CaseFile.query.filter_by(id=file_id).first()
        if not case_file:
            return jsonify({"statusCode": 404, "message": "File not found"}), 404

        case_file.filename = new_name
        db.session.commit()

        return jsonify({
            "statusCode": 200,
            "message": "Filename updated successfully",
            "data": {
                "id": str(case_file.id),
                "filename": case_file.filename
            }
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"statusCode": 500, "message": "Failed to update filename", "error": str(e)}), 500
