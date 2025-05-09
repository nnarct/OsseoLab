import os
from services.url_secure_service import generate_secure_url_case_file
from models.case_files import CaseFile
from flask import Blueprint, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt
from services.authService import admin_required, roles_required
from services.authService import get_current_user
from models.enums import RoleEnum
from models.cases import Case
from models.doctors import Doctor
from models.technicians import Technician

from models.case_surgeons import CaseSurgeon
from models.case_technicians import CaseTechnician

from flask import request, jsonify
from datetime import datetime, date
from models.enums import GenderEnum
from config.extensions import db
from werkzeug.utils import secure_filename

# Import CuttingPlane model
from models.cutting_planes import CuttingPlane

import trimesh
import numpy as np
from trimesh.intersections import slice_mesh_plane
from models.case_file_versions import CaseFileVersion
from models.case_files import CaseFile
from services.url_secure_service import serializer
from itsdangerous import BadSignature

cutting_plane_bp = Blueprint("cutting_plane", __name__)


def get_case_files_upload_folder():
    # /app/uploads/case_files
    return os.path.join(current_app.root_path, "uploads", "case_files")


def verify_case_file_version_token(token):
    try:
        case_file_version_id = serializer.loads(token)
        print(f'${case_file_version_id}')
        return case_file_version_id
    except BadSignature:
        return None

# Route to define a cut and save functionality with mesh cutting using trimesh


@cutting_plane_bp.route("/cutting-plane/save-multiple", methods=["POST"])
@jwt_required()
def cut_and_save_multiple():
    try:
        created_by = get_jwt()["userData"]["id"]

        data = request.get_json()
        planes = data.get('planes', [])
        tokens = data.get('tokens', [])
        print()
        if not planes or not tokens:
            return jsonify({"statusCode": 400, "message": "Missing planes or tokens"}), 400

        all_results = []

        for token in tokens:
            version_id = verify_case_file_version_token(token)
            if not version_id:
                return jsonify({"statusCode": 400, "message": "File Version Entry not found"}), 400

            version_entry = CaseFileVersion.query.get(version_id)
            case_file_id = version_entry.case_file_id
            case_file_entry = CaseFile.query.get(case_file_id)

            if not case_file_id:
                return jsonify({"statusCode": 400, "message": "Case File Entry not found"}), 400

            original_path = os.path.join(
                get_case_files_upload_folder(), version_entry.file_path)
            if not os.path.exists(original_path):
                return jsonify({"statusCode": 400, "message": "Physical File from saved path not found"}), 400

            mesh = trimesh.load_mesh(original_path)
            for plane_data in planes:
                name = plane_data.get("name")
                position = plane_data.get("position")
                normal = plane_data.get("normal")

                if not position or not normal:
                    return jsonify({"statusCode": 400, "message": "Some plane data are missing"}), 400

                new_plane = CuttingPlane(
                    original_version_id=version_entry.id,
                    name=name,
                    position=position,
                    normal=normal,
                    is_visible=True
                )

                plane_origin = np.array(
                    [position["x"], position["y"], position["z"]])

                plane_normal = np.array(
                    [normal["x"], normal["y"], normal["z"]])
                cut_filename = f"{os.path.splitext(version_entry.filename)[0]}_v{version_entry.version_number+1}.stl"

                cut_folder = os.path.join(
                    get_case_files_upload_folder(), str(case_file_entry.case_id))
                os.makedirs(cut_folder, exist_ok=True)
                cut_path = os.path.join(cut_folder, cut_filename)
                
                sliced_meshes = slice_mesh_plane(mesh, plane_origin, plane_normal)
                # sliced_meshes = mesh.slice_plane(plane_origin, plane_normal)


                sliced_meshes.export(file_obj=cut_path, file_type='stl_ascii')

                filesize = os.path.getsize(cut_path)

                new_version = CaseFileVersion(
                    case_file_id=case_file_id,
                    version_number=version_entry.version_number+1,
                    file_path=cut_path,
                    filename=cut_filename,
                    nickname=version_entry.nickname,
                    filetype='application/sla',
                    filesize=filesize,
                    uploaded_by=created_by
                )
                db.session.add(new_version)
                db.session.flush()
                new_plane.resulting_version_id = new_version.id
                case_file_entry.current_version_id = new_version.id
                db.session.add(new_plane)
                db.session.add(case_file_entry)

                all_results.append({
                    "plane": new_plane.to_dict(),
                    "new_version": new_version.to_dict(),
                    "urls" : [generate_secure_url_case_file(str(new_version.id))]
                })

        db.session.commit()

        return jsonify({
            "statusCode": 201,
            "message": "Cutting planes saved and versions updated successfully",
            "results": all_results
        }), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"statusCode": 500, "message": "Failed to process cutting planes", "error": str(e)}), 500

        # เอา token ออกมา ไปหา file version ปัจจุบัน แล้วก็โหลด mesh มาจาก path ขแง file น้ัน
        # เอา plane มา loop แล้ว save plane ใส่ db
        # ทำ match cut
        # create new case file version
        # update case file
# [
#   {
#     "new_file": {
#       "case_id": "2d76b730-686f-4bf1-b630-cbb2de5b9433",
#       "current_version_id": null,
#       "filename": "max_20241120_034514_20250205_010047_v2.stl",
#       "filepath": "2d76b730-686f-4bf1-b630-cbb2de5b9433/max_20241120_034514_20250205_010047_v2.stl",
#       "filesize": 4660734,
#       "filetype": "application/sla",
#       "id": "430dd159-58bd-4a5a-9364-ecb388d3c8c8",
#       "nickname": "max_20241120_034514_20250205_010047_v2.stl",
#       "updated_at": 1746685970,
#       "uploaded_at": 1746685970
#     },
#     "new_version": {
#       "case_file_id": "430dd159-58bd-4a5a-9364-ecb388d3c8c8",
#       "file_path": "2d76b730-686f-4bf1-b630-cbb2de5b9433/max_20241120_034514_20250205_010047_v2.stl",
#       "id": "None",
#       "uploaded_at": null,
#       "uploaded_by": null,
#       "version_number": 2
#     },
#     "plane": {
#       "created_at": 1746685970,
#       "id": "3ccba1a1-fadd-4f6f-bc29-42c89e1ff591",
#       "is_visible": true,
#       "name": "Plane_1",
#       "normal": {
#         "x": 0,
#         "y": 0,
#         "z": 1
#       },
#       "position": {
#         "x": 0,
#         "y": 0,
#         "z": 0
#       },
#       "updated_at": 1746685970,
#       "version_id": "d83bea3d-48fc-4662-a4b4-e75f040b41f9"
#     }
#   }
# ]
