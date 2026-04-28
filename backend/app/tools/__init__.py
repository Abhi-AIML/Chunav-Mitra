from app.tools.render_timeline import handle_render_timeline
from app.tools.render_booth import handle_render_booth
from app.tools.render_map import handle_render_map
from app.tools.render_evm import handle_render_evm
from app.tools.push_calendar import handle_push_calendar
from app.tools.myth_buster import handle_myth_buster
from app.tools.find_booth import handle_find_booth

TOOL_HANDLERS = {
    "render_election_timeline": handle_render_timeline,
    "render_booth_simulator": handle_render_booth,
    "render_constituency_map": handle_render_map,
    "render_evm_explainer": handle_render_evm,
    "push_to_calendar": handle_push_calendar,
    "myth_buster": handle_myth_buster,
    "find_polling_booth": handle_find_booth,
}
