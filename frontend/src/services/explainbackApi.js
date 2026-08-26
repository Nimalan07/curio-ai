const API_BASE_URL = "http://localhost:8000/api";

async function apiRequest(endpoint, options = {}) {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
      },
      ...options,
    });

    let data = {};

    try {
      data = await response.json();
    } catch {
      throw new Error("Server returned an invalid response.");
    }

    if (!response.ok) {
      throw new Error(
        data.detail ||
        data.message ||
        "Something went wrong with the server."
      );
    }

    return data;
  } catch (error) {
    if (error.name === "TypeError") {
      throw new Error(
        "Unable to connect to Curio. Make sure the FastAPI server is running."
      );
    }

    throw error;
  }
}


// Start a new teaching session
export async function startSession(topic) {
  return apiRequest("/session/start", {
    method: "POST",
    body: JSON.stringify({
      topic,
    }),
  });
}


// Send student's explanation
export async function sendMessage(sessionId, message) {
  return apiRequest("/session/message", {
    method: "POST",
    body: JSON.stringify({
      session_id: sessionId,
      message,
    }),
  });
}


// Generate final understanding report
export async function generateReport(sessionId) {
  return apiRequest("/session/report", {
    method: "POST",
    body: JSON.stringify({
      session_id: sessionId,
    }),
  });
}


// Backend health check
export async function checkHealth() {
  return apiRequest("/health");
}
