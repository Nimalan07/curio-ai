from fastapi.testclient import TestClient

from main import app


client = TestClient(app)


def test_health():

    response = client.get(
        "/api/health"
    )

    assert response.status_code == 200

    data = response.json()

    assert data["status"] == "ok"


def test_start_session():

    response = client.post(
        "/api/session/start",
        json={
            "topic": "Photosynthesis"
        }
    )

    assert response.status_code == 200

    data = response.json()

    assert "session_id" in data
    assert data["topic"] == "Photosynthesis"
    assert data["status"] == "active"


def test_empty_topic():

    response = client.post(
        "/api/session/start",
        json={
            "topic": ""
        }
    )

    assert response.status_code == 422
