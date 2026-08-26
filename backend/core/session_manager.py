import uuid

class SessionManager:
    def __init__(self):
        self.sessions = {}

    def create_session(self, topic: str, confidence: int):
        session_id = str(uuid.uuid4())
        self.sessions[session_id] = {
            "topic": topic,
            "confidence": confidence,
            "messages": [],
            "turn_count": 0,
            "status": "active"
        }
        return session_id

    def get_session(self, session_id: str):
        return self.sessions.get(session_id)

    def add_message(self, session_id: str, role: str, content: str):
        session = self.sessions.get(session_id)
        if not session:
            return False
        session["messages"].append({
            "role": role,
            "content": content
        })
        return True

    def increment_turn(self, session_id: str):
        session = self.sessions.get(session_id)
        if session:
            session["turn_count"] += 1
            return session["turn_count"]
        return 0

    def get_messages(self, session_id: str):
        session = self.sessions.get(session_id)
        if not session:
            return []
        return session["messages"]

    def get_turn_count(self, session_id: str):
        session = self.sessions.get(session_id)
        if not session:
            return 0
        return session["turn_count"]

    def end_session(self, session_id: str):
        session = self.sessions.get(session_id)
        if session:
            session["status"] = "completed"
