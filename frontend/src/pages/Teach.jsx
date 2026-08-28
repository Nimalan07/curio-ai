import { useState } from "react";
import ChatWindow from "../components/ChatWindow";
import ChatInput from "../components/ChatInput";
import ProgressBar from "../components/ProgressBar";
import { sendMessage, generateReport, updateDifficultyApi } from "../api/curioApi";
import AdaptiveDifficulty from "../components/AdaptiveDifficulty";

function Teach({ topic, sessionId, onFinish, onBack, initialMessages, initialTurns }) {
  const [messages, setMessages] = useState(() => {
    if (initialMessages && initialMessages.length > 0) {
      return initialMessages.map(msg => ({
        role: msg.role,
        content: msg.content,
        reason: msg.reason || ""
      }));
    }
    return [
      {
        role: "assistant",
        content: `I'm ready to learn about ${topic}! Teach me the concept in your own words.`,
        reason: ""
      },
    ];
  });

  const [loading, setLoading] = useState(false);
  const [reportLoading, setReportLoading] = useState(false);
  const [error, setError] = useState("");
  const [turns, setTurns] = useState(initialTurns || 0);
  const [difficulty, setDifficulty] = useState({
    level: 2,
    name: "Clarifying"
  });

  const MAX_TURNS = 6;

  async function handleSend(message) {
    if (!message.trim() || loading) {
      return;
    }

    setError("");

    const userMessage = {
      role: "user",
      content: message.trim(),
    };

    setMessages((previous) => [
      ...previous,
      userMessage,
    ]);

    setLoading(true);

    try {
      const data = await sendMessage(sessionId, message.trim());
      const aiReply = data.question || data.reply;

      if (!aiReply) {
        throw new Error("Curio returned an empty response.");
      }

      setMessages((previous) => [
        ...previous,
        {
          role: "assistant",
          content: aiReply,
          reason: data.reason
        },
      ]);

      setTurns(data.turn_count !== undefined ? data.turn_count : (turns + 1));
      
      if (data.difficulty) {
        setDifficulty({
          level: data.difficulty,
          name: data.difficulty_name || "Clarifying"
        });
      }
    } catch (err) {
      if (err.message.includes("Failed to fetch") || err.name === "TypeError") {
        setError("Curio is temporarily unavailable. Check that the backend is running.");
      } else if (err.message.toLowerCase().includes("ollama") || err.message.toLowerCase().includes("ai service")) {
        setError("Curio can't reach its local AI model. Make sure Ollama is running and try again.");
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleGenerateReport() {
    try {
      setError("");
      setReportLoading(true);

      const data = await generateReport(sessionId);
      const finalReport = data.report || data;
      onFinish(finalReport);
    } catch (err) {
      if (err.message.includes("Failed to fetch") || err.name === "TypeError") {
        setError("Curio is temporarily unavailable. Check that the backend is running.");
      } else {
        setError(err.message);
      }
    } finally {
      setReportLoading(false);
    }
  }

  async function handleLevelChange(newLevel) {
    if (loading) return;
    try {
      setError("");
      const data = await updateDifficultyApi(sessionId, newLevel);
      if (data.success) {
        setDifficulty({
          level: data.difficulty,
          name: data.difficulty_name || "Clarifying"
        });
      }
    } catch (err) {
      setError("Failed to change difficulty level: " + err.message);
    }
  }

  const canGenerateReport = turns >= 3;

  return (
    <div className="teach-page">
      <header className="teach-header">
        <button className="back-button" onClick={onBack}>
          ← Topics
        </button>

        <div className="teach-topic">
          <span>TEACHING</span>
          <h2>{topic}</h2>
        </div>

        <div className="turn-counter">
          {turns}/{MAX_TURNS} turns
        </div>
      </header>

      <ProgressBar current={turns} total={MAX_TURNS} />

      <AdaptiveDifficulty
        level={difficulty.level}
        name={difficulty.name}
        onLevelChange={handleLevelChange}
      />

      {error && (
        <div className="error-banner">
          <span>!</span>
          <p>{error}</p>
          <button onClick={() => setError("")}>×</button>
        </div>
      )}

      <main className="teach-container">
        <ChatWindow messages={messages} loading={loading} />

        <div className="teach-bottom">
          <ChatInput onSend={handleSend} disabled={loading} />

          <div className="report-action">
            {!canGenerateReport ? (
              <p>Explain a little more before Curio creates your report.</p>
            ) : (
              <button
                className="generate-report-button"
                onClick={handleGenerateReport}
                disabled={reportLoading}
              >
                {reportLoading ? (
                  <>
                    <span className="button-spinner" />
                    Analyzing...
                  </>
                ) : (
                  <>Generate Understanding Report →</>
                )}
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default Teach;
