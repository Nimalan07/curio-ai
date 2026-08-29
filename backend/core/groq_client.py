import os
import requests

class GroqClient:
    def __init__(self):
        self.api_key = os.getenv("GROQ_API_KEY", "")
        self.model = os.getenv("GROQ_MODEL", "llama-3.3-70b-versatile")
        self.api_url = "https://api.groq.com/openai/v1/chat/completions"

    def chat(self, messages):
        if not self.api_key:
            raise ValueError("GROQ_API_KEY environment variable is not set.")
        
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }
        
        payload = {
            "model": self.model,
            "messages": messages,
            "stream": False
        }
        
        response = requests.post(
            self.api_url,
            json=payload,
            headers=headers,
            timeout=45
        )

        print("=== GROQ DEBUG ===")
        print("Status:", response.status_code)
        print("Response:", response.text[:2000])
        print("==================")

        if not response.ok:
            raise RuntimeError(
                f"Groq API error {response.status_code}: {response.text[:2000]}"
            )

        data = response.json()
        return data["choices"][0]["message"]["content"]
