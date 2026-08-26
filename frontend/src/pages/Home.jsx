import { useRef } from "react";
import Navbar from "../components/Navbar";

function Home({ onStart }) {
  const featuresRef = useRef(null);

  function scrollToFeatures() {
    featuresRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <div className="home-page">
      <Navbar
        onHome={onStart}
        onScrollToHowItWorks={scrollToFeatures}
        onScrollToFeatures={scrollToFeatures}
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
              <button className="secondary-button" onClick={scrollToFeatures}>
                <svg
                  className="play-icon"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M8 5V19L19 12L8 5Z"
                    fill="currentColor"
                  />
                </svg>
                Watch Demo
              </button>
            </div>

            <div className="hero-trust">
              <div className="trust-avatars">
                <span className="avatar-pill a1">A</span>
                <span className="avatar-pill a2">J</span>
                <span className="avatar-pill a3">M</span>
                <span className="avatar-pill a4">S</span>
              </div>
              <div className="trust-text">
                <span className="star-icon">★</span>
                <strong>4.9</strong> from 80+ learners
              </div>
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
                  <h3>Photosynthesis</h3>
                  <div className="mockup-progress-row">
                    <div className="mockup-progress-bar">
                      <div className="fill" style={{ width: "66%" }}></div>
                    </div>
                    <span>4 / 6 turns</span>
                  </div>
                </div>

                {/* MESSAGES */}
                <div className="mockup-messages">
                  <div className="mock-message user">
                    <div className="mock-avatar">U</div>
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
                    <div className="mock-avatar">U</div>
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
                <svg viewBox="0 0 120 120" width="100%" height="100%">
                  {/* Grid Lines */}
                  <circle cx="60" cy="60" r="40" fill="none" stroke="#E2E8F0" strokeWidth="1" />
                  <circle cx="60" cy="60" r="25" fill="none" stroke="#E2E8F0" strokeWidth="1" />
                  <circle cx="60" cy="60" r="10" fill="none" stroke="#E2E8F0" strokeWidth="1" />
                  {/* Axis lines */}
                  <line x1="60" y1="20" x2="60" y2="100" stroke="#E2E8F0" strokeWidth="1" />
                  <line x1="20" y1="60" x2="100" y2="60" stroke="#E2E8F0" strokeWidth="1" />
                  {/* Labels */}
                  <text x="60" y="15" textAnchor="middle" fontSize="6" fontWeight="bold" fill="#64748B">Clarity</text>
                  <text x="105" y="62" fontSize="6" fontWeight="bold" fill="#64748B">Completeness</text>
                  <text x="60" y="110" textAnchor="middle" fontSize="6" fontWeight="bold" fill="#64748B">Accuracy</text>
                  <text x="5" y="62" fontSize="6" fontWeight="bold" fill="#64748B">Depth</text>
                  {/* Score Values mapping: 
                      Clarity: 7.0 -> cx=60, cy=32
                      Completeness: 6.0 -> cx=84, cy=60
                      Accuracy: 8.0 -> cx=60, cy=92
                      Depth: 6.0 -> cx=36, cy=60
                  */}
                  <polygon
                    points="60,32 84,60 60,92 36,60"
                    fill="rgba(59, 130, 246, 0.2)"
                    stroke="#3B82F6"
                    strokeWidth="1.5"
                  />
                  {/* Score Text labels */}
                  <text x="60" y="27" textAnchor="middle" fontSize="6" fill="#0F172A" fontWeight="bold">7.0</text>
                  <text x="92" y="58" fontSize="6" fill="#0F172A" fontWeight="bold">6.0</text>
                  <text x="60" y="87" textAnchor="middle" fontSize="6" fill="#0F172A" fontWeight="bold">8.0</text>
                  <text x="24" y="58" fontSize="6" fill="#0F172A" fontWeight="bold">6.0</text>
                </svg>
              </div>
            </div>

            {/* 3D MASCOT ASSET */}
            <div className="mockup-mascot-wrapper">
              <img src="/mascot.png" alt="Curio mascot" className="mascot-img" />
            </div>
          </div>
        </div>
      </section>

      {/* BOTTOM FOUR CARDS GRID */}
      <section className="features-bar-section" ref={featuresRef}>
        <div className="features-bar-grid">
          <div className="feature-bar-card">
            <div className="feature-bar-icon-box f-blue">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2ZM20 16H5.2L4 17.2V4H20V16Z"
                  fill="currentColor"
                />
                <circle cx="8" cy="10" r="1.5" fill="currentColor"/>
                <circle cx="12" cy="10" r="1.5" fill="currentColor"/>
                <circle cx="16" cy="10" r="1.5" fill="currentColor"/>
              </svg>
            </div>
            <div className="feature-bar-content">
              <h3>Teach in your own words</h3>
              <p>Explain any concept naturally, just like you would to a friend.</p>
            </div>
          </div>

          <div className="feature-bar-card">
            <div className="feature-bar-icon-box f-green">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M12 2C12 7.5 7.5 12 2 12C7.5 12 12 16.5 12 22C12 16.5 16.5 12 22 12C16.5 12 12 7.5 12 2Z"
                  fill="currentColor"
                />
              </svg>
            </div>
            <div className="feature-bar-content">
              <h3>Curio asks smart questions</h3>
              <p>Our AI student asks follow-ups that test your real understanding.</p>
            </div>
          </div>

          <div className="feature-bar-card">
            <div className="feature-bar-icon-box f-yellow">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM9 17H7V10H9V17ZM13 17H11V7H13V17ZM17 17H15V12H17V17Z"
                  fill="currentColor"
                />
              </svg>
            </div>
            <div className="feature-bar-content">
              <h3>Discover your gaps</h3>
              <p>Curio identifies what's missing, vague, or misunderstood.</p>
            </div>
          </div>

          <div className="feature-bar-card">
            <div className="feature-bar-icon-box f-purple">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M14 2H6C4.9 2 4.01 2.9 4.01 4L4 20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2ZM18 20H6V4H13V9H18V20Z"
                  fill="currentColor"
                />
              </svg>
            </div>
            <div className="feature-bar-content">
              <h3>Get your report</h3>
              <p>See a detailed understanding report with scores and insights.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
