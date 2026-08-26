import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import ConfidenceSlider from "../components/ConfidenceSlider";
import { startSession, getSessions } from "../api/curioApi";

const popularTopics = [
  "Photosynthesis",
  "Newton's Laws",
  "Machine Learning",
  "Data Structures",
  "World War II",
  "Cell Biology",
];

function TopicSelector({
  onStartSession,
  onBack,
  user,
  onLogout,
  onViewReport,
  onResumeSession
}) {
  const [topic, setTopic] = useState("");
  const [confidence, setConfidence] = useState(8);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sessions, setSessions] = useState([]);
  const [sessionsLoading, setSessionsLoading] = useState(true);

  useEffect(() => {
    async function loadHistory() {
      try {
        setSessionsLoading(true);
        const data = await getSessions();
        if (data.success) {
          setSessions(data.sessions || []);
        }
      } catch (err) {
        console.error("Failed to load sessions:", err);
      } finally {
        setSessionsLoading(false);
      }
    }
    loadHistory();
  }, []);

  async function handleStart() {
    const cleanedTopic = topic.trim();
    if (!cleanedTopic) {
      setError("Tell Curio what you want to teach.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const data = await startSession(cleanedTopic, confidence);

      onStartSession(data.topic, data.session_id, data.confidence);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function selectTopic(selectedTopic) {
    setTopic(selectedTopic);
    setError("");
  }

  return (
    <div className="page topic-page">
      <Navbar onHome={onBack} showBack user={user} onLogout={onLogout} />

      <main className="topic-container">
        <div className="section-label">STEP 01</div>

        <h1>What will you teach Curio?</h1>

        <p>Pick anything you are studying. No notes or PDFs needed.</p>

        <div className="topic-input-wrapper">
          <input
            type="text"
            value={topic}
            onChange={(event) => {
              setTopic(event.target.value);
              setError("");
            }}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                handleStart();
              }
            }}
            placeholder="e.g. Photosynthesis"
            maxLength={200}
          />

          <button
            className="primary-button"
            onClick={handleStart}
            disabled={loading}
          >
            {loading ? "Starting..." : "Start Teaching →"}
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}

        <ConfidenceSlider value={confidence} setValue={setConfidence} />

        <div className="popular-section">
          <span>Or choose a topic</span>

          <div className="topic-chips">
            {popularTopics.map((item) => (
              <button
                key={item}
                className="topic-chip"
                onClick={() => selectTopic(item)}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        {/* LEARNING HISTORY */}
        <section className="history-section">
          <h2>Your Teaching History</h2>
          <p className="history-subtitle">Track concepts you've explained and review your completed assessment reports.</p>
          
          {sessionsLoading ? (
            <div style={{ textAlign: 'center', color: '#64748b', padding: '20px' }}>Loading history...</div>
          ) : sessions.length === 0 ? (
            <div className="history-empty-state">
              <div className="history-empty-icon">✦</div>
              <p>No past sessions found. Start teaching your first concept above!</p>
            </div>
          ) : (
            <div className="history-table-wrapper">
              <table className="history-table">
                <thead>
                  <tr>
                    <th>Topic</th>
                    <th>Created</th>
                    <th>Confidence</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {sessions.map((sess) => (
                    <tr key={sess.session_id}>
                      <td>
                        <span className="history-topic-name">{sess.topic}</span>
                      </td>
                      <td>
                        {new Date(sess.created_at).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </td>
                      <td>{sess.confidence}/10</td>
                      <td>
                        <span className={`status-badge ${sess.status || 'active'}`}>
                          <span className="status-dot-pulse"></span>
                          {sess.status === 'completed' ? 'Completed' : 'Active'}
                        </span>
                      </td>
                      <td>
                        {sess.status === 'completed' ? (
                          <button 
                            className="history-view-btn"
                            onClick={() => onViewReport(sess.topic, sess.session_id)}
                          >
                            View Report
                          </button>
                        ) : (
                          <button 
                            className="history-resume-btn"
                            onClick={() => onResumeSession(sess.topic, sess.session_id, sess.confidence)}
                          >
                            Resume
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default TopicSelector;
