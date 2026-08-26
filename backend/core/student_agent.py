import json
from pathlib import Path
from core.ollama_client import OllamaClient

class StudentAgent:
    def __init__(self):
        self.client = OllamaClient()
        base_path = Path(__file__).resolve().parent.parent
        prompt_path = base_path / "prompts" / "student_persona.txt"
        with open(prompt_path, "r", encoding="utf-8") as file:
            self.system_prompt = file.read()

    def generate_response(self, topic, messages):
        prompt_messages = [
            {
                "role": "system",
                "content": self.system_prompt
            }
        ]

        prompt_messages.append({
            "role": "system",
            "content": f"The current topic is: {topic}"
        })

        prompt_messages.extend(messages)

        response = self.client.chat(prompt_messages)

        try:
            return json.loads(response)
        except json.JSONDecodeError:
            return {
                "question": response,
                "reason": "I noticed a part of your explanation that needs clarification."
            }
