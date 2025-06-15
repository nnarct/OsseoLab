import os
from flask import current_app
from sqlalchemy import event
from models.quick_case_files import QuickCaseFile
from models.cases import Case
from sqlalchemy import event, select, func


@event.listens_for(QuickCaseFile, 'after_delete')
def delete_file_from_disk(mapper, connection, target):
    file_path = os.path.join(current_app.root_path, target.filepath)
    try:
        if os.path.exists(file_path):
            os.remove(file_path)

        folder_path = os.path.dirname(file_path)
        if os.path.isdir(folder_path) and not os.listdir(folder_path):
            os.rmdir(folder_path)
    except Exception:
        pass


@event.listens_for(Case, 'before_insert')
def set_case_number(mapper, connect, target):
    if target.case_number is None:
        result = connect.execute(select(func.max(Case.case_number)))
        max_number = result.scalar()
        target.case_number = (max_number or 0) + 1
