import pytest
from pydantic import ValidationError
from app.validators.schemas import ChatRequest


def test_valid_chat_request():
    req = ChatRequest(message="How does voting work?")
    assert req.message == "How does voting work?"
    assert req.history is None


def test_chat_request_with_history():
    req = ChatRequest(
        message="Tell me more",
        history=[{"role": "user", "content": "Hello"}]
    )
    assert req.message == "Tell me more"
    assert len(req.history) == 1


def test_chat_request_missing_message():
    with pytest.raises(ValidationError):
        ChatRequest()


def test_chat_request_empty_message():
    # Empty string is technically valid per Pydantic
    req = ChatRequest(message="")
    assert req.message == ""
