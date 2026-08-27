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
        prompt_messages = [
            {
                "role": "system",
                "content": self.system_prompt
            }
        ]

        # RAG Integration: Retrieve relevant ground-truth facts if gate matches
        from core.knowledge_gate import should_retrieve_knowledge
        from core.knowledge_retriever import retrieve_knowledge_context

        last_user_message = ""
        for msg in reversed(messages):
            if msg.get("role") == "user":
                last_user_message = msg.get("content", "")
                break

        knowledge_context = ""
        if last_user_message and should_retrieve_knowledge(topic, last_user_message):
            knowledge_context = retrieve_knowledge_context(topic, last_user_message)

        if knowledge_context:
            prompt_messages.append({
                "role": "system",
                "content": knowledge_context
            })

        prompt_messages.append({
            "role": "system",
            "content": f"The current topic is: {topic}"
        })

        prompt_messages.extend(messages)

        response = self.client.chat(prompt_messages)

        parsed = self._extract_json(response)
        if parsed and isinstance(parsed, dict) and "question" in parsed:
            return parsed

        return {
            "question": response,
            "reason": "I noticed a part of your explanation that needs clarification."
        }
