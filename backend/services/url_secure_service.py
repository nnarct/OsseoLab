

import os
from itsdangerous import URLSafeTimedSerializer

SECRET_KEY = os.getenv("STL_SECRET_KEY")
BASE_URL = os.getenv("BASE_URL")

serializer = URLSafeTimedSerializer(SECRET_KEY)

def generate_secure_stl_url(stl_id: str) -> str:
    token = serializer.dumps(stl_id)
    return f"{BASE_URL}/stl_files/{token}"