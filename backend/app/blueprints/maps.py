from flask import Blueprint, request, jsonify
import os

maps_bp = Blueprint('maps', __name__)

@maps_bp.route('/config', methods=['GET'])
def get_maps_config():
    """Return the Maps API key for the frontend."""
    return jsonify({
        "maps_api_key": os.getenv("MAPS_API_KEY", "")
    })
