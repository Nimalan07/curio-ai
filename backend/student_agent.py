from typing import List, Dict

from ollama_client import generate_student_response


class StudentAgent:
    """
    Curio's AI learner.

    The agent does not teach.
    It asks probing questions based on the student's explanation.
    """

    def generate_response(
        self,
        conversation: List[Dict[str, str]]
    ) -> str:

        if not conversation:
            raise ValueError(
                "Conversation cannot be empty."
            )

        return generate_student_response(
            conversation
        )


student_agent = StudentAgent()
