from fastapi import APIRouter, HTTPException
from fastapi.responses import RedirectResponse
from pydantic import BaseModel
from uuid import uuid4
import hashlib

router = APIRouter(prefix="/api/auth", tags=["Authentication"])

# Simple in-memory user database
users = {}

class AuthRequest(BaseModel):
    username: str
    password: str

def hash_password(password: str):
    return hashlib.sha256(password.encode("utf-8")).hexdigest()

@router.post("/register")
def register(data: AuthRequest):
    username = data.username.strip().lower()

    if username in users:
        raise HTTPException(
            status_code=400,
            detail="Username already exists."
        )

    if len(data.password) < 6:
        raise HTTPException(
            status_code=400,
            detail="Password must contain at least 6 characters."
        )

    token = str(uuid4())
    users[username] = {
        "username": username,
        "password": hash_password(data.password),
        "token": token
    }

    return {
        "token": token,
        "user": {
            "username": username
        }
    }

@router.post("/login")
def login(data: AuthRequest):
    username = data.username.strip().lower()
    user = users.get(username)

    if not user:
        raise HTTPException(
            status_code=401,
            detail="Invalid username or password."
        )

    if user["password"] != hash_password(data.password):
        raise HTTPException(
            status_code=401,
            detail="Invalid username or password."
        )

    token = str(uuid4())
    user["token"] = token

    return {
        "token": token,
        "user": {
            "username": username
        }
    }

@router.get("/google")
def google_login():
    # In a full production app, this initiates Google OAuth flow.
    # For a demo/hackathon setting, we route back to the frontend with mock credentials
    # so the Google Continue flow works end-to-end.
    frontend_url = "http://localhost:5173/?token=google-mock-token&username=google_user"
    return RedirectResponse(url=frontend_url)
