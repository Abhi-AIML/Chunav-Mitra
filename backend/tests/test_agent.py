import pytest
import json
import sys
import os

sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

from app import create_app


@pytest.fixture
def client():
    app = create_app()
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client


def test_health_endpoint(client):
    """Test the health check endpoint."""
    rv = client.get('/api/health')
    data = json.loads(rv.data)
    assert rv.status_code == 200
    assert data['status'] == 'ok'
    assert data['service'] == 'chunav-mitra-unified'


def test_chat_requires_message(client):
    """Test that chat endpoint validates input."""
    rv = client.post('/api/agent/chat',
                     data=json.dumps({}),
                     content_type='application/json')
    assert rv.status_code == 400


def test_chat_valid_request(client):
    """Test that chat endpoint accepts valid request."""
    rv = client.post('/api/agent/chat',
                     data=json.dumps({"message": "Hello"}),
                     content_type='application/json')
    data = json.loads(rv.data)
    # Should return 200 even without API key (returns error message)
    assert rv.status_code == 200
    assert "text" in data
    assert "tool_calls" in data


def test_maps_config(client):
    """Test maps config endpoint."""
    rv = client.get('/api/maps/config')
    data = json.loads(rv.data)
    assert rv.status_code == 200
    assert "maps_api_key" in data


def test_calendar_mock(client):
    """Test calendar mock endpoint."""
    rv = client.post('/api/calendar/events',
                     data=json.dumps({"events": [{"title": "Test", "date": "2024-04-19", "description": "Phase 1"}]}),
                     content_type='application/json')
    data = json.loads(rv.data)
    assert rv.status_code == 200
    assert data["status"] == "mock_success"
