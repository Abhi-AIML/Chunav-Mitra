import os

def handle_find_booth(args: dict) -> dict:
    """Process find_polling_booth tool call and return structured payload."""
    return {
        "widget": "booth_finder",
        "data": {
            "pin_code": args.get("pin_code", ""),
            "query": args.get("query", "polling booth near me"),
            "maps_api_key": os.getenv("MAPS_API_KEY", "")
        }
    }
