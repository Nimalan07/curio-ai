import requests
import json

OLLAMA_EMBED_URL = "http://localhost:11434/api/embeddings"
EMBED_MODEL = "nomic-embed-text"

def get_ollama_embedding(text: str) -> list[float] or None:
    """
    Get neural embedding for a text chunk using Ollama's nomic-embed-text.
    Returns None if the model is not found, or if embeddings are disabled.
    """
    try:
        response = requests.post(
            OLLAMA_EMBED_URL,
            json={
                "model": EMBED_MODEL,
                "prompt": text
            },
            timeout=5
        )
        if response.status_code == 200:
            return response.json().get("embedding")
    except Exception as e:
        print(f"[RAG Embeddings] Failed to fetch embedding: {e}")
    return None
