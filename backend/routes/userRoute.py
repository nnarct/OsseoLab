# from flask import Blueprint, request, jsonify
# from flask_jwt_extended import jwt_required, get_jwt, get_jwt_identity
# from models.v1.User import User
# from models.enums import Role
# from config.extensions import db
# from services.authService import admin_required
# from werkzeug.exceptions import HTTPException

# user_bp = Blueprint("user", __name__, url_prefix="/user")


# @user_bp.route("/list", methods=["GET"])
# @jwt_required()
# @admin_required
# def list_users():
#     try:
#         users = User.query.all()
#         return jsonify({
#             "statusCode": 200,
#             "data": [user.to_dict() for user in users]
#         }), 200
#     except Exception as e:
#         return jsonify({
#             "statusCode": 500,
#             "error": "Internal Server Error",
#             "message": str(e)
#         }), 500

# # ✅ 2. List all admins (Only ADMIN)


# @user_bp.route("/admin/list", methods=["GET"])
# @jwt_required()
# @admin_required
# def list_admins():

#     admins = User.query.filter_by(role=Role.ADMIN).all()

#     return jsonify({
#         "statusCode": 200,
#         "data": [user.to_dict() for user in admins]
#     }), 200

# # ✅ 3. List all techs (Only ADMIN)


# @user_bp.route("/tech/list", methods=["GET"])
# @jwt_required()
# @admin_required
# def list_techs():
#     techs = User.query.filter_by(role=Role.TECH).all()

#     return jsonify({
#         "statusCode": 200,
#         "data": [user.to_dict() for user in techs]
#     }), 200

# # ✅ 4. List all doctors (Only ADMIN)


# @user_bp.route("/doctor/list", methods=["GET"])
# @jwt_required()
# @admin_required
# def list_doctors():
#     doctors = User.query.filter_by(role=Role.DOCTOR).all()
#     return jsonify({
#         "statusCode": 200,
#         "data": [user.to_dict() for user in doctors]
#     }), 200
