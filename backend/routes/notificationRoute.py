


from flask import Blueprint, jsonify, request, current_app as app
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.notifications import Notification
from models.users import User
from config.extensions import db
from models.cases import Case
from models.enums import RoleEnum

# Blueprint for notification routes
notification_bp = Blueprint("notification", __name__, url_prefix="/notification")

# GET /notification/list — list notifications for the current user
@notification_bp.route("/list", methods=["GET"])
@jwt_required()
def get_notifications():
    user_id = get_jwt_identity()
    notifications = Notification.query.filter_by(user_id=user_id).order_by(Notification.created_at.desc()).all()
    return jsonify([n.to_dict() for n in notifications]), 200

# PATCH /notification/<id>/read — mark a specific notification as read
@notification_bp.route("/<id>/read", methods=["PATCH"])
@jwt_required()
def mark_notification_read(id):
    notif = Notification.query.get(id)
    if not notif:
        return jsonify({"message": "Notification not found"}), 404
    notif.is_read = True
    db.session.commit()
    return jsonify({"message": "Marked as read"}), 200

# POST /case/<case_id>/assign — assign case to technicians and notify them
@app.route("/case/<case_id>/assign", methods=["POST"])
@jwt_required()
def assign_case(case_id):
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