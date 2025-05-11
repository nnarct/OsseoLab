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
        if not planes or not tokens:
            return jsonify({"statusCode": 400, "message": "Missing planes or tokens"}), 400

        all_results = []
        urls=[]
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

            cut_filename = f"{os.path.splitext(case_file_entry.original_filename)[0]}_v{version_entry.version_number+1}.stl"
            cut_folder = os.path.join(
                get_case_files_upload_folder(), str(case_file_entry.case_id))
            os.makedirs(cut_folder, exist_ok=True)
            cut_path = os.path.join(cut_folder, cut_filename)

            # Apply either one or two plane cuts, then create new version and planes
            if len(planes) == 1:
                plane_data = planes[0]
                normal = plane_data.get("normal")
                constant = plane_data.get("constant")
                cut_method, mesh = cut_plane(mesh, normal, constant, cut_path)
                new_planes = [CuttingPlane(
                    original_version_id=version_entry.id,
                    name=plane_data.get("name"),
                    position=plane_data.get("origin"),
                    normal=normal,
                    is_visible=True
                )]
            elif len(planes) == 2:
                normal_a = planes[0].get("normal")
                constant_a = planes[0].get("constant")
                normal_b = planes[1].get("normal")
                constant_b = planes[1].get("constant")
                vec_a = np.array([normal_a['x'], normal_a['y'], normal_a['z']])
                vec_b = np.array([normal_b['x'], normal_b['y'], normal_b['z']])
                vec_a = vec_a / np.linalg.norm(vec_a)
                vec_b = vec_b / np.linalg.norm(vec_b)
                dot = np.dot(vec_a, vec_b)
                angle = np.degrees(np.arccos(np.clip(dot, -1.0, 1.0)))
                is_cross = 70 <= angle <= 110

                try:
                    if dot > 0 :
                        cut_method, mesh = cut_two_planes(
                            mesh, normal_a, constant_a, normal_b, constant_b, cut_path)
                        cut_method = 'หันเข้าหากัน'
                    elif not is_cross:
                        # Cut one plane first
                        cut_method, t_mesh = cut_plane(
                            mesh, normal_a, constant_a, cut_path)
                        # Then generate temp path for second cut
                        cut_path_temp = cut_path.replace('.stl', '_tmp.stl')
                        cut_method, mesh = cut_plane(
                            t_mesh, normal_b, constant_b, cut_path_temp)
                        cut_method = 'หันออกจากกัน' if dot <= 0 else 'cross'
                        os.replace(cut_path_temp, cut_path)
                    new_planes = []
                except Exception as e:
                    db.session.rollback()
                    return jsonify({"statusCode": 500, "message": "Failed to process two cutting planes", "error": str(e)}), 500
                for plane_data in planes:
                    new_planes.append(CuttingPlane(
                        original_version_id=version_entry.id,
                        name=plane_data.get("name"),
                        position=plane_data.get("origin"),
                        normal=plane_data.get("normal"),
                        is_visible=True
                    ))
            else:
                return jsonify({"statusCode": 400, "message": "Only up to 2 planes are allowed"}), 400

            # Save cut mesh file and version
            filesize = os.path.getsize(cut_path)
            new_version = CaseFileVersion(
                case_file_id=case_file_id,
                version_number=version_entry.version_number + 1,
                file_path=cut_path,
                filename=cut_filename,
                nickname=version_entry.nickname,
                filetype='application/sla',
                filesize=filesize,
                uploaded_by=created_by
            )
            db.session.add(new_version)
            db.session.flush()

            for new_plane in new_planes:
                new_plane.resulting_version_id = new_version.id
                db.session.add(new_plane)

            case_file_entry.current_version_id = new_version.id
            db.session.add(case_file_entry)

            all_results.append({
                "plane": [p.to_dict() for p in new_planes],
                "new_version": new_version.to_dict(),
                "url": generate_secure_url_case_file(str(new_version.id)),
                "cut_method": cut_method,
                "len": len(planes)
            })
            urls.append(generate_secure_url_case_file(str(new_version.id)))

        db.session.commit()

        return jsonify({
            "statusCode": 201,
            "message": "Cutting planes saved and versions updated successfully",
            "results": all_results,
            "urls": urls
        }), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"statusCode": 500, "message": "Failed to process cutting planes", "error": str(e)}), 500


def convert_yup_to_zup(vector):
    return np.array([vector[0], vector[2], -vector[1]])


def cut_plane(mesh, normal, constant, cut_path):
    normal = np.array(
        [normal['x'], normal['y'], normal['z']])
    origin = -normal * constant
    mesh = mesh.slice_plane(origin, normal)
    print(mesh.bounds)
    mesh.export(file_obj=cut_path, file_type='stl_ascii')
    return 'jena', mesh


def cut_two_planes(mesh, normal_a, constant_a, normal_b, constant_b, cut_path):
    mesh_a = mesh.copy()
    mesh_b = mesh.copy()

    normal_a = np.array(
        [normal_a['x'], normal_a['y'], normal_a['z']])
    origin_a = -normal_a * constant_a
    mesh_a = mesh.slice_plane(origin_a, normal_a)

    normal_b = np.array(
        [normal_b['x'], normal_b['y'], normal_b['z']])
    origin_b = -normal_b * constant_b
    mesh_b = mesh.slice_plane(origin_b, normal_b)

    merged = mesh_a + (mesh_b)
    merged.export(file_obj=cut_path, file_type='stl_ascii')
    return 'jena', mesh


# def cutting_mesh(mesh, origin, normal, cut_path):
#     from trimesh.intersections import slice_mesh_plane
#     X = np.array([
#         [-1,  0,  0],
#         [0,  0, -1],
#         [0,  1,  0]
#     ])
#     bbox_center = mesh.bounding_box.centroid
#     # Convert from Three.js Y-up to Trimesh Z-up
#     frontend_origin = np.array(
#         [origin['x'], origin['y'], origin['z']])
#     frontend_normal = np.array(
#         [normal['x'], normal['y'], normal['z']])

#     plane_origin = frontend_origin
#     plane_normal = X @ (frontend_normal)

#     rotation = trimesh.transformations.rotation_matrix(
#         np.radians(90), [1, 0, 0]
#     )[:3, :3]

#     plane_normal = rotation @ plane_normal
#     plane_origin = rotation @ plane_origin

#     cut_method = "triangle"
#     try:
#         sliced_meshes = slice_mesh_plane(
#             mesh,
#             plane_normal,
#             plane_origin,
#             cap=True,
#             engine="triangle"
#         ).process(validate=True)
#     except Exception as e:
#         print(f"[SLICE ERROR] {e}")
#         cut_method = "fallback"
#         sliced_meshes = None

#     if sliced_meshes is None or not hasattr(sliced_meshes, 'faces') or len(sliced_meshes.faces) == 0:
#         print(
#             "WARNING: Slice failed or produced 0 faces. Falling back to face mask.")
#         cut_method = "mask"
#         dot = (mesh.vertices - plane_origin) @ plane_normal
#         keep_face_mask = np.all(dot[mesh.faces] < 0, axis=1)
#         sliced_meshes = mesh.submesh([keep_face_mask], append=True)

#     if hasattr(sliced_meshes, 'faces') and len(sliced_meshes.faces) == 0:
#         print("WARNING: Slice produced 0 faces.")

#     sliced_meshes.export(file_obj=cut_path, file_type='stl_ascii')

#     return cut_method, sliced_meshes
