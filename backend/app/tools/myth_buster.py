def handle_myth_buster(args: dict) -> dict:
    """Process myth_buster tool call and return structured payload."""
    return {
        "widget": "myth_buster",
        "data": {
            "claim": args.get("claim", ""),
            "verdict": args.get("verdict", "FALSE"),
            "explanation": args.get("explanation", "")
        }
    }
