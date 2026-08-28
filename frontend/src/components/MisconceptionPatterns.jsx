export default function MisconceptionPatterns({
  patterns = []
}) {

  return (
    <section className="misconception-patterns">

      <div className="section-heading">

        <span className="section-label">
          PATTERN DETECTION
        </span>

        <h2>
          Misconceptions Curio noticed
        </h2>

        <p style={{ color: "#64748b", marginTop: "4px", marginBottom: "16px" }}>
          These patterns are based on evidence
          from your explanation.
        </p>

      </div>

      {patterns.length === 0 ? (

        <div className="no-misconceptions">
          <div className="success-icon">✓</div>

          <h3 style={{ marginTop: "12px", color: "#166534" }}>
            No supported misconceptions found.
          </h3>

          <p style={{ color: "#15803d", marginTop: "4px" }}>
            Curio didn't find a specific incorrect
            claim that it could confidently flag.
          </p>
        </div>

      ) : (

        <div className="misconception-grid">

          {patterns.map((pattern, index) => (

            <article
              className="misconception-card"
              key={index}
            >

              <div className="misconception-top">

                <span className="pattern-icon">
                  !
                </span>

                <span
                  className={`severity ${pattern.severity}`}
                >
                  {pattern.severity}
                </span>

              </div>

              <h3 style={{ marginTop: "12px", color: "#0f172a" }}>
                {pattern.label}
              </h3>

              <p className="evidence" style={{ marginTop: "8px" }}>
                <strong>What you said:</strong>{" "}
                {pattern.evidence}
              </p>

              <p style={{ marginTop: "8px", color: "#475569" }}>
                {pattern.explanation}
              </p>

              <div className="review-chip">
                Review: {pattern.review_concept}
              </div>

            </article>

          ))}

        </div>

      )}

    </section>
  );
}
