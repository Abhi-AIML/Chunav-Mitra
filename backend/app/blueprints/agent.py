from flask import Blueprint, request, jsonify
from app.validators.schemas import ChatRequest
from app.services.gemini_service import GeminiService
from app.tools import TOOL_HANDLERS
from pydantic import ValidationError

agent_bp = Blueprint('agent', __name__)
gemini_service = GeminiService()

@agent_bp.route('/chat', methods=['POST'])
def chat():
    try:
        data = request.json or {}
        req = ChatRequest(**data)
        
        response = gemini_service.chat(req.message)
        
        # Execute tool handlers if present
        if "tool_calls" in response:
            for call in response["tool_calls"]:
                handler = TOOL_HANDLERS.get(call["name"])
                if handler:
                    # Execute handler to get processed data (e.g., inject API keys)
                    processed = handler(call["args"])
                    # Update call args with the 'data' part of handler output
                    call["args"] = processed.get("data", call["args"])
        
        return jsonify(response)
        
    except ValidationError as e:
        return jsonify({"error": e.errors()}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500
