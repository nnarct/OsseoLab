# import os
# import uuid
# from flask import Flask, request, jsonify, send_from_directory
# from app import db, app
# from backend.models import STL

# UPLOAD_FOLDER = "stl_files"  # Folder to store STL files
# app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
# BASE_URL = "http://localhost:5002"  # Change this if deployed

# # Ensure upload folder exists
# os.makedirs(UPLOAD_FOLDER, exist_ok=True)


# @app.route('/')
# def hello():
#     # unique_id = str(uuid.uuid4())
#     # filename = 'test1.stl',
#     # new_stl = STL(id=unique_id, filename=filename,
#     #               filepath='/stl_file/test1.stl')
#     # db.session.add(new_stl)
#     # db.session.commit()
#     # return jsonify({
#     #     "message": "STL file added!",
#     #     "stl_id": unique_id,
#     #     "original_filename": filename,
#     #     "url": f"{BASE_URL}/stl_files/{filename}"
#     # }), 201
#     return 'hello flask'


# # 1️⃣ **Add a New STL File**
# @app.route('/api/stl/add', methods=['POST'])
# def add_stl():
#     data = request.json  # Expecting JSON input
#     filename = data.get("filename")
#     filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)

#     # Save to database
#     new_stl = STL(id=filename, filename=filename, filepath=filepath)
#     db.session.add(new_stl)
#     db.session.commit()

#     return jsonify({"message": "STL file added!", "stl_id": filename}), 201


# # 2️⃣ **Serve STL Files for Frontend**
# @app.route('/stl_files/<path:filename>', methods=['GET'])
# def serve_stl(filename):
#     return send_from_directory(app.config['UPLOAD_FOLDER'], filename)


# # 3️⃣ **Return STL Files List with URLs**
# @app.route('/api/stl/list', methods=['GET'])
# def list_stl():
#     stl_files = STL.query.all()
#     stl_list = [
#         {
#             "id": stl.id,
#             "filename": stl.filename,
#             "url": f"{BASE_URL}/stl_files/{stl.filename}"
#         }
#         for stl in stl_files
#     ]
#     return jsonify(stl_list)


# if __name__ == '__main__':
#     with app.app_context():
#         db.create_all()
#     app.run(host='0.0.0.0', port=5000, debug=True)
