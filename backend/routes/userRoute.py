from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity, create_access_token
from models.users import User
# from models.enums import Role
# from config.extensions import db
# from services.authService import admin_required
# from werkzeug.exceptions import HTTPException

user_bp = Blueprint("user", __name__, url_prefix="/user")


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

@user_bp.route("/me", methods=["GET"])
@jwt_required()
def get_current_user():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if not user:
        return jsonify({"statusCode": 404, "error": "User not found"}), 404
    return jsonify({
        "statusCode": 200,
        "data": user.to_dict(exclude={"created_at", "last_updated"})
    }), 200


@user_bp.route("/me", methods=["PUT"])
@jwt_required()
def update_current_user():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if not user:
        return jsonify({"statusCode": 404, "error": "User not found"}), 404

    data = request.get_json()
    print(data)
    restricted_fields = {"id", "username",
                         "email", "role", "profile_pic_image"}

    for key, value in data.items():
        if key in restricted_fields:
            continue
        if hasattr(user, key):
            setattr(user, key, value)

    from config.extensions import db
    
    db.session.commit()
    user_data = {
        "id": user.id,
        "role": user.role,
        "firstname": user.firstname,
        "lastname": user.lastname,
        "email": user.email
    }
    
    access_token = create_access_token(identity=user.id,
                                       additional_claims={"userData": user_data},)

    return jsonify({
        "statusCode": 200,
        "message": "User updated successfully",
        "accessToken": access_token,
        "data": user.to_dict(exclude={"created_at", "last_updated"})
    }), 200
