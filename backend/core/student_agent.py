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

    def _extract_json(self, response_str: str):
        cleaned = response_str.strip()
        
        # Remove common prefixes if they exist outside the JSON
        for prefix in ["assistant:", "assistant"]:
            if cleaned.lower().startswith(prefix):
                cleaned = cleaned[len(prefix):].strip()
        
        # Strip markdown code block
        if cleaned.startswith("```"):
            lines = cleaned.splitlines()
            if lines[0].startswith("```"):
                lines = lines[1:]
            if lines and lines[-1].startswith("```"):
                lines = lines[:-1]
            cleaned = "\n".join(lines).strip()
            
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
            return None

    def generate_response(self, topic, messages):
        # Extract the latest user message
        last_user_message = ""
        for msg in reversed(messages):
            if msg.get("role") == "user":
                last_user_message = msg.get("content", "")
                break

        # RAG Gating: Retrieve relevant ground-truth facts if gate matches
        from core.knowledge_retriever import get_relevant_knowledge
        
        knowledge = get_relevant_knowledge(
            topic=topic,
            student_message=last_user_message,
            messages=messages,
            top_k=3
        )

        system_prompt = self.system_prompt
        
        if knowledge["used"]:
            system_prompt += (
                f"\n\nLOCAL KNOWLEDGE CONTEXT:\n{knowledge['context']}\n\n"
                "Use this context to ground your reasoning. "
                "Do not mention that you retrieved this context. "
                "Do not quote it unnecessarily.\n"
            )

        prompt_messages = [
            {
                "role": "system",
                "content": system_prompt
            },
            {
                "role": "system",
                "content": f"The current topic is: {topic}"
            }
        ]

        prompt_messages.extend(messages)

        response = self.client.chat(prompt_messages)

        parsed = self._extract_json(response)
        if parsed and isinstance(parsed, dict) and "question" in parsed:
            return {
                "question": parsed["question"],
                "reason": parsed.get("reason", "I noticed a part of your explanation that needs clarification."),
                "knowledge_used": knowledge["used"],
                "knowledge_similarity": knowledge["similarity"]
            }

        return {
            "question": response,
            "reason": "I want to understand your reasoning more deeply.",
            "knowledge_used": knowledge["used"],
            "knowledge_similarity": knowledge["similarity"]
        }
