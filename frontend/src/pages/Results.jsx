import { useState } from "react";
import ScoreCard from "../components/ScoreCard";
import RadarChart from "../components/RadarChart";
import ReportSection from "../components/ReportSection";
import Loading from "../components/Loading";
import { generateReport } from "../services/explainbackApi";

function Results({
  sessionId,
  topic,
  report: initialReport,
  onNewSession,
  onBackToTeaching,
}) {
  const [report, setReport] = useState(initialReport);
  const [loading, setLoading] = useState(!initialReport);
  const [error, setError] = useState("");

  async function loadReport() {
    try {
      setLoading(true);
      setError("");

      const data = await generateReport(sessionId);

      setReport(data.report || data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="report-page loading-page">
        <Loading message="Curio is creating your Understanding Report..." />

        {!initialReport && (
          <button
            className="secondary-button"
            onClick={() => window.history.back()}
          >
            Go Back
          </button>
        )}
      </div>
    );
  }

  if (error) {
    return (
      <div className="report-page">
        <div className="error-card">
          <div className="error-icon">!</div>

          <h2>Curio couldn't create the report</h2>

          <p>{error}</p>

          <div className="error-actions">
            <button
              className="primary-button"
              onClick={loadReport}
            >
              Try Again
            </button>

            <button
              className="secondary-button"
              onClick={onBackToTeaching}
            >
              Back to Teaching
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!report) {
    return null;
  }

  return (
    <div className="report-page">

      {/* TOP BAR */}
      <header className="report-topbar">

        <button
          className="back-button"
          onClick={onBackToTeaching}
        >
          ← Back to Teaching
        </button>

        <button
          className="outline-button"
          onClick={onNewSession}
        >
          ↗ Start New Session
        </button>

      </header>


      {/* MAIN CONTENT */}
      <main className="report-container">

        {/* HEADER */}
        <div className="report-header">

          <div>
            <span className="section-label">
              CURIO SESSION
            </span>

            <h1>Understanding Report</h1>

            <p className="report-meta">
              Topic: <strong>{topic}</strong>
              <span>•</span>
              Session: <strong>{sessionId}</strong>
            </p>
          </div>

          <div className="report-badge">
            ✦
            <span>Learning through explaining</span>
          </div>

        </div>


        {/* SCORE CARDS */}
        <section className="score-grid">

          <ScoreCard
            title="Clarity"
            score={report.clarity_score}
            icon="✦"
            description="How clearly you communicated the concept."
            variant="orange"
          />

          <ScoreCard
            title="Completeness"
            score={report.completeness_score}
            icon="◆"
            description="How much of the important concept you covered."
            variant="orange-light"
          />

          <ScoreCard
            title="Accuracy"
            score={report.accuracy_score}
            icon="◎"
            description="How factually correct your explanation was."
            variant="navy"
          />

          <ScoreCard
            title="Depth"
            score={report.depth_score}
            icon="↗"
            description="How deeply you explained the underlying ideas."
            variant="navy-light"
          />

        </section>


        {/* RADAR + CONVERSATION */}
        <section className="report-main-grid">

          <RadarChart report={report} />

          <div className="conversation-card">

            <div className="section-heading">
              <div>
                <span className="section-label">
                  SESSION INSIGHT
                </span>

                <h2>Your Explanation Journey</h2>
              </div>
            </div>

            <div className="journey">

              <div className="journey-step">
                <div className="journey-number">01</div>

                <div>
                  <h4>You explained</h4>
                  <p>
                    You taught {topic} using your own
                    understanding.
                  </p>
                </div>
              </div>


              <div className="journey-line" />


              <div className="journey-step">
                <div className="journey-number">02</div>

                <div>
                  <h4>Curio questioned</h4>
                  <p>
                    Curio asked follow-up questions
                    whenever your explanation needed
                    more detail.
                  </p>
                </div>
              </div>


              <div className="journey-line" />


              <div className="journey-step">
                <div className="journey-number">03</div>

                <div>
                  <h4>You discovered</h4>
                  <p>
                    Your explanation revealed both
                    strengths and knowledge gaps.
                  </p>
                </div>
              </div>

            </div>

          </div>

        </section>


        {/* REPORT SECTIONS */}
        <section className="report-sections-grid">

          <ReportSection
            title="What You Explained Well"
            items={report.well_explained}
            type="success"
            icon="✓"
          />

          <ReportSection
            title="Gaps Found"
            items={report.gaps_found}
            type="warning"
            icon="!"
          />

          <ReportSection
            title="Possible Misconceptions"
            items={report.misconception_flags}
            type="navy-section"
            icon="?"
          />

          <ReportSection
            title="Suggested Review"
            items={report.suggested_review}
            type="orange"
            icon="▱"
          />

        </section>


        {/* FINAL MESSAGE */}
        <section className="report-footer-message">

          <div className="footer-star">
            ✦
          </div>

          <div>
            <h3>
              Every explanation teaches you something.
            </h3>

            <p>
              The gaps Curio found aren't failures —
              they're exactly what you should review next.
            </p>
          </div>

        </section>

      </main>
    </div>
  );
}

export default Results;
