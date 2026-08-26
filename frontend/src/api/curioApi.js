const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:8000";


export async function startSession(
  topic,
  confidence
) {

  const response = await fetch(
    `${API_URL}/api/session/start`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json"
      },

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

      headers: {
        "Content-Type": "application/json"
      },

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

      headers: {
        "Content-Type": "application/json"
      },

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
