import os
from core.ollama_client import OllamaClient
from core.groq_client import GroqClient

def get_llm():
    provider = os.getenv("LLM_PROVIDER", "ollama")
    if provider == "ollama":
        return OllamaClient()
    elif provider == "groq":
        return GroqClient()
    raise ValueError(f"Unsupported LLM provider: {provider}")
