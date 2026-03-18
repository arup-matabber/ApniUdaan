from flask import Flask, jsonify, request
from flask_cors import CORS
from dotenv import load_dotenv
import os

from config.setting import Settings
from routes.chat import create_chat_blueprint
from routes.colleges import college_routes
from services.gemini_service import GeminiChatService
from routes.content import content_routes
from routes.degree import degree_routes
from routes.stream import stream_routes
from routes.students import students_routes
from routes.school_interest import school_interest_routes


def create_app() -> Flask:
    load_dotenv()

    app = Flask(__name__)

    CORS(
        app,
        resources={r"/*": {"origins": "*"}},
        supports_credentials=False,
        allow_headers="*",
        expose_headers="*",
        methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"]
    )

    @app.after_request
    def apply_cors(response):
        response.headers["Access-Control-Allow-Origin"] = "*"
        response.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS"
        response.headers["Access-Control-Allow-Headers"] = "*"
        return response

    settings = Settings.from_env()

    chat_service = GeminiChatService(
        api_key=settings.GEMINI_API_KEY,
        model_name=settings.GEMINI_MODEL,
        system_prompt=settings.load_system_prompt(),
        generation_config=settings.gemini_generation_config()
    )

    # Register blueprints
    app.register_blueprint(create_chat_blueprint(chat_service), url_prefix="/api")
    app.register_blueprint(college_routes, url_prefix="/api")
    app.register_blueprint(content_routes, url_prefix="/api")
    app.register_blueprint(degree_routes, url_prefix="/api")
    app.register_blueprint(stream_routes, url_prefix="/api")
    app.register_blueprint(students_routes, url_prefix="/api")
    app.register_blueprint(school_interest_routes, url_prefix="/api")

    @app.get("/health")
    def health():
        return jsonify({"status": "ok"}), 200

    return app


if __name__ == "__main__":
    app = create_app()
    host = os.getenv("FLASK_RUN_HOST", "0.0.0.0")
    port = int(os.getenv("FLASK_RUN_PORT", "8080"))
    debug = os.getenv("FLASK_DEBUG", "1") == "1"
    app.run(host=host, port=port, debug=debug)
