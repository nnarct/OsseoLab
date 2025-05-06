from flask import Blueprint, jsonify, request, current_app as app
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.notifications import Notification
from models.users import User
from config.extensions import db
from models.cases import Case
from models.enums import RoleEnum

# Blueprint for notification routes
notification_bp = Blueprint(
    "notification", __name__, url_prefix="/notification")

# GET /notification/list — list notifications for the current user


@notification_bp.route("/list", methods=["GET"])
@jwt_required()
def get_notifications():
    try:
        user_id = get_jwt_identity()
        notifications = Notification.query.filter_by(
            user_id=user_id).order_by(Notification.created_at.desc()).all()
        notifications_list = [n.to_dict() for n in notifications]
        return jsonify({"statusCode": 200, "data": notifications_list}), 200
    except Exception as e:
        return jsonify({"statusCode": 500, "message": "Failed to fetch notifications", "error": str(e)}), 500


# PATCH /notification/<id>/read — mark a specific notification as read
@notification_bp.route("/<id>/read", methods=["PATCH"])
@jwt_required()
def mark_notification_read(id):
    try:
        notif = Notification.query.get(id)
        if not notif:
            return jsonify({"message": "Notification not found"}), 404
        notif.is_read = True
        db.session.commit()
        return jsonify({"message": "Marked as read"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"statusCode": 500, "message": "Failed to mark as read", "error": str(e)}), 500

# POST /case/<case_id>/assign — assign case to technicians and notify them
@notification_bp.route("/case/<case_id>/assign", methods=["POST"])
@jwt_required()
def assign_case(case_id):
    try:
        technician_ids = request.json.get("technician_ids", [])
        case = Case.query.get(case_id)
        if not case:
            return jsonify({"message": "Case not found"}), 404
        for tech_id in technician_ids:
            technician = User.query.get(tech_id)
            if technician and technician.role == RoleEnum.technician:
                notif = Notification(
                    user_id=technician.id,
                    message=f"🔧 You’ve been assigned to case {case_id}",
                    related_case_id=case.id,
                    case_type="quick"  # or 'full' depending on your logic
                )
                db.session.add(notif)
        db.session.commit()
        return jsonify({"message": "Case assigned and notifications sent"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"statusCode": 500, "message": "Failed to assign case", "error": str(e)}), 500

# GET /notification/has-unread — check if user has unread notifications
@notification_bp.route("/has-unread", methods=["GET"])
@jwt_required()
def has_unread_notifications():
    try:
        user_id = get_jwt_identity()
        has_unread = Notification.query.filter_by(
            user_id=user_id, is_read=False).first() is not None
        return jsonify({"statusCode": 200, "data": has_unread}), 200
    except Exception as e:
        return jsonify({"statusCode": 500, "message": "Failed to check unread status", "error": str(e)}), 500
