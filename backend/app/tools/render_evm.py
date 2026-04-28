def handle_render_evm(args: dict) -> dict:
    """Process render_evm_explainer tool call and return structured payload."""
    return {
        "widget": "evm_explainer",
        "data": {
            "highlight_part": args.get("highlight_part", "all")
        }
    }
