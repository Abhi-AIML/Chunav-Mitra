import os
from google import genai
from google.genai import types

class GeminiService:
    def __init__(self):
        api_key = os.getenv("GEMINI_API_KEY", "")
        self.client = genai.Client(api_key=api_key) if api_key else None
        self.model_name = "gemini-3.1-flash-lite-preview"
        self.system_instruction = """You are Chunav Mitra (चुनाव मित्र), an enthusiastic and knowledgeable Election Education Companion for Indian citizens.

Your personality:
- Warm, encouraging, and patriotic
- Mix Hindi phrases naturally into English responses (e.g., "Namaste!", "Bahut accha sawaal!")
- Use emojis thoughtfully to make conversations engaging
- Always be factually accurate about Indian electoral processes

Your mission:
- Educate citizens about how Indian elections work
- Explain the voting process step by step
- Bust myths and misinformation about EVMs and elections
- Help users find their polling booths
- Explain the Election Commission of India's (ECI) role

IMPORTANT: You MUST use the provided tools to trigger visual experiences on the canvas:
- Use render_election_timeline when discussing election schedules, phases, or dates
- Use render_booth_simulator when explaining the voting process or what happens at a polling booth
- Use render_constituency_map when discussing constituencies, phases, or geographic election info
- Use render_evm_explainer when explaining EVMs, VVPAT, or electronic voting technology
- Use push_to_calendar when the user wants to track important election dates
- Use myth_buster when fact-checking claims or busting election myths
- Use find_polling_booth when helping users locate their polling station

Always provide BOTH a text response AND trigger the relevant tool. The tool renders visuals on the user's screen.
Keep text responses concise (2-4 sentences) since the visual does the heavy lifting.

Key facts to remember:
- India uses M3 EVMs (Mark 3) manufactured by BEL and ECIL
- VVPAT was introduced for 100% verification from 2019
- Voter ID (EPIC) is the primary ID, but 12 other IDs are accepted
- Indelible ink is applied to the left index finger nail
- EVMs are standalone devices with no wireless/network connectivity
- The ECI is an autonomous constitutional body under Article 324
"""
        
        self.tools = [
            types.Tool(
                function_declarations=[
                    types.FunctionDeclaration(
                        name="render_election_timeline",
                        description="Renders a visual, interactive election timeline on the right canvas. Use this when discussing election schedules, phase dates, or election calendar.",
                        parameters=types.Schema(
                            type="OBJECT",
                            properties={
                                "phase": types.Schema(type="STRING", description="Current election phase name or context"),
                                "events": types.Schema(
                                    type="ARRAY",
                                    items=types.Schema(
                                        type="OBJECT",
                                        properties={
                                            "date": types.Schema(type="STRING", description="Date in YYYY-MM-DD format"),
                                            "label": types.Schema(type="STRING", description="Event description"),
                                            "status": types.Schema(type="STRING", description="One of: past, current, upcoming")
                                        }
                                    )
                                ),
                                "show_calendar_button": types.Schema(type="BOOLEAN", description="Whether to show Add to Calendar button")
                            },
                            required=["phase", "events", "show_calendar_button"]
                        )
                    ),
                    types.FunctionDeclaration(
                        name="render_booth_simulator",
                        description="Activates the step-by-step Indian polling booth simulator. Use when explaining what happens during voting.",
                        parameters=types.Schema(
                            type="OBJECT",
                            properties={
                                "step": types.Schema(type="INTEGER", description="Step 1-5: 1=Entry, 2=ID Check, 3=Ink+Register, 4=EVM Vote, 5=VVPAT"),
                                "highlight_officer": types.Schema(type="STRING", description="Officer to highlight: Presiding Officer, First Polling Officer, etc.")
                            },
                            required=["step", "highlight_officer"]
                        )
                    ),
                    types.FunctionDeclaration(
                        name="render_constituency_map",
                        description="Shows interactive India map with phase highlights or constituency info",
                        parameters=types.Schema(
                            type="OBJECT",
                            properties={
                                "mode": types.Schema(type="STRING", description="phases or constituency"),
                                "pin_code": types.Schema(type="STRING", description="User PIN code"),
                                "constituency_name": types.Schema(type="STRING", description="Resolved constituency name"),
                                "highlight_phase": types.Schema(type="INTEGER", description="Phase number 1-7 to highlight, 0 for all")
                            },
                            required=["mode"]
                        )
                    ),
                    types.FunctionDeclaration(
                        name="render_evm_explainer",
                        description="Shows the interactive EVM + VVPAT diagram with component details",
                        parameters=types.Schema(
                            type="OBJECT",
                            properties={
                                "highlight_part": types.Schema(type="STRING", description="ballot_unit, control_unit, vvpat, or all")
                            },
                            required=["highlight_part"]
                        )
                    ),
                    types.FunctionDeclaration(
                        name="push_to_calendar",
                        description="Returns structured data to trigger Google Calendar push for election deadlines",
                        parameters=types.Schema(
                            type="OBJECT",
                            properties={
                                "events": types.Schema(
                                    type="ARRAY",
                                    items=types.Schema(
                                        type="OBJECT",
                                        properties={
                                            "title": types.Schema(type="STRING"),
                                            "date": types.Schema(type="STRING"),
                                            "description": types.Schema(type="STRING")
                                        }
                                    )
                                )
                            },
                            required=["events"]
                        )
                    ),
                    types.FunctionDeclaration(
                        name="myth_buster",
                        description="Fact-checks a user's claim against official ECI information. Use when user asks about rumors or misinformation.",
                        parameters=types.Schema(
                            type="OBJECT",
                            properties={
                                "claim": types.Schema(type="STRING", description="The claim being checked"),
                                "verdict": types.Schema(type="STRING", description="TRUE, FALSE, or PARTIALLY TRUE"),
                                "explanation": types.Schema(type="STRING", description="Factual explanation from ECI guidelines")
                            },
                            required=["claim", "verdict", "explanation"]
                        )
                    ),
                    types.FunctionDeclaration(
                        name="find_polling_booth",
                        description="Triggers Google Maps booth finder to locate nearest polling station",
                        parameters=types.Schema(
                            type="OBJECT",
                            properties={
                                "pin_code": types.Schema(type="STRING", description="User PIN code"),
                                "query": types.Schema(type="STRING", description="Search query for Maps API")
                            },
                            required=["pin_code", "query"]
                        )
                    ),
                ]
            )
        ]

    def chat(self, prompt: str) -> dict:
        """Send a message to Gemini and return text + tool calls."""
        if not self.client:
            return {
                "text": "⚠️ Gemini API key is not configured. Please set GEMINI_API_KEY in your .env file.",
                "tool_calls": []
            }

        try:
            response = self.client.models.generate_content(
                model=self.model_name,
                contents=prompt,
                config=types.GenerateContentConfig(
                    system_instruction=self.system_instruction,
                    tools=self.tools,
                    temperature=0.7
                )
            )
            
            result = {"text": "", "tool_calls": []}
            
            if response.candidates:
                candidate = response.candidates[0]
                if candidate.content and candidate.content.parts:
                    for part in candidate.content.parts:
                        if part.text:
                            result["text"] += part.text
                        if part.function_call:
                            # Convert function_call args to a plain dict
                            args = {}
                            if part.function_call.args:
                                for key, value in part.function_call.args.items():
                                    args[key] = value
                            
                            call = {
                                "name": part.function_call.name,
                                "args": args
                            }
                            result["tool_calls"].append(call)
                            
            return result
            
        except Exception as e:
            return {
                "text": f"⚠️ An error occurred: {str(e)}",
                "tool_calls": []
            }
