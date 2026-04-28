import pytest
import json
from app import create_app

@pytest.fixture
def client():
    app = create_app()
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client

def test_chat_tool_execution_integration(client, monkeypatch):
    """
    Test that a chat request which triggers a tool call (like booth finder)
    actually executes the tool handler and returns the processed data 
    (including the Maps API key).
    """
    # Mock the Gemini service to return a tool call
    class MockGemini:
        def chat(self, message):
            return {
                "text": "Sure, let me find that for you.",
                "tool_calls": [
                    {
                        "name": "find_polling_booth",
                        "args": {"pin_code": "110001", "query": "booth"}
                    }
                ]
            }

    # Patch the gemini_service instance in the blueprint
    from app.blueprints.agent import gemini_service
    monkeypatch.setattr(gemini_service, 'chat', MockGemini().chat)
    
    # Set a dummy maps API key
    monkeypatch.setenv("MAPS_API_KEY", "TEST_MAPS_KEY")
    
    rv = client.post('/api/agent/chat',
                     data=json.dumps({"message": "Find my booth"}),
                     content_type='application/json')
    
    data = json.loads(rv.data)
    assert rv.status_code == 200
    assert "tool_calls" in data
    assert len(data["tool_calls"]) == 1
    
    # Check that the args were updated by the handler
    tool_call = data["tool_calls"][0]
    assert tool_call["name"] == "find_polling_booth"
    assert tool_call["args"]["maps_api_key"] == "TEST_MAPS_KEY"
    assert tool_call["args"]["pin_code"] == "110001"

def test_chat_text_only(client, monkeypatch):
    """Test that normal text responses work without tool calls."""
    class MockGemini:
        def chat(self, message):
            return {"text": "Hello there!", "tool_calls": []}

    from app.blueprints.agent import gemini_service
    monkeypatch.setattr(gemini_service, 'chat', MockGemini().chat)
    
    rv = client.post('/api/agent/chat',
                     data=json.dumps({"message": "Hello"}),
                     content_type='application/json')
    
    data = json.loads(rv.data)
    assert rv.status_code == 200
    assert data["text"] == "Hello there!"
    assert data["tool_calls"] == []
