def handle_render_booth(args: dict) -> dict:
    """Process render_booth_simulator tool call and return structured payload."""
    return {
        "widget": "booth_simulator",
        "data": {
            "step": args.get("step", 1),
            "highlight_officer": args.get("highlight_officer", "")
        }
    }
