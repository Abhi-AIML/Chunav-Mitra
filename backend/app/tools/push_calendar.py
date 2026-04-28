def handle_push_calendar(args: dict) -> dict:
    """Process push_to_calendar tool call and return structured payload (mock)."""
    return {
        "widget": "calendar_push",
        "data": {
            "events": args.get("events", []),
            "status": "mock_ready"
        }
    }
