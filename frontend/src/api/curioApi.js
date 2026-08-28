const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:8000";

function getAuthHeaders() {
  const token = localStorage.getItem("curio_token");
  return {
    "Content-Type": "application/json",
    ...(token ? { "Authorization": `Bearer ${token}` } : {})
  };
}

export async function startSession(
  topic,
  confidence
) {
  const response = await fetch(
    `${API_URL}/api/session/start`,
    {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({
        topic,
        confidence
      })
    }
  );

  if (!response.ok) {
    throw new Error(
      "Unable to start Curio session."
    );
  }

  return response.json();
}

export async function sendMessage(
  sessionId,
  message
) {
  const response = await fetch(
    `${API_URL}/api/session/message`,
    {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({
        session_id: sessionId,
        message
      })
    }
  );

  if (!response.ok) {
    throw new Error(
      "Unable to contact Curio."
    );
  }

  return response.json();
}

export async function generateReport(
  sessionId
) {
  const response = await fetch(
    `${API_URL}/api/session/report`,
    {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({
        session_id: sessionId
      })
    }
  );

  if (!response.ok) {
    throw new Error(
      "Unable to generate report."
    );
  }

  return response.json();
}

export async function getSessions() {
  const response = await fetch(
    `${API_URL}/api/sessions`,
    {
      method: "GET",
      headers: getAuthHeaders()
    }
  );

  if (!response.ok) {
    throw new Error(
      "Unable to fetch session history."
    );
  }

  return response.json();
}

export async function getCompletedReport(sessionId) {
  const response = await fetch(
    `${API_URL}/api/session/report/${sessionId}`,
    {
      method: "GET",
      headers: getAuthHeaders()
    }
  );

  if (!response.ok) {
    throw new Error(
      "Unable to fetch completed report."
    );
  }

  return response.json();
}

export async function getCurrentUser() {
  const response = await fetch(
    `${API_URL}/api/auth/me`,
    {
      method: "GET",
      headers: getAuthHeaders()
    }
  );

  if (!response.ok) {
    throw new Error(
      "Unable to fetch current user profile."
    );
  }

  return response.json();
}

export async function logoutApi() {
  try {
    await fetch(
      `${API_URL}/api/auth/logout`,
      {
        method: "POST",
        headers: getAuthHeaders()
      }
    );
  } catch (err) {
    console.error("Logout request failed:", err);
  }
  localStorage.removeItem("curio_token");
  localStorage.removeItem("curio_user");
}

export async function getSession(sessionId) {
  const response = await fetch(
    `${API_URL}/api/session/${sessionId}`,
    {
      method: "GET",
      headers: getAuthHeaders()
    }
  );

  if (!response.ok) {
    throw new Error(
      "Unable to fetch session details."
    );
  }

  return response.json();
}

export async function generateTeachBack(sessionId) {
  const response = await fetch(
    `${API_URL}/api/session/teach-back`,
    {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({
        session_id: sessionId
      })
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(
      error.detail || "Failed to generate teach-back."
    );
  }

  return response.json();
}

export async function getProgress() {
  const response = await fetch(
    `${API_URL}/api/user/progress`,
    {
      method: "GET",
      headers: getAuthHeaders()
    }
  );

  if (!response.ok) {
    throw new Error(
      "Unable to load learning progress."
    );
  }

  return response.json();
}

export async function updateDifficultyApi(sessionId, difficultyLevel) {
  const response = await fetch(
    `${API_URL}/api/session/difficulty`,
    {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({
        session_id: sessionId,
        difficulty_level: difficultyLevel
      })
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(
      error.detail || "Failed to update difficulty."
    );
  }

  return response.json();
}
