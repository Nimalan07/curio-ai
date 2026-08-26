import os
from dotenv import load_dotenv

load_dotenv()

OLLAMA_BASE_URL = "http://localhost:11434"
OLLAMA_CHAT_URL = f"{OLLAMA_BASE_URL}/api/chat"
OLLAMA_MODEL = "llama3.1:8b"
OLLAMA_TIMEOUT = 120

MAX_CONVERSATION_TURNS = 6
MIN_CONVERSATION_TURNS_FOR_REPORT = 3

GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")
GOOGLE_CLIENT_SECRET = os.getenv("GOOGLE_CLIENT_SECRET")
GOOGLE_REDIRECT_URI = os.getenv(
    "GOOGLE_REDIRECT_URI",
    "http://localhost:8000/api/auth/google/callback"
)
FRONTEND_URL = os.getenv(
    "FRONTEND_URL",
    "http://localhost:5173"
)
SESSION_SECRET = os.getenv(
    "SESSION_SECRET",
    "development-secret"
)
