import { useState, useEffect } from "react";

import Home from "./pages/Home";
import Login from "./pages/Login";
import TopicSelector from "./pages/TopicSelector";
import Teach from "./pages/Teach";
import Results from "./pages/Results";

import "./App.css";

function App() {
  const [page, setPage] = useState("home");

  const [topic, setTopic] = useState("");
  const [sessionId, setSessionId] = useState("");
  const [report, setReport] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const username = params.get("username");

    if (token && username) {
      localStorage.setItem("curio_token", token);
      localStorage.setItem("curio_user", JSON.stringify({ username }));
      window.history.replaceState({}, document.title, window.location.pathname);
      setPage("topic");
    }
  }, []);


  function startTeaching() {
    setPage("login");
  }


  function beginSession(newTopic, newSessionId) {
    setTopic(newTopic);
    setSessionId(newSessionId);
    setReport(null);

    setPage("teach");
  }


  function showReport(reportData) {
    setReport(reportData);
    setPage("results");
  }


  function startNewSession() {
    setTopic("");
    setSessionId("");
    setReport(null);

    setPage("topic");
  }


  function backHome() {
    setTopic("");
    setSessionId("");
    setReport(null);

    setPage("home");
  }


  return (
    <div className="app">

      {page === "home" && (
        <Home
          onStart={startTeaching}
        />
      )}


      {page === "login" && (
        <Login
          onNavigate={setPage}
        />
      )}


      {page === "topic" && (
        <TopicSelector
          onStartSession={beginSession}
          onBack={backHome}
        />
      )}


      {page === "teach" && (
        <Teach
          topic={topic}
          sessionId={sessionId}
          onReport={showReport}
          onBack={() => setPage("topic")}
        />
      )}


      {page === "results" && (
        <Results
          topic={topic}
          sessionId={sessionId}
          report={report}
          onNewSession={startNewSession}
          onBackToTeaching={() => setPage("teach")}
        />
      )}

    </div>
  );
}

export default App;
