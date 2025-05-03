from flask import Blueprint, request, jsonify
from config.extensions import db
from models.quick_cases import QuickCase
from datetime import datetime

quick_case_bp = Blueprint("quick_case", __name__)

@quick_case_bp.route("/case/quick-submit", methods=["POST"])
def submit_quick_case():
    try:
        data = request.get_json()

        required_fields = ["firstname", "lastname", "email", "phone", "country", "product", "anatomy", "surgery_date"]
        for field in required_fields:
            if not data.get(field):
                return jsonify({"statusCode": 400, "message": f"Missing required field: {field}"}), 400

        quick_case = QuickCase(
            firstname=data["firstname"],
            lastname=data["lastname"],
            email=data["email"],
            phone=data["phone"],
            country=data["country"],
            product=data["product"],
            other_product=data.get("other_product"),
            anatomy=data["anatomy"],
            surgery_date=datetime.fromisoformat(data["surgery_date"]),
            additional_info=data.get("additional_info"),
        )

        db.session.add(quick_case)
        db.session.commit()

        return jsonify({"statusCode": 201, "message": "Quick case submitted", "data": quick_case.to_dict()}), 201
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