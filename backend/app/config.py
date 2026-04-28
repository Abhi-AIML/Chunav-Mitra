import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
    MAPS_API_KEY = os.getenv("MAPS_API_KEY")
    FLASK_ENV = os.getenv("FLASK_ENV", "development")
