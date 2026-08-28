import json
from core.ollama_client import OllamaClient

MISCONCEPTION_PROMPT = """
You are Curio's misconception detection engine.

Analyze the student's explanation.

Identify ONLY misconceptions that are actually supported
by what the student said.

Do not invent mistakes.

Return JSON ONLY:

{
  "patterns": [
    {
      "label": "...",
      "evidence": "...",
      "severity": "low|medium|high",
      "explanation": "...",
      "review_concept": "..."
    }
  ]
}

A misconception must be based on evidence in the student's
actual explanation.

If no misconception exists:

{
  "patterns": []
}
"""

class MisconceptionDetector:
    def __init__(self):
        self.client = OllamaClient()

    def detect_misconceptions(self, topic, messages):
        transcript = ""
        for message in messages:
            role = "Student" if message["role"] == "user" else "Curio"
            transcript += f"{role}: {message['content']}\n\n"

        prompt = f"""
{MISCONCEPTION_PROMPT}

TOPIC:
{topic}

TRANSCRIPT:
{transcript}
"""
        response = self.client.chat([
            {
                "role": "system",
                "content": MISCONCEPTION_PROMPT
            },
            {
                "role": "user",
                "content": prompt
            }
        ])

        return self._parse(response)

    def _parse(self, response):
        cleaned = response.strip()
        
        # Remove common prefixes
        for prefix in ["assistant:", "assistant"]:
            if cleaned.lower().startswith(prefix):
                cleaned = cleaned[len(prefix):].strip()
                
        # Strip markdown code blocks
        if cleaned.startswith("```"):
            lines = cleaned.splitlines()
            if lines[0].startswith("```"):
                lines = lines[1:]
            if lines and lines[-1].startswith("```"):
                lines = lines[:-1]
            cleaned = "\n".join(lines).strip()

        # Find first '{' and last '}'
        start_idx = cleaned.find("{")
        end_idx = cleaned.rfind("}")
        
        if start_idx != -1 and end_idx != -1 and end_idx > start_idx:
            json_candidate = cleaned[start_idx:end_idx + 1]
            try:
                return json.loads(json_candidate)
            except json.JSONDecodeError:
                pass

        try:
            return json.loads(cleaned)
        except json.JSONDecodeError:
            # Fallback
            return {
                "patterns": []
            }
