from flask import Flask
from config.config import Config
from config.extensions import db, migrate, cors
from routes import register_routes
from handlers.jwt_handler import configure_jwt
from handlers.errors_handler import register_error_handlers
from middlewares.cors_middleware import add_cors_headers
import models  # triggers import of all model classes


def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    # Extensions
    db.init_app(app)
    migrate.init_app(app, db)
    cors.init_app(app, resources={
        r"/*": {
            "origins": config_class.CORS_ORIGINS,
            "allow_headers": ["Authorization", "Content-Type"],
            "supports_credentials": True
        }
    })

    # JWT
    configure_jwt(app)

    # Routes, Error Handlers, Middleware
    register_routes(app)
    register_error_handlers(app)
    app.after_request(add_cors_headers)

    return app