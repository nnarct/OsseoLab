from config.extensions import db
import os
from models.case_files import CaseFile
from models.case_surgeons import CaseSurgeon
from models.cases import Case
import datetime
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity, create_access_token
from models.users import User
from models.doctors import Doctor
from models.technicians import Technician
from models.enums import RoleEnum
# from config.extensions import db
from services.authService import admin_required
# from werkzeug.exceptions import HTTPException

surgery_display_bp = Blueprint("surgery_display", __name__, url_prefix="/surgery_display")


@surgery_display_bp.patch("/case-file/<uuid:case_file_id>/tag")
@jwt_required()
def tag_case_file(case_file_id):
    data = request.get_json()
    case_file = CaseFile.query.get_or_404(case_file_id)

    if 'pre' in data:
        case_file.pre = data['pre']
    if 'post' in data:
        case_file.post = data['post']

    db.session.commit()
    return jsonify(message="Case file tags updated"), 200
