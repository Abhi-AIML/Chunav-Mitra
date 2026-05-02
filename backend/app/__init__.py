from flask import Flask, send_from_directory, request
from flask_cors import CORS
from app.config import Config
import os
import logging

def create_app():
    # Set static folder to the frontend build directory
    base_dir = os.path.dirname(os.path.abspath(__file__))
    static_folder = os.path.join(base_dir, '..', 'static')
    app = Flask(__name__, static_folder=static_folder, static_url_path='/')
    app.config.from_object(Config)
    
    # Setup Google Cloud Services in production
    if os.environ.get("FLASK_ENV") == "production":
        try:
            # 1. Cloud Logging
            import google.cloud.logging
            logging_client = google.cloud.logging.Client()
            logging_client.setup_logging()
            logging.info("Google Cloud Logging initialized")

            # 2. Cloud Error Reporting
            from google.cloud import error_reporting
            error_client = error_reporting.Client()
            
            # 3. Cloud Trace
            from google.cloud import trace
            trace_client = trace.Client()
            
            logging.info("Advanced Google Cloud Services (Error Reporting, Trace) initialized")
        except Exception as e:
            app.logger.warning(f"Could not initialize Advanced Google Cloud Services: {e}")

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

    # Security and Caching Headers
    @app.after_request
    def add_security_and_cache_headers(response):
        # 1. Security Headers (Defense in Depth)
        response.headers['X-Content-Type-Options'] = 'nosniff'
        response.headers['X-Frame-Options'] = 'SAMEORIGIN'
        response.headers['X-XSS-Protection'] = '1; mode=block'
        response.headers['Strict-Transport-Security'] = 'max-age=31536000; includeSubDomains'
        
        # 2. Caching logic for efficiency
        if 'Cache-Control' not in response.headers:
            if request.path.startswith('/assets/'):
                response.cache_control.max_age = 31536000 # 1 year
            elif request.path.endswith(('.js', '.css', '.png', '.svg', '.json')):
                response.cache_control.max_age = 3600 # 1 hour
        return response

    return app
