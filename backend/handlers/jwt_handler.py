from flask import jsonify
from flask_jwt_extended import JWTManager

def configure_jwt(app):
    jwt = JWTManager(app)

    @jwt.expired_token_loader
    def handle_expired_token(jwt_header, jwt_payload):
        return jsonify({
            "statusCode": 401,
            "error": "Unauthorized",
            "message": "Your session has expired. Please log in again."
        }), 401

    @jwt.invalid_token_loader
    def handle_invalid_token(error):
        return jsonify({
            "statusCode": 401,
            "error": "Unauthorized",
            "message": "Invalid token. Please log in again."
        }), 401

    @jwt.unauthorized_loader
    def handle_missing_token(error):
        return jsonify({
            "statusCode": 401,
            "error": "Unauthorized",
            "message": "Authorization token is missing."
        }), 401

    return jwt
