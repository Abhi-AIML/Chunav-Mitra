from flask import Flask, send_from_directory
from flask_cors import CORS
from app.config import Config
import os

def create_app():
    # Set static folder to the frontend build directory
    app = Flask(__name__, static_folder='../static', static_url_path='/')
    app.config.from_object(Config)
    
    # Allow CORS for development
    CORS(app, resources={r"/api/*": {"origins": "*"}})

    # Register blueprints
    from app.blueprints.agent import agent_bp
    from app.blueprints.maps import maps_bp
    from app.blueprints.calendar_bp import calendar_bp
    from app.blueprints.speech import speech_bp
    
    app.register_blueprint(agent_bp, url_prefix='/api/agent')
    app.register_blueprint(maps_bp, url_prefix='/api/maps')
    app.register_blueprint(calendar_bp, url_prefix='/api/calendar')
    app.register_blueprint(speech_bp, url_prefix='/api/speech')

    @app.route('/api/health')
    def health():
        return {"status": "ok", "service": "chunav-mitra-unified"}

    # Catch-all route to serve the frontend SPA
    @app.route('/', defaults={'path': ''})
    @app.route('/<path:path>')
    def catch_all(path):
        if path != "" and os.path.exists(os.path.join(app.static_folder, path)):
            return send_from_directory(app.static_folder, path)
        else:
            return send_from_directory(app.static_folder, 'index.html')

    return app
