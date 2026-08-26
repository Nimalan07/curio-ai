import { useRef } from "react";
import RadarChart from "../components/RadarChart";
import ReportDownload from "../components/ReportDownload";

export default function Results({
  report,
  onNewSession,
  onBackToTeaching,
  topic
}) {
  const reportRef = useRef(null);

  if (!report) {
    return null;
  }

  // Calculate overall score if missing or not directly overall_score
  const overallScore = report.overall_score !== undefined 
    ? report.overall_score 
    : ((Number(report.clarity_score || 0) + 
        Number(report.completeness_score || 0) + 
        Number(report.accuracy_score || 0) + 
        Number(report.depth_score || 0)) / 4).toFixed(1);

  const studentConfidence = report.student_confidence !== undefined ? report.student_confidence : 8;
  const confidenceGap = Math.abs(studentConfidence - overallScore).toFixed(1);

  return (
    <div className="results-page">
      <header className="report-topbar">
        <button className="back-button" onClick={onBackToTeaching}>
          ← Back to Teaching
        </button>
        <button className="outline-button" onClick={onNewSession}>
          ↗ Start New Session
        </button>
      </header>

      <div className="report-container" ref={reportRef}>
        <div className="report-header">
          <span className="eyebrow">CURIO UNDERSTANDING REPORT</span>
          <h1>What do you really understand?</h1>
          <p style={{ color: "#64748B", marginBottom: "15px" }}>
            Topic: <strong>{topic}</strong>
          </p>
          <div className="overall-score">
            {overallScore}
            <span>/10</span>
          </div>
        </div>

        <section className="report-card">
          <h2>Your Understanding</h2>
          <RadarChart report={report} />
        </section>

        <section className="confidence-comparison">
          <h2>Confidence Gap</h2>
          <div className="confidence-grid">
            <div>
              <span>Your confidence</span>
              <strong>{studentConfidence}/10</strong>
            </div>
            <div>
              <span>Curio's assessment</span>
              <strong>{overallScore}/10</strong>
            </div>
            <div>
              <span>Gap</span>
              <strong>{confidenceGap}</strong>
            </div>
          </div>
          <p>
            Your self-rating is compared with what your explanation demonstrated.
          </p>
        </section>

        <ReportSection
          title="✓ What you explained well"
          items={report.well_explained}
          type="good"
        />

        <ReportSection
          title="⚠ Gaps found"
          items={report.gaps_found}
          type="gap"
        />

        <ReportSection
          title="! Misconceptions"
          items={report.misconception_flags}
          type="warning"
        />

        <ReportSection
          title="→ Suggested review"
          items={report.suggested_review}
          type="review"
        />
      </div>

      <div className="report-actions">
        <ReportDownload reportRef={reportRef} />
      </div>
    </div>
  );
}

function ReportSection({ title, items, type }) {
  return (
    <section className={`report-section ${type}`}>
      <h2>{title}</h2>
      {items?.length > 0 ? (
        <ul>
          {items.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      ) : (
        <p>Nothing specific was identified here.</p>
      )}
    </section>
  );
}
