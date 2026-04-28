import pytest
from app.tools import TOOL_HANDLERS


def test_all_tool_handlers_registered():
    """Verify all 7 tools are registered."""
    expected_tools = [
        "render_election_timeline",
        "render_booth_simulator",
        "render_constituency_map",
        "render_evm_explainer",
        "push_to_calendar",
        "myth_buster",
        "find_polling_booth",
    ]
    for tool in expected_tools:
        assert tool in TOOL_HANDLERS, f"Missing tool handler: {tool}"


def test_render_timeline_handler():
    handler = TOOL_HANDLERS["render_election_timeline"]
    result = handler({
        "phase": "Phase 1",
        "events": [{"date": "2024-04-19", "label": "Voting Day", "status": "current"}],
        "show_calendar_button": True
    })
    assert result["widget"] == "timeline"
    assert result["data"]["phase"] == "Phase 1"
    assert len(result["data"]["events"]) == 1


def test_render_booth_handler():
    handler = TOOL_HANDLERS["render_booth_simulator"]
    result = handler({"step": 3, "highlight_officer": "Second Polling Officer"})
    assert result["widget"] == "booth_simulator"
    assert result["data"]["step"] == 3


def test_render_evm_handler():
    handler = TOOL_HANDLERS["render_evm_explainer"]
    result = handler({"highlight_part": "vvpat"})
    assert result["widget"] == "evm_explainer"
    assert result["data"]["highlight_part"] == "vvpat"


def test_myth_buster_handler():
    handler = TOOL_HANDLERS["myth_buster"]
    result = handler({
        "claim": "EVMs can be hacked",
        "verdict": "FALSE",
        "explanation": "EVMs are standalone machines."
    })
    assert result["widget"] == "myth_buster"
    assert result["data"]["verdict"] == "FALSE"


def test_find_booth_handler():
    handler = TOOL_HANDLERS["find_polling_booth"]
    result = handler({"pin_code": "110001", "query": "polling booth near me"})
    assert result["widget"] == "booth_finder"
    assert result["data"]["pin_code"] == "110001"


def test_calendar_handler():
    handler = TOOL_HANDLERS["push_to_calendar"]
    result = handler({"events": [{"title": "Vote", "date": "2024-04-19", "description": "Go vote!"}]})
    assert result["widget"] == "calendar_push"
    assert result["data"]["status"] == "mock_ready"


def test_render_map_handler():
    handler = TOOL_HANDLERS["render_constituency_map"]
    result = handler({"mode": "phases", "highlight_phase": 3})
    assert result["widget"] == "constituency_map"
    assert result["data"]["mode"] == "phases"
