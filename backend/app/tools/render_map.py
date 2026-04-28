def handle_render_map(args: dict) -> dict:
    """Process render_constituency_map tool call and return structured payload."""
    return {
        "widget": "constituency_map",
        "data": {
            "mode": args.get("mode", "phases"),
            "pin_code": args.get("pin_code", ""),
            "constituency_name": args.get("constituency_name", ""),
            "highlight_phase": args.get("highlight_phase", 0)
        }
    }
