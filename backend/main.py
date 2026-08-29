from fastapi import FastAPI, HTTPException, Header
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.sessions import SessionMiddleware
from pydantic import BaseModel, Field

from core.session_manager import SessionManager
from core.student_agent import StudentAgent
from core.report_generator import ReportGenerator
from core.ollama_client import check_ollama
from auth import router as auth_router
from config import SESSION_SECRET, FRONTEND_URL
from core.database import get_username_by_token, save_db_report, get_user_sessions, get_db_session

from core.adaptive_engine import update_difficulty, difficulty_name
from core.teach_back import TeachBackEngine
from core.misconception_detector import MisconceptionDetector

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

origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173"
]
if FRONTEND_URL:
    cleaned_url = FRONTEND_URL.rstrip("/")
    if cleaned_url not in origins:
        origins.append(cleaned_url)

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

session_manager = SessionManager()
student_agent = StudentAgent()
report_generator = ReportGenerator()
teach_back_engine = TeachBackEngine()
misconception_detector = MisconceptionDetector()

class StartSessionRequest(BaseModel):
    topic: str = Field(..., min_length=2, max_length=200)
    confidence: int = Field(..., ge=1, le=10)

class MessageRequest(BaseModel):
    session_id: str
    message: str = Field(..., min_length=1, max_length=5000)

class ReportRequest(BaseModel):
    session_id: str

class TeachBackRequest(BaseModel):
    session_id: str

class DifficultyRequest(BaseModel):
    session_id: str
    difficulty_level: int = Field(..., ge=1, le=5)

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

    current_level = session.get("difficulty_level", 2)
    if current_level is None:
        current_level = 2

    # Fetch updated messages list (including user's new message)
    session_messages = session_manager.get_messages(request.session_id)

    try:
        reply = student_agent.generate_response(
            topic=session["topic"],
            messages=session_messages,
            difficulty_level=current_level
        )
    except Exception as error:
        import traceback
        traceback.print_exc()

        raise HTTPException(
            status_code=503,
            detail=f"AI student failed to generate response: {type(error).__name__}: {str(error)}"
        )

    session_manager.add_message(
        request.session_id,
        "assistant",
        reply["question"]
    )

    new_turn_count = session_manager.increment_turn(request.session_id)

    answer_quality = float(reply.get("answer_quality", 0.5))
    new_level = update_difficulty(
        current_level=current_level,
        answer_quality=answer_quality,
        confidence=session.get("confidence", 5)
    )

    difficulty_history = session.get("difficulty_history") or []
    answer_quality_history = session.get("answer_quality_history") or []
    
    difficulty_history.append(new_level)
    answer_quality_history.append(answer_quality)

    session_manager.update_session_adaptive(
        request.session_id,
        difficulty_level=new_level,
        difficulty_history=difficulty_history,
        answer_quality_history=answer_quality_history
    )

    return {
        "success": True,
        "question": reply["question"],
        "reason": reply.get("reason", "I noticed a part of your explanation that needs clarification."),
        "knowledge_used": reply.get("knowledge_used", False),
        "knowledge_similarity": reply.get("knowledge_similarity", 0.0),
        "turn_count": new_turn_count,
        "difficulty": new_level,
        "difficulty_name": difficulty_name(new_level),
        "answer_quality": answer_quality
    }

@app.post("/api/session/difficulty")
def set_difficulty(request: DifficultyRequest, authorization: str = Header(None)):
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

    difficulty_history = session.get("difficulty_history") or []
    difficulty_history.append(request.difficulty_level)

    session_manager.update_session_adaptive(
        request.session_id,
        difficulty_level=request.difficulty_level,
        difficulty_history=difficulty_history,
        answer_quality_history=session.get("answer_quality_history") or []
    )

    return {
        "success": True,
        "difficulty": request.difficulty_level,
        "difficulty_name": difficulty_name(request.difficulty_level)
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
        
        # Detect misconceptions
        try:
            m_data = misconception_detector.detect_misconceptions(
                topic=session["topic"],
                messages=session["messages"]
            )
            report["misconception_patterns"] = m_data.get("patterns", [])
        except Exception as e:
            print(f"[Misconception Detector] Failed: {e}")
            report["misconception_patterns"] = []

        # Convert report to string if it is a dict
        report_str = json.dumps(report) if isinstance(report, dict) else str(report)
        
        # Update misconceptions column in DB
        from core.database import update_db_session_fields
        update_db_session_fields(
            request.session_id,
            misconceptions_json=json.dumps(report.get("misconception_patterns", []))
        )
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

@app.post("/api/session/teach-back")
def teach_back(request: TeachBackRequest, authorization: str = Header(None)):
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
        result = teach_back_engine.generate_teach_back(
            session["topic"],
            session["messages"]
        )
        return {
            "success": True,
            "teach_back": result
        }
    except Exception as e:
        raise HTTPException(
            status_code=503,
            detail=f"Failed to generate teach-back explanation: {e}"
        )

@app.get("/api/user/progress")
def get_progress(authorization: str = Header(None)):
    username = get_user_from_auth(authorization)
    sessions = get_user_sessions(username)

    history = []
    for session in sessions:
        if not session.get("report"):
            continue

        try:
            import json
            report = json.loads(session["report"])
        except Exception:
            continue

        overall = report.get("overall_score")
        if overall is None:
            scores = [
                report.get("clarity_score", 0),
                report.get("completeness_score", 0),
                report.get("accuracy_score", 0),
                report.get("depth_score", 0),
            ]
            overall = sum(float(x) for x in scores) / 4

        history.append({
            "topic": session["topic"],
            "score": round(float(overall), 1),
            "confidence": session.get("confidence"),
            "date": session.get("created_at")
        })

    return {
        "success": True,
        "history": history
    }
