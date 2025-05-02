# from flask import Blueprint, request, jsonify, send_from_directory, current_app
# import os
# import uuid
# from models.v1.STL import STL
# from config.extensions import db
# from datetime import datetime, timezone
# from itsdangerous import URLSafeTimedSerializer, BadSignature
# from services.url_secure_service import generate_secure_stl_url

# stl_bp = Blueprint("stl", __name__)  # Blueprint instance

# BASE_URL = os.getenv("BASE_URL", "http://localhost:5002")
# UPLOAD_FOLDER = os.getenv(
#     "UPLOAD_FOLDER", os.path.join(os.getcwd(), 'stl_files'))

# SECRET_KEY = os.getenv("STL_SECRET_KEY")
# serializer = URLSafeTimedSerializer(SECRET_KEY)


# @stl_bp.route("/stl")
# def home():
#     return "Hello from STL Blueprint!"


# @stl_bp.route("/stl/list", methods=["GET"])
# def get_stls():
#     try:
#         stl_files = STL.query.all()
#         stl_list = [
#             {
#                 "id": stl.id,
#                 "filename": stl.filename,
#                 "url": generate_secure_stl_url(stl.id),
#                 "original_filename": stl.original_filename,
#                 "created_at": stl.created_at,
#                 "last_updated": stl.last_updated
#             }
#             for stl in stl_files
#         ]
#         return jsonify({"statusCode": 200, "message": "STL File List", "data": stl_list}), 200
#     except Exception as e:
#         return jsonify({"statusCode": 500, "error": "Internal Server Error", "message" : str(e)}), 500


# # New route: get STL by id, returns only id and url
# @stl_bp.route("/stl/<string:id>", methods=["GET"])
# def get_stl_by_id(id):
#     try:
#         stl_entry = STL.query.filter_by(id=id).first()

#         if not stl_entry:
#             return jsonify({"statusCode": 404, "error": "STL not found"}), 404

#         stl_data = {
#             "id": stl_entry.id,
#             "url": generate_secure_stl_url(stl_entry.id)
#         }

#         return jsonify({"statusCode": 200, "message": "STL Found", "data": stl_data}), 200
#     except Exception as e:
#         return jsonify({"statusCode": 500, "error": "Internal Server Error", "message": str(e)}), 500


# # Secure STL download token verification (never expires)
# def verify_stl_token(token):
#     try:
#         stl_id = serializer.loads(token)
#         return stl_id
#     except BadSignature:
#         return None

# @stl_bp.route("/stl_files/<string:token>", methods=["GET"])
# def serve_stl(token):
#     try:
#         stl_id = verify_stl_token(token)
#         if not stl_id:
#             return jsonify({"statusCode": 403, "error": "Invalid or expired token"}), 403

#         stl_entry = STL.query.filter_by(id=stl_id).first()
#         if not stl_entry:
#             return jsonify({"statusCode": 404, "error": "File not found"}), 404

#         relative_path = stl_entry.filepath.lstrip("/")
#         upload_folder = current_app.config.get("UPLOAD_FOLDER", UPLOAD_FOLDER)
#         return send_from_directory(upload_folder, relative_path)
#     except Exception as e:
#         return jsonify({"statusCode": 500, "error": "Internal Server Error", "details": str(e)}), 500



# @stl_bp.route("/stl/file/<string:id>", methods=["PUT", "OPTIONS"])
# def update_stl(id):
#     try:
#         if request.method == "OPTIONS":
#             # Handles preflight
#             return jsonify({"statusCode": 200, "message": "CORS Preflight Successful"}), 200
#         # if request.method == "PUT":
#             # Handles preflight
#             # return jsonify({"statusCode": 200, "message": "Yeah Put"}), 200

#         if "file" not in request.files:
#             return jsonify({"statusCode": 400, "error": "Missing STL file"}), 400

#         file = request.files["file"]

#         if file.filename == "":
#             return jsonify({"statusCode": 400, "error": "No selected file"}), 400

#         stl_entry = STL.query.filter_by(id=id).first()
#         if not stl_entry:
#             return jsonify({"statusCode": 404, "error": "STL file not found"}), 404

#         # Remove old file
#         old_file_path = os.path.join(UPLOAD_FOLDER, stl_entry.filepath)
#         if os.path.exists(old_file_path):
#             os.remove(old_file_path)

#         # Save new STL file
#         # unique_filename = f"{uuid.uuid4()}_{file.filename}"
#         # new_file_path = os.path.join(UPLOAD_FOLDER, unique_filename)
#         file.save(old_file_path)

#         now_utc = datetime.now(timezone.utc)
#         # # Update database record
#         stl_entry.last_updated=now_utc
#         db.session.commit()

#         return jsonify({
#             "statusCode": 200,
#             "message": "STL file updated successfully",
#             "data": {
#                 "id": stl_entry.id,
#                 "filename": stl_entry.filename,
#                 "url": generate_secure_stl_url(stl_entry.id)
#             }
#         }), 200
#     except Exception as e:
#         return jsonify({"statusCode": 500, "error": "Internal Server Error", "message": str(e)}), 500
