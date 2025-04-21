from flask import jsonify
from werkzeug.exceptions import HTTPException

def register_error_handlers(app):

    @app.errorhandler(404)
    def handle_not_found(error):
        return jsonify({
            "statusCode": 404,
            "error": "Not Found",
            "message": "The requested endpoint does not exist."
        }), 404

    @app.errorhandler(405)
    def handle_method_not_allowed(error):
        return jsonify({
            "statusCode": 405,
            "error": "Method Not Allowed",
            "message": "This HTTP method is not allowed for the requested endpoint."
        }), 405

    @app.errorhandler(403)
    def forbidden_error(error):
        return jsonify({
            "statusCode": 403,
            "error": "Forbidden",
            "message": error.description
        }), 403

    @app.errorhandler(HTTPException)
    def handle_http_exception(e):
        return jsonify({
            "statusCode": e.code,
            "error": e.name,
            "message": e.description
        }), e.code