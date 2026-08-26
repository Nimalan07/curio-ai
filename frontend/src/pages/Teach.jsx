import { useState } from "react";
import ChatWindow from "../components/ChatWindow";
import ChatInput from "../components/ChatInput";
import ProgressBar from "../components/ProgressBar";

import {
  sendMessage,
  generateReport,
} from "../services/explainbackApi";

function Teach({
  topic,
  sessionId,
  onReport,
  onBack,
}) {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: `I'm ready to learn about ${topic}! Teach me the concept in your own words.`,
    },
  ]);

  const [loading, setLoading] = useState(false);
  const [reportLoading, setReportLoading] = useState(false);
  const [error, setError] = useState("");

  const [turns, setTurns] = useState(0);

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
      const data = await sendMessage(
        sessionId,
        message.trim()
      );

      const aiReply =
        data.reply ||
        data.message ||
        data.response;

      if (!aiReply) {
        throw new Error(
          "Curio returned an empty response."
        );
      }

      setMessages((previous) => [
        ...previous,
        {
          role: "assistant",
          content: aiReply,
        },
      ]);

      setTurns((previous) => previous + 1);

    } catch (err) {
      setError(err.message);

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

      onReport(finalReport);

    } catch (err) {
      setError(err.message);

    } finally {
      setReportLoading(false);
    }
  }


  const canGenerateReport = turns >= 3;


  return (
    <div className="teach-page">

      <header className="teach-header">

        <button
          className="back-button"
          onClick={onBack}
        >
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


      <ProgressBar
        current={turns}
        total={MAX_TURNS}
      />


      {error && (
        <div className="error-banner">
          <span>!</span>

          <p>{error}</p>

          <button
            onClick={() => setError("")}
          >
            ×
          </button>
        </div>
      )}


      <main className="teach-container">

        <ChatWindow
          messages={messages}
          loading={loading}
        />


        <div className="teach-bottom">

          <ChatInput
            onSend={handleSend}
            disabled={loading}
          />


          <div className="report-action">

            {!canGenerateReport ? (
              <p>
                Explain a little more before Curio
                creates your report.
              </p>
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
                  <>
                    Generate Understanding Report →
                  </>
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
