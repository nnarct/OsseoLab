import os
from flask import current_app, send_file, send_from_directory
from werkzeug.utils import secure_filename
from flask import Blueprint, request, jsonify
from config.extensions import db
from models.quick_cases import QuickCase
from models.quick_case_files import QuickCaseFile
from datetime import datetime
from services.url_secure_service import serializer, generate_secure_url_quick_file

  # Notify all admins about the new quick case
from models.users import User
from models.notifications import Notification
from models.enums import RoleEnum
        
# Helper function to get the quick case upload folder path
def get_quick_case_upload_folder():
    return os.path.join(current_app.root_path, "uploads", "quick_cases")

quick_case_bp = Blueprint("quick_case", __name__)

@quick_case_bp.route("/case/quick-submit-combined", methods=["POST"])
def submit_quick_case_combined():
    try:
        # Handle form data and files in a single request
        data = request.form

        required_fields = ["firstname", "lastname", "email", "phone", "country", "product", "anatomy", "surgery_date"]
        for field in required_fields:
            if not data.get(field):
                return jsonify({"statusCode": 400, "message": f"Missing required field: {field}"}), 400

        surgery_date_str = data.get("surgery_date")
        try:
            surgery_date = datetime.fromisoformat(surgery_date_str)
        except Exception:
            return jsonify({"statusCode": 400, "message": "Invalid surgery_date format"}), 400

        quick_case = QuickCase(
            firstname=data.get("firstname"),
            lastname=data.get("lastname"),
            email=data.get("email"),
            phone=data.get("phone"),
            country=data.get("country"),
            product=data.get("product"),
            other_product=data.get("other_product"),
            anatomy=data.get("anatomy"),
            surgery_date=surgery_date,
            additional_info=data.get("additional_info"),
        )

        db.session.add(quick_case)
        db.session.commit()
    
        admins = User.query.filter_by(role=RoleEnum.admin.value).all()
        for admin in admins:
            notif = Notification(
                user_id=admin.id,
                message=f"New Case requested  by {quick_case.firstname} {quick_case.lastname}",
                related_case_id=quick_case.id,
                case_type="quick"
            )
            db.session.add(notif)
        db.session.commit()

        # Save uploaded files
        upload_folder = os.path.join(get_quick_case_upload_folder(), str(quick_case.id))
        os.makedirs(upload_folder, exist_ok=True)

        saved_files = []
        files = request.files.getlist("files")
        for file in files:
            filename = secure_filename(file.filename)
            file_path = os.path.join(upload_folder, filename)
            file.save(file_path)
            # Calculate filesize without consuming the stream
            file.stream.seek(0, os.SEEK_END)
            filesize = file.stream.tell()
            file.stream.seek(0)
            # Store file metadata in QuickCaseFile model
            file_record = QuickCaseFile(
                quick_case_id=quick_case.id,
                filename=filename,
                filepath=file_path,
                filetype=file.content_type,
                filesize=filesize,
            )
            file.stream.seek(0)  # Reset stream for saving if needed
            db.session.add(file_record)
            saved_files.append({
                **file_record.to_dict(),
                "url": generate_secure_url_quick_file(str(file_record.id))
            })
        db.session.commit()

        return jsonify({
            "statusCode": 201,
            "message": "Quick case submitted with files",
            "data": quick_case.to_dict(),
            "files": saved_files
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({"statusCode": 500, "message": "Failed to submit quick case", "error": str(e)}), 500

@quick_case_bp.route("/case/quick-list", methods=["GET"])
def get_quick_case_list():
    try:
        quick_cases = QuickCase.query.order_by(QuickCase.created_at.desc()).all()
        return jsonify({
            "statusCode": 200,
            "data": [qc.to_dict() for qc in quick_cases]
        }), 200
    except Exception as e:
        return jsonify({"statusCode": 500, "message": "Failed to fetch quick case list", "error": str(e)}), 500

@quick_case_bp.route("/case/quick/<quick_case_id>", methods=["GET"])
def get_quick_case_by_id(quick_case_id):
    try:
        quick_case = QuickCase.query.get(quick_case_id)
        if not quick_case:
            return jsonify({"statusCode": 404, "message": "Quick case not found"}), 404

        files = QuickCaseFile.query.filter_by(quick_case_id=quick_case.id).order_by(QuickCaseFile.uploaded_at.asc()).all()

        return jsonify({
            "statusCode": 200,
            "data": {
                **quick_case.to_dict(),
                "files": [
                    {
                        **f.to_dict(),
                        "url": generate_secure_url_quick_file(str(f.id))
                    } for f in files
                ]
            }
        }), 200
    except Exception as e:
        return jsonify({"statusCode": 500, "message": "Failed to fetch quick case", "error": str(e)}), 500

@quick_case_bp.route("/case/quick-delete/<quick_case_id>", methods=["DELETE"])
def delete_quick_case(quick_case_id):
    try:
        quick_case = QuickCase.query.get(quick_case_id)
        if not quick_case:
            return jsonify({"statusCode": 404, "message": "Quick case not found"}), 404

        db.session.delete(quick_case)
        db.session.commit()

        return jsonify({"statusCode": 200, "message": "Quick case deleted"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"statusCode": 500, "message": "Failed to delete quick case", "error": str(e)}), 500

@quick_case_bp.route("/case/quick-file/<token>", methods=["GET"])
def serve_quick_case_file(token):
    try:
        file_id = serializer.loads(token)
        quick_file = QuickCaseFile.query.get(file_id)
        if not quick_file or not os.path.exists(quick_file.filepath):
            return jsonify({"statusCode": 404, "message": "File not found"}), 404
        return send_file(quick_file.filepath, as_attachment=True, mimetype=quick_file.filetype or 'application/octet-stream')
    except Exception as e:
        return jsonify({"statusCode": 400, "message": "Invalid or expired token", "error": str(e)}), 400
    
    
    