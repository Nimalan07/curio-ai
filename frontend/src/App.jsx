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
  const [topic, setTopic] = useState("");
  const [sessionId, setSessionId] = useState("");
  const [report, setReport] = useState(null);
  const [user, setUser] = useState(null);
  const [initialMessages, setInitialMessages] = useState([]);
  const [initialTurns, setInitialTurns] = useState(0);

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
      setPage("topic");
    } else {
      // Check if user is already logged in
      const storedToken = localStorage.getItem("curio_token");
      const storedUser = localStorage.getItem("curio_user");
      if (storedToken && storedUser) {
        setUser(JSON.parse(storedUser));
        setPage("topic");
      }
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
