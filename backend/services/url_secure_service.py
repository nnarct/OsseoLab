

import os
from itsdangerous import URLSafeTimedSerializer

SECRET_KEY = os.getenv("STL_SECRET_KEY")
BASE_URL = os.getenv("BASE_URL")
from constants.paths import UPLOAD_FOLDER as FOLDER

serializer = URLSafeTimedSerializer(SECRET_KEY)


def generate_secure_url_case_file(stl_id: str) -> str:
    token = serializer.dumps(stl_id)
    return f"{BASE_URL}/case-file/{token}"


def generate_secure_url_profile_pic(stl_id: str) -> str:
    token = serializer.dumps(stl_id)
    return f"{BASE_URL}/profile-pic/{token}"


