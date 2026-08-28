import { useState } from "react";
import { generateTeachBack } from "../api/curioApi";

export default function TeachBack({ sessionId }) {

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleGenerate() {

    setLoading(true);
    setError("");

    try {

      const result = await generateTeachBack(sessionId);
      setData(result.teach_back);

    } catch (err) {

      setError(err.message);

    } finally {

      setLoading(false);

    }
  }

  return (
    <section className="teach-back">

      <div className="teach-back-heading">

        <span className="section-label">
          TEACH IT BACK
        </span>

        <h2>
          See what a strong explanation looks like.
        </h2>

        <p style={{ color: "#64748b", marginTop: "4px", marginBottom: "16px" }}>
          Curio compares what you explained with
          a concept-complete explanation.
        </p>

      </div>

      {!data && (

        <button
          className="primary-button"
          onClick={handleGenerate}
          disabled={loading}
        >
          {loading
            ? "Building comparison..."
            : "Compare My Explanation →"}
        </button>

      )}

      {error && (
        <div className="error-banner" style={{ marginTop: "12px" }}>
          {error}
        </div>
      )}

      {data && (

        <div className="teach-back-grid">

          <div className="teach-back-card student-card">

            <span>YOUR EXPLANATION</span>

            <p style={{ marginTop: "10px" }}>
              {data.student_summary}
            </p>

            <h4>✓ You covered well</h4>

            <ul>
              {data.covered_well?.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>

          </div>

          <div className="teach-back-card ideal-card">

            <span>STRONG EXPLANATION</span>

            <p style={{ marginTop: "10px" }}>
              {data.ideal_explanation}
            </p>

            <h4>What was missing</h4>

            <ul>
              {data.missing_from_explanation?.map(
                (item, index) => (
                  <li key={index}>{item}</li>
                )
              )}
            </ul>

          </div>

        </div>

      )}

    </section>
  );
}
