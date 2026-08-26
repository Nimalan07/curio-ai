from typing import Any, Dict

from fastapi import (
    FastAPI,
    HTTPException
)

from fastapi.middleware.cors import CORSMiddleware

from pydantic import BaseModel, Field

from config import (
    MAX_CONVERSATION_TURNS,
    MIN_CONVERSATION_TURNS_FOR_REPORT
)

from ollama_client import check_ollama

from session_manager import session_manager

from student_agent import student_agent

from report_generator import report_generator

from utils.validators import (
    validate_topic,
    validate_message,
    validate_session_exists,
    can_continue_conversation,
    can_generate_report
)


# ============================================================
# APP
# ============================================================

app = FastAPI(
    title="Curio API",
    description=(
        "Backend API for Curio - "
        "An AI That Learns By Being Taught"
    ),
    version="1.0.0"
)


# ============================================================
# CORS
# ============================================================

app.add_middleware(
    CORSMiddleware,

    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],

    allow_credentials=True,

    allow_methods=["*"],

    allow_headers=["*"],
)


# ============================================================
# REQUEST MODELS
# ============================================================

class StartSessionRequest(BaseModel):
    topic: str = Field(
        ...,
        min_length=1,
        max_length=200
    )


class StartSessionResponse(BaseModel):
    session_id: str
    topic: str
    status: str


class MessageRequest(BaseModel):
    session_id: str
    message: str = Field(
        ...,
        min_length=1,
        max_length=5000
    )


class MessageResponse(BaseModel):
    session_id: str
    reply: str
    turn: int
    max_turns: int
    can_generate_report: bool


class ReportRequest(BaseModel):
    session_id: str


class ReportResponse(BaseModel):
    session_id: str
    topic: str
    turn_count: int
    report: Dict[str, Any]


# ============================================================
# HEALTH
# ============================================================

@app.get("/api/health")
def health_check():

    ollama_available = check_ollama()

    return {
        "status": "ok",
        "service": "Curio API",
        "ollama": (
            "available"
            if ollama_available
            else "unavailable"
        )
    }


# ============================================================
# START SESSION
# ============================================================

@app.post(
    "/api/session/start",
    response_model=StartSessionResponse
)
def start_session(
    request: StartSessionRequest
):

    try:

        topic = validate_topic(
            request.topic
        )

        session_id = session_manager.create_session(
            topic
        )

        return {
            "session_id": session_id,
            "topic": topic,
            "status": "active"
        }

    except ValueError as error:

        raise HTTPException(
            status_code=400,
            detail=str(error)
        )


# ============================================================
# SEND MESSAGE
# ============================================================

@app.post(
    "/api/session/message",
    response_model=MessageResponse
)
def send_message(
    request: MessageRequest
):

    # --------------------------------------------------------
    # Find session
    # --------------------------------------------------------

    session = session_manager.get_session(
        request.session_id
    )

    try:

        validate_session_exists(
            session
        )

    except ValueError as error:

        raise HTTPException(
            status_code=404,
            detail=str(error)
        )

    # --------------------------------------------------------
    # Check session status
    # --------------------------------------------------------

    if session["status"] != "active":

        raise HTTPException(
            status_code=400,
            detail="This session has already ended."
        )

    # --------------------------------------------------------
    # Validate student message
    # --------------------------------------------------------

    try:

        message = validate_message(
            request.message
        )

    except ValueError as error:

        raise HTTPException(
            status_code=400,
            detail=str(error)
        )

    # --------------------------------------------------------
    # Check turn limit
    # --------------------------------------------------------

    if not can_continue_conversation(
        session["turn_count"]
    ):

        raise HTTPException(
            status_code=400,
            detail=(
                "Maximum conversation length reached. "
                "Generate the understanding report."
            )
        )

    # --------------------------------------------------------
    # Store student message
    # --------------------------------------------------------

    session_manager.add_message(
        session_id=request.session_id,
        role="user",
        content=message
    )

    # --------------------------------------------------------
    # Generate AI learner response
    # --------------------------------------------------------

    try:

        conversation = session_manager.get_messages(
            request.session_id
        )

        ai_reply = student_agent.generate_response(
            conversation
        )

    except Exception as error:

        # Remove the message if AI failed.
        if session["messages"]:
            session["messages"].pop()

        raise HTTPException(
            status_code=503,
            detail=f"AI service error: {error}"
        )

    # --------------------------------------------------------
    # Store AI response
    # --------------------------------------------------------

    session_manager.add_message(
        session_id=request.session_id,
        role="assistant",
        content=ai_reply
    )

    # --------------------------------------------------------
    # Increase turn count
    # --------------------------------------------------------

    turn = session_manager.increment_turn(
        request.session_id
    )

    # --------------------------------------------------------
    # Response
    # --------------------------------------------------------

    return {
        "session_id": request.session_id,
        "reply": ai_reply,
        "turn": turn,
        "max_turns": MAX_CONVERSATION_TURNS,
        "can_generate_report": (
            can_generate_report(turn)
        )
    }


# ============================================================
# GENERATE REPORT
# ============================================================

@app.post(
    "/api/session/report",
    response_model=ReportResponse
)
def generate_understanding_report(
    request: ReportRequest
):

    # --------------------------------------------------------
    # Find session
    # --------------------------------------------------------

    session = session_manager.get_session(
        request.session_id
    )

    try:

        validate_session_exists(
            session
        )

    except ValueError as error:

        raise HTTPException(
            status_code=404,
            detail=str(error)
        )

    # --------------------------------------------------------
    # Minimum turns
    # --------------------------------------------------------

    if not can_generate_report(
        session["turn_count"]
    ):

        raise HTTPException(
            status_code=400,
            detail=(
                f"At least "
                f"{MIN_CONVERSATION_TURNS_FOR_REPORT} "
                f"turns are required before generating "
                f"the report."
            )
        )

    # --------------------------------------------------------
    # Build transcript
    # --------------------------------------------------------

    transcript_lines = [
        f"TOPIC: {session['topic']}",
        "",
    ]

    for message in session["messages"]:

        role = message["role"]

        if role == "user":
            speaker = "STUDENT"

        elif role == "assistant":
            speaker = "AI LEARNER"

        else:
            speaker = role.upper()

        transcript_lines.append(
            f"{speaker}:"
        )

        transcript_lines.append(
            message["content"]
        )

        transcript_lines.append("")

    transcript = "\n".join(
        transcript_lines
    )

    # --------------------------------------------------------
    # Generate report
    # --------------------------------------------------------

    try:

        report = report_generator.generate(
            transcript
        )

    except Exception as error:

        raise HTTPException(
            status_code=503,
            detail=(
                f"Could not generate report: {error}"
            )
        )

    # --------------------------------------------------------
    # Mark session complete
    # --------------------------------------------------------

    session_manager.end_session(
        request.session_id
    )

    # --------------------------------------------------------
    # Return
    # --------------------------------------------------------

    return {
        "session_id": request.session_id,
        "topic": session["topic"],
        "turn_count": session["turn_count"],
        "report": report
    }


# ============================================================
# GET SESSION
# ============================================================

@app.get(
    "/api/session/{session_id}"
)
def get_session(
    session_id: str
):

    session = session_manager.get_session(
        session_id
    )

    if session is None:

        raise HTTPException(
            status_code=404,
            detail="Session not found."
        )

    return {
        "session_id": session["session_id"],
        "topic": session["topic"],
        "turn_count": session["turn_count"],
        "status": session["status"],
        "message_count": len(
            session["messages"]
        )
    }
