import json
from pathlib import Path
from core.ollama_client import OllamaClient

class ReportGenerator:
    def __init__(self):
        self.client = OllamaClient()
        base_path = Path(__file__).resolve().parent.parent
        prompt_path = base_path / "prompts" / "report_analysis.txt"
        with open(prompt_path, "r", encoding="utf-8") as file:
            self.system_prompt = file.read()

    def generate(self, topic, messages, confidence):
        transcript = ""
        for message in messages:
            role = "Student" if message["role"] == "user" else "Curio"
            transcript += f"{role}: {message['content']}\n\n"

        prompt = f"""
Topic:
{topic}

Student's self-rated confidence:
{confidence}/10

Conversation:

{transcript}

Analyze this conversation and return ONLY valid JSON.
"""

        response = self.client.chat([
            {
                "role": "system",
                "content": self.system_prompt
            },
            {
                "role": "user",
                "content": prompt
            }
        ])

        return self._parse(response, topic, confidence)

    def _parse(self, response, topic, confidence):
        response = response.strip()
        if response.startswith("```"):
            response = response.replace("```json", "").replace("```", "").strip()

        try:
            return json.loads(response)
        except json.JSONDecodeError:
            retry = self.client.chat([
                {
                    "role": "system",
                    "content": self.system_prompt
                },
                {
                    "role": "user",
                    "content": (
                        "Convert the following into ONLY valid JSON. "
                        "No markdown. No explanation.\n\n" + response
                    )
                }
            ])

            retry = retry.strip()
            if retry.startswith("```"):
                retry = retry.replace("```json", "").replace("```", "").strip()

            try:
                return json.loads(retry)
            except json.JSONDecodeError:
                # Fallback report if everything fails
                overall = (confidence + 5.0) / 2.0
                return {
                    "clarity_score": 6,
                    "completeness_score": 5,
                    "accuracy_score": 6,
                    "depth_score": 5,
                    "overall_score": 5.5,
                    "student_confidence": confidence,
                    "confidence_gap": confidence - 5.5,
                    "well_explained": ["The basic concept of the topic was described."],
                    "gaps_found": ["Could not parse complete analysis; please check Ollama connectivity."],
                    "misconception_flags": [],
                    "suggested_review": ["Try explaining with more detail or specific steps."]
                }
