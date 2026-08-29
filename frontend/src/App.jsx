import { useState, useEffect } from "react";
import Home from "./pages/Home";
import Login from "./pages/Login";
import TopicSelector from "./pages/TopicSelector";
import Teach from "./pages/Teach";
import Results from "./pages/Results";
import Dashboard from "./pages/Dashboard";
import { getCompletedReport, getSession, logoutApi } from "./api/curioApi";

function App() {
  const [page, setPage] = useState("home");
  const [topic, setTopic] = useState(() => localStorage.getItem("curio_topic") || "");
  const [sessionId, setSessionId] = useState(() => localStorage.getItem("curio_session_id") || "");
  const [report, setReport] = useState(() => {
    const stored = localStorage.getItem("curio_report");
    return stored ? JSON.parse(stored) : null;
  });
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("curio_user");
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [initialMessages, setInitialMessages] = useState(() => {
    const stored = localStorage.getItem("curio_initial_messages");
    return stored ? JSON.parse(stored) : [];
  });
  const [initialTurns, setInitialTurns] = useState(() => {
    const stored = localStorage.getItem("curio_initial_turns");
    return stored ? Number(stored) : 0;
  });

  // Sync states to localStorage
  useEffect(() => {
    localStorage.setItem("curio_topic", topic);
  }, [topic]);

  useEffect(() => {
    localStorage.setItem("curio_session_id", sessionId);
  }, [sessionId]);

  useEffect(() => {
    if (report) {
      localStorage.setItem("curio_report", JSON.stringify(report));
    } else {
      localStorage.removeItem("curio_report");
    }
  }, [report]);

  useEffect(() => {
    localStorage.setItem("curio_initial_messages", JSON.stringify(initialMessages));
  }, [initialMessages]);

  useEffect(() => {
    localStorage.setItem("curio_initial_turns", String(initialTurns));
  }, [initialTurns]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const username = params.get("username");

    if (token && username) {
      localStorage.setItem("curio_token", token);
      const userData = { username };
      localStorage.setItem("curio_user", JSON.stringify(userData));
      setUser(userData);
      window.history.replaceState({}, document.title, window.location.pathname);
      setPage("home");
    } else {
      // Check if user is already logged in
      const storedToken = localStorage.getItem("curio_token");
      const storedUser = localStorage.getItem("curio_user");
      if (storedToken && storedUser) {
        setUser(JSON.parse(storedUser));
      }
      setPage("home");
    }
  }, []);

  function startTeaching() {
    const token = localStorage.getItem("curio_token");
    if (token) {
      setPage("topic");
    } else {
      setPage("login");
    }
  }

  function handleLoginSuccess(loggedInUser, token) {
    localStorage.setItem("curio_token", token);
    localStorage.setItem("curio_user", JSON.stringify(loggedInUser));
    setUser(loggedInUser);
    setPage("topic");
  }

  async function handleLogout() {
    await logoutApi();
    setUser(null);
    setPage("home");
    localStorage.removeItem("curio_page");
    localStorage.removeItem("curio_topic");
    localStorage.removeItem("curio_session_id");
    localStorage.removeItem("curio_report");
    localStorage.removeItem("curio_initial_messages");
    localStorage.removeItem("curio_initial_turns");
  }

  function handleStartSession(selectedTopic, id, conf) {
    setTopic(selectedTopic);
    setSessionId(id);
    setInitialMessages([]);
    setInitialTurns(0);
    setPage("teach");
  }

  function handleFinishSession(finalReport) {
    setReport(finalReport);
    setPage("results");
  }

  async function handleViewReport(topicName, sessId) {
    try {
      const data = await getCompletedReport(sessId);
      if (data.success) {
        setTopic(topicName);
        setSessionId(sessId);
        setReport(data.report);
        setPage("results");
      }
    } catch (err) {
      alert("Failed to load report: " + err.message);
    }
  }

  async function handleResumeSession(topicName, sessId, confidence) {
    try {
      const data = await getSession(sessId);
      if (data.success) {
        setTopic(topicName);
        setSessionId(sessId);
        setInitialMessages(data.messages || []);
        setInitialTurns(data.turn_count || 0);
        setPage("teach");
      }
    } catch (err) {
      alert("Failed to resume session: " + err.message);
    }
  }

  function startNewSession() {
    setReport(null);
    setTopic("");
    setSessionId("");
    setInitialMessages([]);
    setInitialTurns(0);
    setPage("topic");
  }

  return (
    <>
      {page === "home" && (
        <Home 
          onStart={startTeaching} 
          user={user} 
          onLogout={handleLogout} 
          onDashboard={() => setPage("dashboard")}
        />
      )}
      {page === "login" && (
        <Login
          onSuccess={handleLoginSuccess}
          onBack={() => setPage("home")}
        />
      )}
      {page === "topic" && (
        <TopicSelector
          onStartSession={handleStartSession}
          onBack={() => setPage("home")}
          user={user}
          onLogout={handleLogout}
          onViewReport={handleViewReport}
          onResumeSession={handleResumeSession}
          onDashboard={() => setPage("dashboard")}
        />
      )}
      {page === "teach" && (
        <Teach
          topic={topic}
          sessionId={sessionId}
          onFinish={handleFinishSession}
          onBack={() => setPage("topic")}
          initialMessages={initialMessages}
          initialTurns={initialTurns}
        />
      )}
      {page === "results" && (
        <Results
          topic={topic}
          sessionId={sessionId}
          report={report}
          onNewSession={startNewSession}
          onBackToTeaching={() => setPage("topic")}
        />
      )}
      {page === "dashboard" && (
        <Dashboard
          user={user}
          onLogout={handleLogout}
          onHome={() => setPage(user ? "topic" : "home")}
        />
      )}
    </>
  );
}

export default App;
