from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from core.session_manager import SessionManager
from core.student_agent import StudentAgent
from core.report_generator import ReportGenerator
from core.ollama_client import check_ollama

app = FastAPI(
    title="Curio API",
    description="AI-powered active learning assistant",
    version="1.0.0"
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

@app.get("/api/health")
def health():
    ollama_available = check_ollama()
    return {
        "status": "ok",
        "service": "Curio API",
        "ollama": "available" if ollama_available else "unavailable"
    }

@app.post("/api/session/start")
def start_session(request: StartSessionRequest):
    session_id = session_manager.create_session(
        request.topic,
        request.confidence
    )
    return {
        "success": True,
        "session_id": session_id,
        "topic": request.topic,
        "confidence": request.confidence
    }

@app.post("/api/session/message")
def send_message(request: MessageRequest):
    session = session_manager.get_session(request.session_id)
    if not session:
        raise HTTPException(
            status_code=404,
            detail="Session not found"
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
        "turn_count": session["turn_count"]
    }

@app.post("/api/session/report")
def generate_report(request: ReportRequest):
    session = session_manager.get_session(request.session_id)
    if not session:
        raise HTTPException(
            status_code=404,
            detail="Session not found"
        )

    try:
        report = report_generator.generate(
            topic=session["topic"],
            messages=session["messages"],
            confidence=session["confidence"]
        )
    except Exception as error:
        raise HTTPException(
            status_code=503,
            detail=f"Could not generate report: {error}"
        )

    session_manager.end_session(request.session_id)

    return {
        "success": True,
        "report": report
    }
