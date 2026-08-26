import requests
from config import OLLAMA_CHAT_URL, OLLAMA_MODEL, OLLAMA_TIMEOUT

class OllamaClient:
    def chat(self, messages):
        response = requests.post(
            OLLAMA_CHAT_URL,
            json={
                "model": OLLAMA_MODEL,
                "messages": messages,
                "stream": False
            },
            timeout=OLLAMA_TIMEOUT
        )
        response.raise_for_status()
        data = response.json()
        return data["message"]["content"]

def check_ollama() -> bool:
    """
    Check whether Ollama is running.
    """
    try:
        response = requests.get(
            OLLAMA_CHAT_URL.replace("/api/chat", "/api/tags"),
            timeout=5
        )
        return response.status_code == 200
    except requests.RequestException:
        return False
