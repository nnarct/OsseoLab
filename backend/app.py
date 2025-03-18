from flask import Flask, request, jsonify
from routes import register_routes
from config.config import Config
from config.extensions import db, migrate, cors
from config.jwt_handler import configure_jwt
from werkzeug.exceptions import HTTPException

# ✅ Initialize Flask App
app = Flask(__name__)
app.config.from_object(Config)

# ✅ Initialize Extensions
db.init_app(app)
migrate.init_app(app, db)
cors.init_app(app, resources={
    r"/*": {
        "origins": Config.CORS_ORIGINS,
        "allow_headers": ["Authorization", "Content-Type"],
        "supports_credentials": True
    }
})

# ✅ Configure JWT
jwt = configure_jwt(app)

# ✅ Register Routes
register_routes(app)


@app.after_request
def add_cors_headers(response):
    response.headers["Access-Control-Allow-Origin"] = request.headers.get(
        "Origin", "*")
    response.headers["Access-Control-Allow-Credentials"] = "true"
    response.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization"
    return response

# ✅ Custom Error Handlers


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
        "message": error.description  # This will be "Access denied"
    }), 403


@app.errorhandler(HTTPException)
def handle_http_exception(e):
    return jsonify({
        "statusCode": e.code,
        "error": e.name,
        "message": e.description
    }), e.code


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0")
