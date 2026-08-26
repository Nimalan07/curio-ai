import { useRef } from "react";
import Navbar from "../components/Navbar";

function Home({ onStart }) {
  const howItWorksRef = useRef(null);
  const featuresRef = useRef(null);
  const scienceRef = useRef(null);
  const reportRef = useRef(null);

  const scrollTo = (ref) => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="home-page-scrolling">
      {/* NAVBAR */}
      <Navbar
        onHome={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        onLogin={onStart}
        onScrollToHowItWorks={() => scrollTo(howItWorksRef)}
        onScrollToFeatures={() => scrollTo(featuresRef)}
        onScrollToScience={() => scrollTo(scienceRef)}
        onScrollToReport={() => scrollTo(reportRef)}
      />

      {/* HERO SECTION */}
      <section className="hero-section">
        <div className="hero-grid">
          {/* LEFT COLUMN: PITCH & CALL-TO-ACTION */}
          <div className="hero-content">
            <div className="hero-badge">
              <span className="badge-dot"></span>
              AI-powered active learning
            </div>

            <h1 className="hero-title">
              Don't just study it.
              <br />
              <span className="hero-highlight-blue">Explain </span>
              <span className="hero-highlight-green">it.</span>
            </h1>

            <p className="hero-subtitle">
              Curio learns by being taught. Explain any concept in your own words,
              and Curio will ask the questions that reveal what you really
              understand.
            </p>

            <div className="hero-actions">
              <button className="primary-button hero-cta" onClick={onStart}>
                Start Teaching →
              </button>
              <button
                className="secondary-button"
                onClick={() => scrollTo(howItWorksRef)}
              >
                <svg
                  className="play-icon"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M8 5V19L19 12L8 5Z" fill="currentColor" />
                </svg>
                See how it works
              </button>
            </div>


          </div>

          {/* RIGHT COLUMN: INTERACTIVE MOCKUP */}
          <div className="hero-visual">
            <div className="mockup-chat-container">
              {/* HEADER */}
              <div className="mockup-header">
                <div className="mockup-brand">
                  <div className="mockup-logo-icon">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M12 2C12 7.5 7.5 12 2 12C7.5 12 12 16.5 12 22C12 16.5 16.5 12 22 12C16.5 12 12 7.5 12 2Z"
                        fill="currentColor"
                      />
                    </svg>
                  </div>
                  <span>Curio</span>
                </div>
                <div className="mockup-status">
                  <span className="status-dot"></span>
                  Session in progress
                </div>
              </div>

              {/* BODY */}
              <div className="mockup-body">
                <div className="mockup-topic">
                  <small>TEACHING SESSION</small>
                  <h3>Photosynthesis</h3>
                </div>
                <div className="mockup-progress-row">
                  <div className="mockup-progress-bar">
                    <div className="fill" style={{ width: "66%" }}></div>
                  </div>
                  <span>4 / 6 turns</span>
                </div>

                {/* MESSAGES */}
                <div className="mockup-messages">
                  <div className="mock-message user">
                    <div className="mock-avatar">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: "12px", height: "12px" }}>
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                      </svg>
                    </div>
                    <div className="mock-bubble">
                      Photosynthesis is the process by which plants use sunlight,
                      carbon dioxide and water to make their own food.
                    </div>
                  </div>

                  <div className="mock-message curio">
                    <div className="mock-avatar curio-av">✦</div>
                    <div className="mock-bubble">
                      Great start! But what happens to the sunlight after the plant
                      captures it?
                      <details className="mock-why">
                        <summary>Why I asked this</summary>
                        <p>
                          The explanation mentions sunlight but does not explain
                          how the captured energy is used.
                        </p>
                      </details>
                    </div>
                  </div>

                  <div className="mock-message user">
                    <div className="mock-avatar">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: "12px", height: "12px" }}>
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                      </svg>
                    </div>
                    <div className="mock-bubble">
                      The sunlight gives energy to the plant so it can produce
                      glucose.
                    </div>
                  </div>
                </div>

                {/* INPUT */}
                <div className="mockup-input">
                  <span className="input-placeholder">Type your explanation here...</span>
                  <div className="input-controls">
                    <div className="left-icons">
                      <span className="icon-mic">🎙</span>
                      <span className="icon-clip">📎</span>
                    </div>
                    <button className="send-btn">
                      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M2.01 21L23 12L2.01 3L2 10L17 12L2 14L2.01 21Z"
                          fill="currentColor"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* OVERLAPPING METRICS CARD */}
            <div className="mockup-metrics-card">
              <h4>Understanding Preview</h4>
              <div className="overall-score-preview">
                <strong>6.8</strong>
                <span>/ 10</span>
              </div>
              <p className="overall-label">Overall Understanding</p>

              {/* STATIC MINI RADAR CHART SVG */}
              <div className="mockup-radar-svg">
                <svg viewBox="0 0 170 130" width="100%" height="100%">
                  {/* Grid Circles */}
                  <circle cx="85" cy="65" r="40" fill="none" stroke="#E2E8F0" strokeWidth="1" />
                  <circle cx="85" cy="65" r="25" fill="none" stroke="#E2E8F0" strokeWidth="1" />
                  <circle cx="85" cy="65" r="10" fill="none" stroke="#E2E8F0" strokeWidth="1" />
                  {/* Axis lines */}
                  <line x1="85" y1="25" x2="85" y2="105" stroke="#E2E8F0" strokeWidth="1" />
                  <line x1="45" y1="65" x2="125" y2="65" stroke="#E2E8F0" strokeWidth="1" />
                  {/* Labels */}
                  <text x="85" y="18" textAnchor="middle" fontSize="7" fontWeight="700" fill="#64748B">Clarity</text>
                  <text x="130" y="67" textAnchor="start" fontSize="7" fontWeight="700" fill="#64748B">Completeness</text>
                  <text x="85" y="118" textAnchor="middle" fontSize="7" fontWeight="700" fill="#64748B">Accuracy</text>
                  <text x="40" y="67" textAnchor="end" fontSize="7" fontWeight="700" fill="#64748B">Depth</text>
                  {/* Blue Polygon */}
                  <polygon
                    points="85,37 109,65 85,97 61,65"
                    fill="rgba(59, 130, 246, 0.15)"
                    stroke="#3B82F6"
                    strokeWidth="1.5"
                  />
                  {/* Score Text labels */}
                  <text x="85" y="32" textAnchor="middle" fontSize="6.5" fill="#0F172A" fontWeight="bold">7.0</text>
                  <text x="114" y="61" textAnchor="middle" fontSize="6.5" fill="#0F172A" fontWeight="bold">6.0</text>
                  <text x="85" y="93" textAnchor="middle" fontSize="6.5" fill="#0F172A" fontWeight="bold">8.0</text>
                  <text x="56" y="61" textAnchor="middle" fontSize="6.5" fill="#0F172A" fontWeight="bold">6.0</text>
                </svg>
              </div>
            </div>

            {/* MASCOT */}
            <div className="mockup-mascot-wrapper">
              <img src="/mascot.png" alt="Curio mascot" className="mascot-img" />
            </div>
          </div>
        </div>
      </section>

      {/* STATS SECTION */}
      <section className="stats-bar-section">
        <div className="stats-bar-container">
          <div className="stat-card">
            <strong>01</strong>
            <span>You explain</span>
          </div>
          <div className="stat-card-divider"></div>
          <div className="stat-card">
            <strong>02</strong>
            <span>Curio asks</span>
          </div>
          <div className="stat-card-divider"></div>
          <div className="stat-card">
            <strong>03</strong>
            <span>You discover</span>
          </div>
          <div className="stat-card-divider"></div>
          <div className="stat-card">
            <strong>04</strong>
            <span>You improve</span>
          </div>
        </div>
      </section>

      {/* THE CURIO METHOD SECTION */}
      <section className="curio-method-section">
        <div className="scroll-container">
          <div className="method-grid">
            <div className="method-text">
              <span className="section-label">The Curio Method</span>
              <h2>
                A learning experience built around{" "}
                <span className="hero-highlight-green">your thinking.</span>
              </h2>
              <p>
                Most learning tools give you answers. Curio gives you something
                more useful: questions that expose the parts you haven't
                understood yet.
              </p>
              <div className="checks-list">
                <div className="check-item">
                  <span className="check-bullet">✓</span>
                  Explain without uploading notes
                </div>
                <div className="check-item">
                  <span className="check-bullet">✓</span>
                  Get intelligent follow-up questions
                </div>
                <div className="check-item">
                  <span className="check-bullet">✓</span>
                  Find gaps you didn't know existed
                </div>
                <div className="check-item">
                  <span className="check-bullet">✓</span>
                  Receive an actionable understanding report
                </div>
              </div>
            </div>

            {/* METHOD DASHBOARD VISUAL */}
            <div className="method-dashboard-visual">
              <div className="method-dashboard-card">
                <div className="dash-top">
                  <div className="dash-brand">
                    <div className="dash-logo">✦</div>
                    <span>Curio</span>
                  </div>
                  <div className="dash-badge">Active session</div>
                </div>

                <div className="dash-body">
                  <div className="dash-topic">
                    <small>YOUR TOPIC</small>
                    <h3>Newton's Laws of Motion</h3>
                  </div>

                  <div className="dash-progress-row">
                    <div className="progress-info">
                      <span>Understanding progress</span>
                      <strong>68%</strong>
                    </div>
                    <div className="big-progress-bar">
                      <div className="fill" style={{ width: "68%" }}></div>
                    </div>
                  </div>

                  <div className="dash-metrics-row">
                    <div className="metric-badge b-blue">
                      <span className="badge-icon">💬</span>
                      <div>
                        <strong>5</strong>
                        <small>Questions asked</small>
                      </div>
                    </div>
                    <div className="metric-badge b-green">
                      <span className="badge-icon">◈</span>
                      <div>
                        <strong>3</strong>
                        <small>Gaps discovered</small>
                      </div>
                    </div>
                    <div className="metric-badge b-purple">
                      <span className="badge-icon">↗</span>
                      <div>
                        <strong>7.2</strong>
                        <small>Current clarity</small>
                      </div>
                    </div>
                  </div>

                  <div className="dash-footer-q">
                    <div className="dash-q-icon">✦</div>
                    <div>
                      <small>CURIO IS ASKING</small>
                      <p>If force is zero, what happens to an object's motion?</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES GRID SECTION */}
      <section className="features-grid-section" ref={featuresRef}>
        <div className="scroll-container">
          <div className="section-header-center">
            <span className="section-label">Features</span>
            <h2>
              Built for the way <br />
              <span className="hero-highlight-blue">real understanding works.</span>
            </h2>
            <p className="section-subheader">
              Curio doesn't measure whether you can recognize an answer. It
              measures whether you can construct and defend one.
            </p>
          </div>

          <div className="features-card-grid">
            <div className="feature-block-card">
              <div className="feature-block-icon b-blue">💬</div>
              <h3>Teach in your own words</h3>
              <p>Explain a concept naturally, just like you would teach it to a friend.</p>
              <span className="feature-block-arrow">→</span>
            </div>
            <div className="feature-block-card">
              <div className="feature-block-icon b-green">✦</div>
              <h3>Curio asks smart questions</h3>
              <p>Our AI student asks follow-ups whenever your explanation is vague, incomplete, or contradictory.</p>
              <span className="feature-block-arrow">→</span>
            </div>
            <div className="feature-block-card">
              <div className="feature-block-icon b-yellow">⌁</div>
              <h3>Discover your gaps</h3>
              <p>See exactly where your understanding becomes uncertain or breaks down.</p>
              <span className="feature-block-arrow">→</span>
            </div>
            <div className="feature-block-card">
              <div className="feature-block-icon b-purple">▣</div>
              <h3>Get your report</h3>
              <p>Receive scores, misconceptions, gaps and specific topics to review.</p>
              <span className="feature-block-arrow">→</span>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS TIMELINE SECTION */}
      <section className="how-it-works-section" ref={howItWorksRef}>
        <div className="scroll-container">
          <div className="section-header-center">
            <span className="section-label">How it works</span>
            <h2>
              From explanation <br />
              <span className="hero-highlight-green">to real understanding.</span>
            </h2>
            <p className="section-subheader">
              A simple five-step learning loop designed around the Feynman
              Technique.
            </p>
          </div>

          <div className="timeline-steps-vertical">
            <div className="step-row">
              <div className="step-number-box">01</div>
              <div className="step-description">
                <h3>Choose a topic</h3>
                <p>Pick anything you're studying — physics, biology, mathematics, history, programming or more.</p>
              </div>
            </div>
            <div className="step-row">
              <div className="step-number-box">02</div>
              <div className="step-description">
                <h3>Teach Curio</h3>
                <p>Explain the concept from memory using your own words. No notes or uploaded material required.</p>
              </div>
            </div>
            <div className="step-row">
              <div className="step-number-box">03</div>
              <div className="step-description">
                <h3>Curio gets curious</h3>
                <p>The AI behaves like a genuinely curious learner and asks targeted follow-up questions.</p>
              </div>
            </div>
            <div className="step-row">
              <div className="step-number-box">04</div>
              <div className="step-description">
                <h3>Expose the gaps</h3>
                <p>Vague explanations, skipped steps, unexplained jargon and contradictions become visible.</p>
              </div>
            </div>
            <div className="step-row">
              <div className="step-number-box">05</div>
              <div className="step-description">
                <h3>Understand your understanding</h3>
                <p>Curio analyzes the complete conversation and generates your Understanding Report.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AI TRANSPARENCY SECTION */}
      <section className="transparency-section">
        <div className="scroll-container">
          <div className="transparency-grid">
            <div className="transparency-visual">
              <div className="transparency-card">
                <div className="transparency-card-header">
                  <div className="spark-logo">✦</div>
                  <strong>Why I asked this</strong>
                </div>
                <p>You mentioned "energy" but didn't explain how energy is transferred during the process.</p>
                <div className="transparency-badge">Concept gap detected</div>
              </div>
              <div className="transparency-connector"></div>
              <div className="transparency-card offset-right">
                <div className="transparency-card-header">
                  <div className="q-logo">?</div>
                  <strong>Curio follows up</strong>
                </div>
                <p>What exactly happens to that energy next?</p>
              </div>
            </div>

            <div className="transparency-copy">
              <span className="section-label">Not just an AI chatbot</span>
              <h2>
                Every question has <br />
                <span className="hero-highlight-blue">a purpose.</span>
              </h2>
              <p>
                Curio isn't designed to simply keep a conversation going. Each
                follow-up is meant to probe your explanation and reveal how
                deeply you've understood the concept.
              </p>
              <div className="transparency-insights">
                <div className="insight-card"><span>01</span> Detect vague explanations</div>
                <div className="insight-card"><span>02</span> Catch skipped reasoning steps</div>
                <div className="insight-card"><span>03</span> Identify contradictions</div>
                <div className="insight-card"><span>04</span> Challenge unexplained jargon</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* LEARNING SCIENCE SECTION */}
      <section className="learning-science-section" ref={scienceRef}>
        <div className="scroll-container">
          <div className="science-outer-card">
            <div className="science-left-content">
              <span className="section-label">Learning Science</span>
              <h2>
                Learn by teaching. <br />
                <span className="hero-highlight-green">Understand by explaining.</span>
              </h2>
              <p>
                Curio is inspired by the Feynman Technique and the Protégé Effect
                — approaches that encourage learners to explain concepts clearly
                instead of simply recognizing answers.
              </p>
            </div>
            <div className="science-right-pills">
              <span className="science-pill">Feynman Technique</span>
              <span className="science-pill">Protégé Effect</span>
              <span className="science-pill">Active Recall</span>
              <span className="science-pill">Metacognition</span>
            </div>
          </div>
        </div>
      </section>

      {/* REPORT SECTION */}
      <section className="report-preview-section" ref={reportRef}>
        <div className="scroll-container">
          <div className="report-grid">
            <div className="report-copy-column">
              <span className="section-label">Understanding Report</span>
              <h2>
                Don't just get a score. <br />
                <span className="hero-highlight-blue">Know why.</span>
              </h2>
              <p>
                When your session ends, Curio analyzes the complete conversation
                and turns it into an actionable understanding report.
              </p>
              <div className="report-bullet-list">
                <div className="bullet-row">
                  <span className="bullet-dot b-blue"></span>
                  What you explained well
                </div>
                <div className="bullet-row">
                  <span className="bullet-dot b-green"></span>
                  Gaps in your understanding
                </div>
                <div className="bullet-row">
                  <span className="bullet-dot b-yellow"></span>
                  Misconceptions discovered
                </div>
                <div className="bullet-row">
                  <span className="bullet-dot b-purple"></span>
                  Specific topics to review
                </div>
              </div>
            </div>

            <div className="report-card-visual">
              <div className="report-card-inner">
                <div className="report-card-header">
                  <div>
                    <small>UNDERSTANDING REPORT</small>
                    <h3>Photosynthesis</h3>
                  </div>
                  <div className="report-score-indicator">
                    7.2
                    <span>/10</span>
                  </div>
                </div>

                <div className="report-score-bars">
                  <div className="score-row-item">
                    <div className="score-row-labels">
                      <span>Clarity</span>
                      <strong>8.0</strong>
                    </div>
                    <div className="score-row-bar">
                      <div className="fill" style={{ width: "80%" }}></div>
                    </div>
                  </div>
                  <div className="score-row-item">
                    <div className="score-row-labels">
                      <span>Completeness</span>
                      <strong>6.0</strong>
                    </div>
                    <div className="score-row-bar">
                      <div className="fill" style={{ width: "60%" }}></div>
                    </div>
                  </div>
                  <div className="score-row-item">
                    <div className="score-row-labels">
                      <span>Accuracy</span>
                      <strong>8.0</strong>
                    </div>
                    <div className="score-row-bar">
                      <div className="fill" style={{ width: "80%" }}></div>
                    </div>
                  </div>
                  <div className="score-row-item">
                    <div className="score-row-labels">
                      <span>Depth</span>
                      <strong>7.0</strong>
                    </div>
                    <div className="score-row-bar">
                      <div className="fill" style={{ width: "70%" }}></div>
                    </div>
                  </div>
                </div>

                <div className="report-warning-box">
                  <span className="warning-icon">!</span>
                  <div>
                    <strong>Misconception detected</strong>
                    <p>
                      You connected sunlight directly to glucose production without
                      explaining the intermediate energy conversion.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CALL-TO-ACTION SECTION */}
      <section className="cta-banner-section">
        <div className="cta-inner-card">
          <div className="cta-backdrop-glow"></div>
          <span className="section-label">Ready to find out?</span>
          <h2>
            You might know more <br />
            <span className="hero-highlight-green">than you think.</span>
          </h2>
          <p>
            Pick a concept. Teach it to Curio. <br />
            Let's discover what you really understand.
          </p>
          <button className="primary-button cta-cta-btn" onClick={onStart}>
            Start Teaching →
          </button>
          <span className="cta-disclaimer">
            No notes. No preparation. Just explain.
          </span>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer-scrolling">
        <div className="footer-columns-wrapper">
          <div className="footer-brand-side">
            <div className="brand">
              <div className="brand-logo-container">
                <svg
                  className="brand-spark"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 2C12 7.5 7.5 12 2 12C7.5 12 12 16.5 12 22C12 16.5 16.5 12 22 12C16.5 12 12 7.5 12 2Z"
                    fill="currentColor"
                  />
                </svg>
              </div>
              <span className="brand-text">Curio</span>
            </div>
            <p>AI that learns by being taught.</p>
          </div>

          <div className="footer-navigation-links">
            <div className="footer-column">
              <strong>Product</strong>
              <button onClick={() => scrollTo(featuresRef)}>Features</button>
              <button onClick={() => scrollTo(howItWorksRef)}>How it works</button>
              <button onClick={() => scrollTo(reportRef)}>Reports</button>
            </div>
            <div className="footer-column">
              <strong>Learn</strong>
              <button onClick={() => scrollTo(scienceRef)}>Learning science</button>
              <button onClick={() => scrollTo(howItWorksRef)}>The Curio method</button>
            </div>
            <div className="footer-column">
              <strong>Project</strong>
              <a href="https://github.com/Nimalan07/curio-ai.git" target="_blank" rel="noreferrer">
                GitHub
              </a>
              <a href="#docs">Documentation</a>
            </div>
          </div>
        </div>

        <div className="footer-sub-bottom">
          <span>© 2026 Curio</span>
          <span>Built for learners who want to understand.</span>
        </div>
      </footer>
    </div>
  );
}

export default Home;
