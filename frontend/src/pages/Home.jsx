import { useRef } from "react";
import Navbar from "../components/Navbar";

function Home({ onStart, user, onLogout, onDashboard }) {
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
        user={user}
        onLogout={onLogout}
        onDashboard={onDashboard}
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

          {/* RIGHT COLUMN: REAL APPLICATION SCREENSHOT */}
          <div className="hero-visual">
            <img 
              src="/teach_screenshot.png" 
              alt="Curio Teach Interface" 
              style={{
                width: "100%",
                borderRadius: "20px",
                boxShadow: "0 20px 50px rgba(15, 23, 42, 0.12)",
                border: "1px solid #E2E8F0"
              }}
            />
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
              <img 
                src="/dashboard_screenshot.png" 
                alt="Curio Growth Tracking Dashboard" 
                style={{
                  width: "100%",
                  borderRadius: "28px",
                  boxShadow: "0 25px 70px rgba(20, 44, 68, 0.15)",
                  border: "1px solid #e0e8e4"
                }}
              />
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
              <div className="feature-block-icon b-blue">🎯</div>
              <h3>Confidence Gap Mapping</h3>
              <p>Rate your confidence (1-10) pre-session. Curio compares it to objective metrics, showing where you're overconfident or under-confident.</p>
              <span className="feature-block-arrow">→</span>
            </div>
            <div className="feature-block-card">
              <div className="feature-block-icon b-green">⚙️</div>
              <h3>Adaptive Difficulty Tuning</h3>
              <p>Change difficulty between Beginner, Clarifying, and Deep Dive levels to dynamically shift the AI student's inquiry depth.</p>
              <span className="feature-block-arrow">→</span>
            </div>
            <div className="feature-block-card">
              <div className="feature-block-icon b-yellow">🔍</div>
              <h3>Cognitive Transparency</h3>
              <p>Toggle "Why I Asked This" on any response to check Curio's internal reasoning and see what gap in your words triggered it.</p>
              <span className="feature-block-arrow">→</span>
            </div>
            <div className="feature-block-card">
              <div className="feature-block-icon b-purple">⇄</div>
              <h3>TeachBack Evaluation</h3>
              <p>Get a detailed side-by-side comparison of your explanation with an ideal model, outlining covered points and key omissions.</p>
              <span className="feature-block-arrow">→</span>
            </div>
            <div className="feature-block-card">
              <div className="feature-block-icon b-yellow">⚠️</div>
              <h3>Misconception Pattern Detection</h3>
              <p>Instantly flag incorrect claims with severity tags, specific evidence from the chat, explanation, and key concepts to review.</p>
              <span className="feature-block-arrow">→</span>
            </div>
            <div className="feature-block-card">
              <div className="feature-block-icon b-blue">⬡</div>
              <h3>Understanding Radar Charts</h3>
              <p>Visualize the four pillars of understanding—Clarity, Completeness, Accuracy, and Depth—using Recharts radar charts.</p>
              <span className="feature-block-arrow">→</span>
            </div>
            <div className="feature-block-card">
              <div className="feature-block-icon b-green">↗</div>
              <h3>Growth Tracking Dashboard</h3>
              <p>Analyze your progress over time, tracking your average scores and learning graph across all active sessions.</p>
              <span className="feature-block-arrow">→</span>
            </div>
            <div className="feature-block-card">
              <div className="feature-block-icon b-purple">📥</div>
              <h3>Offline Report Downloads</h3>
              <p>Export your full Understanding Report Card as a high-fidelity PNG image with a single click for offline reference.</p>
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
              <img 
                src="/results_screenshot.png" 
                alt="Curio Understanding Report" 
                style={{
                  width: "100%",
                  borderRadius: "25px",
                  boxShadow: "0 25px 70px rgba(20, 44, 68, 0.15)",
                  border: "1px solid #e1e8e4"
                }}
              />
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
