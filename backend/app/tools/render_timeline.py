def handle_render_timeline(args: dict) -> dict:
    """Process render_election_timeline tool call and return structured payload."""
    return {
        "widget": "timeline",
        "data": {
            "phase": args.get("phase", ""),
            "events": args.get("events", []),
            "show_calendar_button": args.get("show_calendar_button", False)
        }
    }
