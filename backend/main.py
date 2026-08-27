from fastapi import FastAPI, HTTPException, Header
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.sessions import SessionMiddleware
from pydantic import BaseModel, Field

from core.session_manager import SessionManager
from core.student_agent import StudentAgent
from core.report_generator import ReportGenerator
from core.ollama_client import check_ollama
from auth import router as auth_router
from config import SESSION_SECRET
from core.database import get_username_by_token, save_db_report, get_user_sessions, get_db_session

app = FastAPI(
    title="Curio API",
    description="AI-powered active learning assistant",
    version="1.0.0"
)

app.include_router(auth_router)

app.add_middleware(
    SessionMiddleware,
    secret_key=SESSION_SECRET,
    same_site="lax",
    https_only=False
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173"
      ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

session_manager = SessionManager()
student_agent = StudentAgent()
report_generator = ReportGenerator()

class StartSessionRequest(BaseModel):
    topic: str = Field(..., min_length=2, max_length=200)
    confidence: int = Field(..., ge=1, le=10)

class MessageRequest(BaseModel):
    session_id: str
    message: str = Field(..., min_length=1, max_length=5000)

class ReportRequest(BaseModel):
    session_id: str

def get_user_from_auth(authorization: str):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=401,
            detail="Unauthorized: Missing or invalid token format."
        )
    token = authorization.split(" ")[1]
    username = get_username_by_token(token)
    if not username:
        raise HTTPException(
            status_code=401,
            detail="Unauthorized: Session expired or invalid token."
        )
    return username

@app.get("/api/health")
def health():
    ollama_available = check_ollama()
    return {
        "status": "ok",
        "service": "Curio API",
        "ollama": "available" if ollama_available else "unavailable"
    }

@app.post("/api/session/start")
def start_session(request: StartSessionRequest, authorization: str = Header(None)):
    username = get_user_from_auth(authorization)
    session_id = session_manager.create_session(
        request.topic,
        request.confidence,
        username
    )
    return {
        "success": True,
        "session_id": session_id,
        "topic": request.topic,
        "confidence": request.confidence
    }

@app.post("/api/session/message")
def send_message(request: MessageRequest, authorization: str = Header(None)):
    username = get_user_from_auth(authorization)
    session = session_manager.get_session(request.session_id)
    if not session:
        raise HTTPException(
            status_code=404,
            detail="Session not found"
        )
    
    # Verify session ownership
    if session.get("username") and session.get("username") != username:
        raise HTTPException(
            status_code=403,
            detail="Forbidden: You do not own this session."
        )

    session_manager.add_message(
        request.session_id,
        "user",
        request.message
    )

    try:
        reply = student_agent.generate_response(
            topic=session["topic"],
            messages=session["messages"]
        )
    except Exception as error:
        # Rollback message if AI generation failed
        if session["messages"]:
            session["messages"].pop()
        raise HTTPException(
            status_code=503,
            detail=f"AI student failed to generate response: {error}"
        )

    session_manager.add_message(
        request.session_id,
        "assistant",
        reply["question"]
    )

    session_manager.increment_turn(request.session_id)

    return {
        "success": True,
        "question": reply["question"],
        "reason": reply.get("reason", "I noticed a part of your explanation that needs clarification."),
        "knowledge_used": reply.get("knowledge_used", False),
        "knowledge_similarity": reply.get("knowledge_similarity", 0.0),
        "turn_count": session["turn_count"] + 1
    }

@app.post("/api/session/report")
def generate_report(request: ReportRequest, authorization: str = Header(None)):
    username = get_user_from_auth(authorization)
    session = session_manager.get_session(request.session_id)
    if not session:
        raise HTTPException(
            status_code=404,
            detail="Session not found"
        )

    # Verify session ownership
    if session.get("username") and session.get("username") != username:
        raise HTTPException(
            status_code=403,
            detail="Forbidden: You do not own this session."
        )

    try:
        import json
        report = report_generator.generate(
            topic=session["topic"],
            messages=session["messages"],
            confidence=session["confidence"]
        )
        # Convert report to string if it is a dict
        report_str = json.dumps(report) if isinstance(report, dict) else str(report)
    except Exception as error:
        raise HTTPException(
            status_code=503,
            detail=f"Could not generate report: {error}"
        )

    # Save the report to SQLite database
    save_db_report(request.session_id, report_str)

    return {
        "success": True,
        "report": report
    }

@app.get("/api/sessions")
def list_sessions(authorization: str = Header(None)):
    username = get_user_from_auth(authorization)
    sessions = get_user_sessions(username)
    return {
        "success": True,
        "sessions": sessions
    }

@app.get("/api/session/{session_id}")
def get_session_info(session_id: str, authorization: str = Header(None)):
    username = get_user_from_auth(authorization)
    session = session_manager.get_session(session_id)
    if not session:
        raise HTTPException(
            status_code=404,
            detail="Session not found"
        )
    
    db_sess = get_db_session(session_id)
    if not db_sess or db_sess.get("username") != username:
        raise HTTPException(
            status_code=403,
            detail="Forbidden: You do not own this session."
        )
        
    return {
        "success": True,
        "session_id": session_id,
        "topic": session["topic"],
        "confidence": session["confidence"],
        "status": session["status"],
        "turn_count": session["turn_count"],
        "messages": session["messages"]
    }

@app.get("/api/session/report/{session_id}")
def get_completed_report(session_id: str, authorization: str = Header(None)):
    username = get_user_from_auth(authorization)
    session = get_db_session(session_id)
    if not session:
        raise HTTPException(
            status_code=404,
            detail="Session not found"
        )
    if session.get("username") != username:
        raise HTTPException(
            status_code=403,
            detail="Forbidden: You do not own this session."
        )
    if not session.get("report"):
        raise HTTPException(
            status_code=404,
            detail="Report not found or not yet generated for this session."
        )
    
    # Try parsing stored report if it's in JSON format
    import json
    try:
        report_data = json.loads(session["report"])
    except Exception:
        report_data = session["report"]

    return {
        "success": True,
        "topic": session["topic"],
        "confidence": session["confidence"],
        "report": report_data
    }
