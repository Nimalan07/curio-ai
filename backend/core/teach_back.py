from core.llm_client import get_llm

TEACH_BACK_PROMPT = """
You are Curio's educational analysis engine.

The student has just completed a teaching session.

Create an ideal explanation of the same topic.

IMPORTANT:

The ideal explanation should be appropriate for the student's apparent level.

Do NOT simply rewrite the student's explanation.

Compare the student's explanation against the concept requirements.

Return JSON ONLY:

{
  "student_summary": "...",
  "ideal_explanation": "...",
  "covered_well": [],
  "missing_from_explanation": [],
  "misconceptions_to_fix": [],
  "next_concepts": []
}

Rules:

- covered_well = things the student genuinely explained correctly
- missing_from_explanation = important concepts absent from the explanation
- misconceptions_to_fix = actual incorrect claims
- next_concepts = concepts worth studying next
"""

class TeachBackEngine:
    def __init__(self):
        self.client = get_llm()

    def generate_teach_back(self, topic, messages):
        transcript = ""
        for message in messages:
            role = "Student" if message["role"] == "user" else "Curio"
            transcript += f"{role}: {message['content']}\n\n"

        prompt = f"""
{TEACH_BACK_PROMPT}

TOPIC:
{topic}

TRANSCRIPT:
{transcript}
"""
        response = self.client.chat([
            {
                "role": "system",
                "content": TEACH_BACK_PROMPT
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
                "student_summary": "Summary of explanations provided.",
                "ideal_explanation": "A complete and robust concept model.",
                "covered_well": [],
                "missing_from_explanation": [],
                "misconceptions_to_fix": [],
                "next_concepts": []
            }
