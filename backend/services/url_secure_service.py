import os
from itsdangerous import URLSafeTimedSerializer
from constants.paths import UPLOAD_FOLDER as FOLDER

BASE_URL = os.getenv("BASE_URL")
SECRET_KEY = os.getenv("STL_SECRET_KEY")

serializer = URLSafeTimedSerializer(SECRET_KEY)


def generate_secure_url_case_file(case_id: str) -> str:
    token = serializer.dumps(case_id)
    return f"{BASE_URL}/case-file/{token}"


def generate_secure_url_profile_pic(file_id: str) -> str:
    token = serializer.dumps(file_id)
    return f"{BASE_URL}/profile-pic/{token}"


def generate_secure_url_quick_file(quick_case_file_id: str) -> str:
    token = serializer.dumps(quick_case_file_id)
    return f"{BASE_URL}/case/quick-file/{token}"
