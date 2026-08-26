import { useState } from "react";
import Navbar from "../components/Navbar";
import ConfidenceSlider from "../components/ConfidenceSlider";
import { startSession } from "../api/curioApi";

const popularTopics = [
  "Photosynthesis",
  "Newton's Laws",
  "Machine Learning",
  "Data Structures",
  "World War II",
  "Cell Biology",
];

function TopicSelector({ onStartSession, onBack }) {
  const [topic, setTopic] = useState("");
  const [confidence, setConfidence] = useState(8);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
      <Navbar onHome={onBack} showBack />

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
      </main>
    </div>
  );
}

export default TopicSelector;
