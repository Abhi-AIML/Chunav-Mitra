from flask import Blueprint, request, jsonify, Response
from pydantic import ValidationError
import logging
from typing import Dict, Any, List

from app.validators.schemas import ChatRequest
from app.services.gemini_service import GeminiService
from app.tools import TOOL_HANDLERS

agent_bp = Blueprint('agent', __name__)
gemini_service = GeminiService()

@agent_bp.route('/chat', methods=['POST'])
def chat() -> Response:
    """
    Main interaction endpoint for the Chunav Mitra AI agent.
    
    Processes user messages, orchestrates Gemini tool calls, and executes
    local tool handlers to enrich response data (e.g., injecting API keys
    and local context) before returning the final payload to the frontend.
    
    Returns:
        JSON response containing the agent's text response and processed tool calls.
    """
    try:
        # 1. Parse and validate input payload
        data: Dict[str, Any] = request.json or {}
        req: ChatRequest = ChatRequest(**data)
        
        # 2. Get AI response and suggested tool calls from Gemini
        logging.debug(f"Processing chat request: {req.message[:50]}...")
        response: Dict[str, Any] = gemini_service.chat(req.message)
        
        # 3. Handle tool orchestration
        # Iterate through tool calls and execute corresponding local handlers
        if "tool_calls" in response:
            tool_calls: List[Dict[str, Any]] = response["tool_calls"]
            for call in tool_calls:
                tool_name: str = call.get("name", "")
                handler = TOOL_HANDLERS.get(tool_name)
                
                if handler:
                    try:
                        logging.info(f"Executing local handler for tool: {tool_name}")
                        processed = handler(call.get("args", {}))
                        # Update the tool call args with enriched data from the handler
                        call["args"] = processed.get("data", call.get("args", {}))
                    except Exception as handler_err:
                        logging.error(f"Execution failed for tool handler '{tool_name}': {handler_err}")
                        # Maintain raw args as fallback if handler fails
                else:
                    logging.warning(f"No local handler registered for tool: {tool_name}")
        
        return jsonify(response)
        
    except ValidationError as val_err:
        logging.warning(f"Input validation failed: {val_err}")
        return jsonify({"error": "Invalid request parameters", "details": val_err.errors()}), 400
    except Exception as err:
        logging.exception("Unexpected error in agent orchestration")
        return jsonify({"error": "An internal server error occurred"}), 500
