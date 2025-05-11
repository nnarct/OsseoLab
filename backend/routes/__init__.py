from flask import Blueprint
from .authRoute import auth_bp
# from .stlRoute import stl_bp
from .userRoute import user_bp
from .createUser import create_user_bp
from .caseRoute import case_bp
from .doctorRoute import doctor_bp
from .technicianRoute import technician_bp
from .caseSurgeonRoute import case_surgeon_bp
from .caseTechnicianRoute import case_technician_bp
from .caseFileRoute import case_file_bp
from .dashboardRoute import dashboard_bp
from .quickCaseRoute import quick_case_bp
from .notificationRoute import notification_bp
from .caseManagerRoute import case_manager_bp
from .cuttingPlaneRoute import cutting_plane_bp
from .caseFileVersionRoute import case_file_version_bp

def register_routes(app):
    app.register_blueprint(auth_bp)
    # app.register_blueprint(stl_bp)
    app.register_blueprint(user_bp)
    app.register_blueprint(create_user_bp)
    app.register_blueprint(technician_bp)
    app.register_blueprint(doctor_bp)
    app.register_blueprint(case_bp)
    app.register_blueprint(case_surgeon_bp)
    app.register_blueprint(case_technician_bp)
    app.register_blueprint(case_file_bp)
    app.register_blueprint(dashboard_bp)
    app.register_blueprint(quick_case_bp)
    app.register_blueprint(notification_bp)
    app.register_blueprint(case_manager_bp)
    app.register_blueprint(cutting_plane_bp)
    app.register_blueprint(case_file_version_bp)
