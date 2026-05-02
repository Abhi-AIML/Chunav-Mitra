import os
import logging
from typing import Dict, Any, List, Optional
from google import genai
from google.genai import types

class GeminiService:
    """
    Service class for interacting with the Google Gemini 2.0 API.
    
    Handles system instructions, tool definitions, and chat orchestration 
    for the Chunav Mitra election education agent.
    """

    def __init__(self) -> None:
        """Initialize the Gemini client and configure the model settings."""
        self.api_key: str = os.getenv("GEMINI_API_KEY", "")
        self.client: Optional[genai.Client] = genai.Client(api_key=self.api_key) if self.api_key else None
        
        # Using the latest Flash model for optimal speed-to-quality ratio
        self.model_name: str = "gemini-3.1-flash-lite-preview"
        
        self.system_instruction: str = self._get_system_instruction()
        self.tools: List[types.Tool] = self._define_tools()

    def _get_system_instruction(self) -> str:
        """Returns the core personality and behavioral guidelines for the agent."""
        return """You are Chunav Mitra (चुनाव मित्र), an enthusiastic and knowledgeable Election Education Companion for Indian citizens.

Your personality:
- Warm, encouraging, and patriotic.
- Mix Hindi phrases naturally into English responses (e.g., "Namaste!", "Bahut accha sawaal!").
- Use emojis thoughtfully to make conversations engaging.
- Always be factually accurate about Indian electoral processes.

Your mission:
- Educate citizens about how Indian elections work.
- Explain the voting process step by step.
- Bust myths and misinformation about EVMs and elections.
- Help users find their polling booths.
- Explain the Election Commission of India's (ECI) role.

IMPORTANT: You MUST use the provided tools to trigger visual experiences on the canvas:
- Use render_election_timeline when discussing election schedules, phases, or dates.
- Use render_booth_simulator when explaining the voting process or what happens at a polling booth.
- Use render_constituency_map when discussing constituencies or geographic election info.
- Use render_evm_explainer when explaining EVMs, VVPAT, or electronic voting technology.
- Use push_to_calendar when the user wants to track important election dates.
- Use myth_buster when fact-checking claims or busting election myths.
- Use find_polling_booth when helping users locate their polling station.

Always provide BOTH a text response AND trigger the relevant tool. The tool renders visuals on the user's screen.
Keep text responses concise (2-4 sentences) since the visual does the heavy lifting.

Key facts:
- India uses standalone M3 EVMs (Mark 3).
- VVPAT ensures 100% auditable verification since 2019.
- Voter ID (EPIC) is primary, but 12 other IDs (Aadhaar, PAN, etc.) are accepted.
- Indelible ink is applied to the left index finger.
"""

    def _define_tools(self) -> List[types.Tool]:
        """Defines the function declarations available to the Gemini model."""
        return [
            types.Tool(
                function_declarations=[
                    types.FunctionDeclaration(
                        name="render_election_timeline",
                        description="Renders a visual election timeline. Use for schedules, dates, or election phases.",
                        parameters=types.Schema(
                            type="OBJECT",
                            properties={
                                "phase": types.Schema(type="STRING", description="Current phase context"),
                                "events": types.Schema(
                                    type="ARRAY",
                                    items=types.Schema(
                                        type="OBJECT",
                                        properties={
                                            "date": types.Schema(type="STRING", description="YYYY-MM-DD"),
                                            "label": types.Schema(type="STRING"),
                                            "status": types.Schema(type="STRING", enum=["past", "current", "upcoming"])
                                        }
                                    )
                                ),
                                "show_calendar_button": types.Schema(type="BOOLEAN")
                            },
                            required=["phase", "events", "show_calendar_button"]
                        )
                    ),
                    types.FunctionDeclaration(
                        name="render_booth_simulator",
                        description="Activates the Indian polling booth simulator. Use when explaining the voting steps.",
                        parameters=types.Schema(
                            type="OBJECT",
                            properties={
                                "step": types.Schema(type="INTEGER", description="1-5: Entry, ID, Ink, EVM, VVPAT"),
                                "highlight_officer": types.Schema(type="STRING")
                            },
                            required=["step", "highlight_officer"]
                        )
                    ),
                    types.FunctionDeclaration(
                        name="render_constituency_map",
                        description="Shows interactive India map with phase or constituency highlights.",
                        parameters=types.Schema(
                            type="OBJECT",
                            properties={
                                "mode": types.Schema(type="STRING", enum=["phases", "constituency"]),
                                "pin_code": types.Schema(type="STRING"),
                                "constituency_name": types.Schema(type="STRING"),
                                "highlight_phase": types.Schema(type="INTEGER")
                            },
                            required=["mode"]
                        )
                    ),
                    types.FunctionDeclaration(
                        name="render_evm_explainer",
                        description="Shows the interactive EVM + VVPAT diagram.",
                        parameters=types.Schema(
                            type="OBJECT",
                            properties={
                                "highlight_part": types.Schema(type="STRING", enum=["ballot_unit", "control_unit", "vvpat", "all"])
                            },
                            required=["highlight_part"]
                        )
                    ),
                    types.FunctionDeclaration(
                        name="push_to_calendar",
                        description="Triggers Google Calendar push for election deadlines.",
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
                        description="Fact-checks claims against official ECI info. Use for myths or misinformation.",
                        parameters=types.Schema(
                            type="OBJECT",
                            properties={
                                "claim": types.Schema(type="STRING"),
                                "verdict": types.Schema(type="STRING", enum=["TRUE", "FALSE", "PARTIALLY TRUE"]),
                                "explanation": types.Schema(type="STRING")
                            },
                            required=["claim", "verdict", "explanation"]
                        )
                    ),
                    types.FunctionDeclaration(
                        name="find_polling_booth",
                        description="Triggers Google Maps booth finder based on PIN code.",
                        parameters=types.Schema(
                            type="OBJECT",
                            properties={
                                "pin_code": types.Schema(type="STRING"),
                                "query": types.Schema(type="STRING")
                            },
                            required=["pin_code", "query"]
                        )
                    ),
                ]
            )
        ]

    def chat(self, prompt: str) -> Dict[str, Any]:
        """
        Sends a user prompt to Gemini and parses the response for text and tool calls.
        
        Args:
            prompt: The user's input message.
            
        Returns:
            A dictionary containing 'text' and a list of 'tool_calls'.
        """
        if not self.client:
            logging.error("Gemini Client not initialized. Missing API Key.")
            return {
                "text": "⚠️ System Configuration Error: Gemini API key is missing.",
                "tool_calls": []
            }

        try:
            logging.debug(f"Calling Gemini API with model {self.model_name}")
            response = self.client.models.generate_content(
                model=self.model_name,
                contents=prompt,
                config=types.GenerateContentConfig(
                    system_instruction=self.system_instruction,
                    tools=self.tools,
                    temperature=0.7
                )
            )
            
            return self._parse_response(response)
            
        except Exception as e:
            logging.exception("Gemini API call failed")
            return {
                "text": f"⚠️ An unexpected error occurred while processing your request: {str(e)}",
                "tool_calls": []
            }

    def _parse_response(self, response: Any) -> Dict[str, Any]:
        """Extracts text content and function calls from the Gemini response candidate."""
        result: Dict[str, Any] = {"text": "", "tool_calls": []}
        
        if not response.candidates:
            return result
            
        candidate = response.candidates[0]
        if candidate.content and candidate.content.parts:
            for part in candidate.content.parts:
                # Handle text parts
                if part.text:
                    result["text"] += part.text
                
                # Handle function call parts
                if part.function_call:
                    # Parse arguments into a serializable dictionary
                    args = {}
                    if part.function_call.args:
                        for key, value in part.function_call.args.items():
                            args[key] = value
                    
                    result["tool_calls"].append({
                        "name": part.function_call.name,
                        "args": args
                    })
                            
        return result
