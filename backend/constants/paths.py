import os

BASE_DIR = os.getcwd()  # or use os.path.dirname(os.path.abspath(__file__)) for safety
UPLOAD_FOLDER = os.path.join(BASE_DIR, 'uploads', 'case_files')

# Ensure folder exists
os.makedirs(UPLOAD_FOLDER, exist_ok=True)