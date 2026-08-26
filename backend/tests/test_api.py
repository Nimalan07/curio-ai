from fastapi.testclient import TestClient
import uuid

from main import app

client = TestClient(app)

def get_auth_token():
    username = f"testuser_{uuid.uuid4().hex[:8]}"
    password = "testpassword123"
    response = client.post(
        "/api/auth/register",
        json={"username": username, "password": password}
    )
    if response.status_code == 200:
        return response.json()["token"]
    
    # If user exists or failed, log in
    response = client.post(
        "/api/auth/login",
        json={"username": username, "password": password}
    )
    return response.json()["token"]

def test_health():
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"

def test_start_session():
    token = get_auth_token()
    response = client.post(
        "/api/session/start",
        json={
            "topic": "Photosynthesis",
            "confidence": 5
        },
        headers={"Authorization": f"Bearer {token}"}
    )

    assert response.status_code == 200
    data = response.json()
    assert "session_id" in data
    assert data["topic"] == "Photosynthesis"
    assert data["success"] is True

def test_empty_topic():
    token = get_auth_token()
    response = client.post(
        "/api/session/start",
        json={
            "topic": "",
            "confidence": 5
        },
        headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 422
