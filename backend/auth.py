from fastapi import APIRouter, HTTPException, Query
from fastapi.responses import HTMLResponse, RedirectResponse
from pydantic import BaseModel
from uuid import uuid4
import hashlib

from core.database import get_db_user, create_db_user

router = APIRouter(prefix="/api/auth", tags=["Authentication"])

class AuthRequest(BaseModel):
    username: str
    password: str

def hash_password(password: str):
    return hashlib.sha256(password.encode("utf-8")).hexdigest()

@router.post("/register")
def register(data: AuthRequest):
    username = data.username.strip().lower()

    if get_db_user(username):
        raise HTTPException(
            status_code=400,
            detail="Username already exists."
        )

    if len(data.password) < 6:
        raise HTTPException(
            status_code=400,
            detail="Password must contain at least 6 characters."
        )

    password_hash = hash_password(data.password)
    success = create_db_user(username, password_hash, provider="local")
    
    if not success:
        raise HTTPException(
            status_code=500,
            detail="Could not create user account."
        )

    token = str(uuid4())
    return {
        "token": token,
        "user": {
            "username": username
        }
    }

@router.post("/login")
def login(data: AuthRequest):
    username = data.username.strip().lower()
    user = get_db_user(username)

    if not user:
        raise HTTPException(
            status_code=401,
            detail="Invalid username or password."
        )

    if user["provider"] != "local":
        raise HTTPException(
            status_code=400,
            detail="This account was registered using Google. Please continue with Google."
        )

    if user["password_hash"] != hash_password(data.password):
        raise HTTPException(
            status_code=401,
            detail="Invalid username or password."
        )

    token = str(uuid4())
    return {
        "token": token,
        "user": {
            "username": username
        }
    }

@router.get("/google", response_class=HTMLResponse)
def google_login():
    # Renders a simulated Google OAuth "Choose an account" screen
    html_content = """
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Sign in - Google Accounts</title>
      <style>
        body {
          font-family: "Google Sans", Roboto, Arial, sans-serif;
          background-color: #f0f4f9;
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          margin: 0;
        }
        .card {
          background: white;
          border-radius: 28px;
          padding: 40px;
          width: 360px;
          box-shadow: 0 4px 16px rgba(0,0,0,0.08);
          text-align: center;
          border: 1px solid #e0e2e6;
        }
        .logo {
          width: 40px;
          height: 40px;
          margin-bottom: 16px;
        }
        h1 {
          font-size: 24px;
          color: #1f1f1f;
          margin: 0 0 8px 0;
          font-weight: 400;
        }
        p.subtitle {
          font-size: 16px;
          color: #444746;
          margin: 0 0 32px 0;
        }
        .account-list {
          text-align: left;
          margin-bottom: 24px;
        }
        .account-item {
          display: flex;
          align-items: center;
          padding: 12px 16px;
          border-radius: 12px;
          cursor: pointer;
          transition: background-color 0.2s;
          border: 1px solid transparent;
          margin-bottom: 8px;
        }
        .account-item:hover {
          background-color: #f7f9fc;
        }
        .avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          color: white;
          font-size: 18px;
          font-weight: bold;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 16px;
        }
        .account-details {
          flex-grow: 1;
        }
        .account-name {
          font-size: 14px;
          color: #1f1f1f;
          font-weight: 500;
        }
        .account-email {
          font-size: 12px;
          color: #5e5e5e;
        }
        .divider {
          height: 1px;
          background-color: #e0e2e6;
          margin: 20px 0;
        }
        .custom-form {
          text-align: left;
          display: none;
        }
        .custom-form.active {
          display: block;
        }
        .input-field {
          width: 100%;
          padding: 12px 16px;
          border: 1px solid #747775;
          border-radius: 8px;
          font-size: 16px;
          box-sizing: border-box;
          margin-top: 8px;
          margin-bottom: 16px;
          outline: none;
        }
        .input-field:focus {
          border-color: #0b57d0;
          border-width: 2px;
        }
        .btn-submit {
          background: #0b57d0;
          color: white;
          border: none;
          padding: 10px 24px;
          border-radius: 100px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          float: right;
        }
        .btn-submit:hover {
          background: #0842a0;
        }
        .footer {
          display: flex;
          justify-content: space-between;
          width: 440px;
          margin-top: 20px;
          font-size: 12px;
          color: #444746;
        }
        .footer a {
          color: #444746;
          text-decoration: none;
          margin-left: 16px;
        }
      </style>
    </head>
    <body>
      <div style="display: flex; flex-direction: column; align-items: center;">
        <div class="card">
          <!-- Google Logo SVG -->
          <svg class="logo" viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22c-.87-2.6-2.86-4.53-6.16-4.53z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          <h1>Choose an account</h1>
          <p class="subtitle">to continue to Curio</p>
          
          <div class="account-list" id="list">
            <div class="account-item" onclick="select('Nimalan', 'nimalan07@gmail.com')">
              <div class="avatar" style="background-color: #159f96;">N</div>
              <div class="account-details">
                <div class="account-name">Nimalan</div>
                <div class="account-email">nimalan07@gmail.com</div>
              </div>
            </div>
            <div class="account-item" onclick="select('Guest Learner', 'guest.curio@gmail.com')">
              <div class="avatar" style="background-color: #648e59;">G</div>
              <div class="account-details">
                <div class="account-name">Guest Learner</div>
                <div class="account-email">guest.curio@gmail.com</div>
              </div>
            </div>
            <div class="account-item" onclick="showCustom()">
              <div class="avatar" style="background-color: #7a827e;">+</div>
              <div class="account-details">
                <div class="account-name" style="font-weight: normal; color: #444746;">Use another account</div>
              </div>
            </div>
          </div>
          
          <div class="custom-form" id="customForm">
            <label style="font-size: 13px; font-weight: 700; color: #4e5754; text-align: left; display: block;">Email or phone</label>
            <input type="text" class="input-field" id="customEmail" placeholder="Enter your email">
            <label style="font-size: 13px; font-weight: 700; color: #4e5754; text-align: left; display: block;">Name</label>
            <input type="text" class="input-field" id="customName" placeholder="Enter your name">
            <button class="btn-submit" onclick="submitCustom()">Next</button>
          </div>
        </div>
        
        <div class="footer">
          <span>English (United States)</span>
          <div>
            <a href="#">Help</a>
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
          </div>
        </div>
      </div>

      <script>
        function select(name, email) {
          window.location.href = '/api/auth/google/callback?email=' + encodeURIComponent(email) + '&name=' + encodeURIComponent(name);
        }
        
        function showCustom() {
          document.getElementById('list').style.display = 'none';
          document.getElementById('customForm').className = 'custom-form active';
        }
        
        function submitCustom() {
          const email = document.getElementById('customEmail').value.trim();
          let name = document.getElementById('customName').value.trim();
          if (!email) {
            alert('Please enter your email.');
            return;
          }
          if (!name) {
            name = email.split('@')[0];
          }
          select(name, email);
        }
      </script>
    </body>
    </html>
    """
    return HTMLResponse(content=html_content)

@router.get("/google/callback")
def google_callback(email: str = Query(...), name: str = Query(...)):
    username = email.split("@")[0].lower().strip()
    
    # Store Google user in SQLite DB if not exists
    user = get_db_user(username)
    if not user:
        create_db_user(username, password_hash=None, email=email, provider="google")
    
    # Generate redirect token
    token = str(uuid4())
    frontend_url = f"http://localhost:5173/?token={token}&username={username}"
    return RedirectResponse(url=frontend_url)
