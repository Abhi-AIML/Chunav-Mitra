import pytest
import os
from unittest.mock import MagicMock, patch
from app.services.gemini_service import GeminiService

@pytest.fixture
def gemini_service():
    """Fixture to initialize GeminiService with a mocked client."""
    with patch('google.genai.Client'):
        service = GeminiService()
        yield service

def test_gemini_service_initialization(gemini_service):
    """Verify that the service initializes with correct model and system instructions."""
    assert gemini_service.model_name == "gemini-3.1-flash-lite-preview"
    assert "Chunav Mitra" in gemini_service.system_instruction
    assert len(gemini_service.tools) > 0

def test_parse_response_text_only(gemini_service):
    """Test parsing a response containing only text."""
    mock_response = MagicMock()
    mock_part = MagicMock()
    mock_part.text = "Hello! I am Chunav Mitra."
    mock_part.function_call = None
    
    mock_candidate = MagicMock()
    mock_candidate.content.parts = [mock_part]
    mock_response.candidates = [mock_candidate]
    
    result = gemini_service._parse_response(mock_response)
    assert result["text"] == "Hello! I am Chunav Mitra."
    assert result["tool_calls"] == []

def test_parse_response_with_tool(gemini_service):
    """Test parsing a response containing a function call."""
    mock_response = MagicMock()
    
    # Text part
    mock_part_text = MagicMock()
    mock_part_text.text = "Let me show you the timeline."
    mock_part_text.function_call = None
    
    # Tool part
    mock_part_tool = MagicMock()
    mock_part_tool.text = None
    mock_part_tool.function_call.name = "render_election_timeline"
    mock_part_tool.function_call.args = {"phase": "General Election"}
    
    mock_candidate = MagicMock()
    mock_candidate.content.parts = [mock_part_text, mock_part_tool]
    mock_response.candidates = [mock_candidate]
    
    result = gemini_service._parse_response(mock_response)
    assert "timeline" in result["text"]
    assert len(result["tool_calls"]) == 1
    assert result["tool_calls"][0]["name"] == "render_election_timeline"
    assert result["tool_calls"][0]["args"]["phase"] == "General Election"

def test_chat_missing_client():
    """Verify error handling when API key is missing."""
    with patch.dict(os.environ, {"GEMINI_API_KEY": ""}):
        service = GeminiService()
        service.client = None
        result = service.chat("Hello")
        assert "Configuration Error" in result["text"]
