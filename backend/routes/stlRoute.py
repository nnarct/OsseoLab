from flask import Blueprint, request, jsonify, send_from_directory, current_app
import os
import uuid
from models.STL import STL
from config.extensions import db

stl_bp = Blueprint("stl", __name__)  # Blueprint instance

BASE_URL = os.getenv("BASE_URL", "http://localhost:5002")
UPLOAD_FOLDER = os.getenv(
    "UPLOAD_FOLDER", os.path.join(os.getcwd(), 'stl_files'))


@stl_bp.route("/stl")
def home():
    return "Hello from STL Blueprint!"


@stl_bp.route("/stl/list", methods=["GET"])
def get_stls():
    try:
        stl_files = STL.query.all()
        stl_list = [
            {
                "id": stl.id,
                "filename": stl.filename,
                "url": f"{BASE_URL}/stl_files/{stl.id}"
            }
            for stl in stl_files
        ]
        return jsonify({"statusCode": 200, "message": "STL File List", "data": stl_list}), 200
    except Exception:
        return jsonify({"statusCode": 500, "error": "Internal Server Error"}), 500


@stl_bp.route("/stl_files/<string:id>", methods=["GET"])
def serve_stl(id):
    try:
        stl_entry = STL.query.filter_by(id=id).first()

        if not stl_entry:
            return jsonify({"error": "File not found"}), 404

        relative_path = stl_entry.filepath.lstrip("/")
        upload_folder = current_app.config.get("UPLOAD_FOLDER", UPLOAD_FOLDER)

        return send_from_directory(upload_folder, relative_path)
    except Exception:
        return jsonify({"statusCode": 500, "error": "Internal Server Error"})


@stl_bp.route("/upload", methods=["POST"])
def upload_stl():
    try:
        if "file" not in request.files or "nickname" not in request.form:
            return jsonify({"error": "Missing file or nickname"}), 400

        file = request.files["file"]
        nickname = request.form["nickname"].strip()

        if file.filename == "":
            return jsonify({"statusCode": 400, "error": "No selected file"}), 400

        os.makedirs(UPLOAD_FOLDER, exist_ok=True)

        unique_filename = f"{uuid.uuid4()}_{file.filename}"
        file_path = os.path.join(UPLOAD_FOLDER, unique_filename)
        file.save(file_path)

        new_stl = STL(filename=nickname, filepath=unique_filename)
        db.session.add(new_stl)
        db.session.commit()

        return jsonify({
            "statusCode": 201,
            "message": "File uploaded",
            "data": {"id": new_stl.id,
                     "nickname": nickname,
                     "url": f"{BASE_URL}/stl_files/{new_stl.id}"}
        }), 201
    except Exception:
        return jsonify({"statusCode": 500, "error": "Internal Server Error"})
