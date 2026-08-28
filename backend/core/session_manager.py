import uuid
from core.database import (
    save_db_session,
    get_db_session,
    add_db_message,
    get_db_messages,
    increment_db_turn,
    end_db_session
)

class SessionManager:
    def create_session(self, topic: str, confidence: int, username: str = None):
        session_id = str(uuid.uuid4())
        save_db_session(session_id, topic, confidence, "active", 0, username)
        return session_id

    def get_session(self, session_id: str):
        session = get_db_session(session_id)
        if session:
            import json
            # Parse JSON columns
            for key in ["difficulty_history", "answer_quality_history", "misconceptions"]:
                val = session.get(key)
                if isinstance(val, str) and val.strip():
                    try:
                        session[key] = json.loads(val)
                    except Exception:
                        session[key] = []
                elif not val:
                    session[key] = []
                    
            if session.get("difficulty_level") is None:
                session["difficulty_level"] = 2
                
            session["messages"] = get_db_messages(session_id)
        return session

    def update_session_adaptive(self, session_id: str, difficulty_level: int, difficulty_history: list, answer_quality_history: list):
        import json
        from core.database import update_db_session_fields
        update_db_session_fields(
            session_id,
            difficulty_level=difficulty_level,
            difficulty_history_json=json.dumps(difficulty_history),
            answer_quality_history_json=json.dumps(answer_quality_history)
        )

    def add_message(self, session_id: str, role: str, content: str):
        session = get_db_session(session_id)
        if not session:
            return False
        add_db_message(session_id, role, content)
        return True

    def increment_turn(self, session_id: str):
        return increment_db_turn(session_id)

    def get_messages(self, session_id: str):
        return get_db_messages(session_id)

    def get_turn_count(self, session_id: str):
        session = get_db_session(session_id)
        if not session:
            return 0
        return session["turn_count"]

    def end_session(self, session_id: str):
        end_db_session(session_id)
