import os
from flask import Blueprint, jsonify, current_app

def get_case_files_upload_folder():
    return os.path.join(current_app.root_path, "uploads", "case_files")

def resolve_filename_conflict(directory, original_filename):
    name, ext = os.path.splitext(original_filename)
    candidate = original_filename
    counter = 1

    while os.path.exists(os.path.join(directory, candidate)):
        candidate = f"{name} ({counter}){ext}"
        counter += 1

    return candidate