# from models.v1.User import User
# from models.v1.Tech import Tech
# from models.v1.Doctor import Doctor
# from services.authService import admin_required
# from flask import Blueprint, request, jsonify, send_from_directory, current_app
# from flask_jwt_extended import jwt_required, get_jwt, get_jwt_identity
# import os
# import uuid
# from models.v1.STL import STL
# from config.extensions import db
# from datetime import datetime, timezone
# from models.enums import Role

# dashboard_bp = Blueprint("dashboard", __name__)  # Blueprint instance


# def get_users_by_role():

#     user_count = User.query.count()
#     admin_count = User.query.filter(User.role == Role.ADMIN).count()
#     tech_count = Tech.query.count()
#     doctor_count = Doctor.query.count()

#     return {
#         "user": user_count,
#         "admin": admin_count,
#         "tech": tech_count,
#         "doctor": doctor_count
#     }


# @dashboard_bp.route("/dashboard/admin", methods=["GET"])
# # @jwt_required()
# # @admin_required
# def get_admin_dashboard():
#     try:
#         user_count = get_users_by_role()
#         data = {"users": user_count}
#         return jsonify({"statusCode": 200, "message": "Admin Dashboard Data", "data": data}), 200
#     except Exception as e:
#         return jsonify({"statusCode": 500, "error": "Internal Server Error", "message": str(e)}), 500
