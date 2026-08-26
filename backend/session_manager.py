import uuid
from typing import Dict, List, Optional


class SessionManager:
    """
    Manages active Curio sessions in memory.

    Each session contains:
    - topic
    - conversation messages
    - turn count
    - status
    """

    def __init__(self):
        self.sessions: Dict[str, dict] = {}

    def create_session(self, topic: str) -> str:
        """
        Create a new session and return its ID.
        """

        session_id = str(uuid.uuid4())

        self.sessions[session_id] = {
            "session_id": session_id,
            "topic": topic,
            "messages": [],
            "turn_count": 0,
            "status": "active",
        }

        return session_id

    def get_session(self, session_id: str) -> Optional[dict]:
        """
        Retrieve a session by ID.
        """

        return self.sessions.get(session_id)

    def add_message(
        self,
        session_id: str,
        role: str,
        content: str
    ) -> None:
        """
        Add a message to a session's conversation.
        """

        session = self.get_session(session_id)

        if session is None:
            raise ValueError("Session not found.")

        session["messages"].append(
            {
                "role": role,
                "content": content,
            }
        )

    def increment_turn(self, session_id: str) -> int:
        """
        Increase the conversation turn count.
        """

        session = self.get_session(session_id)

        if session is None:
            raise ValueError("Session not found.")

        session["turn_count"] += 1

        return session["turn_count"]

    def get_messages(
        self,
        session_id: str
    ) -> List[dict]:
        """
        Return conversation messages.
        """

        session = self.get_session(session_id)

        if session is None:
            raise ValueError("Session not found.")

        return session["messages"]

    def get_turn_count(self, session_id: str) -> int:
        """
        Return the current turn count.
        """

        session = self.get_session(session_id)

        if session is None:
            raise ValueError("Session not found.")

        return session["turn_count"]

    def end_session(self, session_id: str) -> None:
        """
        Mark a session as completed.
        """

        session = self.get_session(session_id)

        if session is None:
            raise ValueError("Session not found.")

        session["status"] = "completed"

    def delete_session(self, session_id: str) -> None:
        """
        Delete a session completely.
        """

        if session_id in self.sessions:
            del self.sessions[session_id]


# One shared manager for the running FastAPI application.
session_manager = SessionManager()
