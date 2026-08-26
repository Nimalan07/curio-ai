import { useRef } from "react";
import Navbar from "../components/Navbar";

function Home({ onStart }) {
  const howItWorksRef = useRef(null);

  function scrollToHowItWorks() {
    howItWorksRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <div className="home-page">
      <Navbar onHome={onStart} onScrollToHowItWorks={scrollToHowItWorks} />

      {/* HERO SECTION */}
      <section className="hero-section">
        <div className="hero-container">
          <div className="hero-badge">AI-Powered Active Learning</div>
          
          <h1 className="hero-title">
            Don't just study it.
            <span className="hero-gradient"> Explain it.</span>
          </h1>

          <p className="hero-subtitle">
            Curio learns by being taught. Explain a concept in your own words, and
            Curio will ask the questions that reveal what you actually understand.
          </p>

          <div className="hero-actions">
            <button className="primary-button hero-cta" onClick={onStart}>
              Start Teaching →
            </button>
            <button className="secondary-button" onClick={scrollToHowItWorks}>
              See how Curio works
            </button>
          </div>

          {/* VISUAL LOOP CARDS */}
          <div className="visual-loop">
            <div className="loop-card card-explain">
              <span className="loop-number">01</span>
              <h4>You Explain</h4>
              <p className="loop-quote">
                "Photosynthesis is how plants make food using sunlight..."
              </p>
            </div>

            <div className="loop-connector">➔</div>

            <div className="loop-card card-ask">
              <span className="loop-number">02</span>
              <h4>Curio Asks</h4>
              <p className="loop-quote">
                "But what happens to the sunlight after the plant captures it?"
              </p>
            </div>

            <div className="loop-connector">➔</div>

            <div className="loop-card card-discover">
              <span className="loop-number">03</span>
              <h4>You Discover</h4>
              <p className="loop-status">⚠ Gap identified: Energy conversion</p>
            </div>
          </div>
        </div>
      </section>

      {/* THE PROBLEM */}
      <section className="problem-section">
        <div className="section-container text-center">
          <span className="section-label">THE LEARNING GAP</span>
          <h2 className="section-title">Recognition ≠ Understanding</h2>
          <p className="problem-text">
            We often confuse recognizing information with actually understanding it.
            Rereading, highlighting, and flashcards create the illusion of mastery.
            The only way to prove you understand a concept is to explain it simply to someone else.
          </p>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="how-it-works" ref={howItWorksRef}>
        <div className="section-container">
          <div className="text-center margin-bottom-lg">
            <span className="section-label">METHODOLOGY</span>
            <h2 className="section-title">A 3-step loop to test your boundaries</h2>
          </div>

          {/* TIMELINE CONNECTOR */}
          <div className="timeline-container">
            <div className="timeline-track">
              <div className="timeline-dot active"></div>
              <div className="timeline-dot"></div>
              <div className="timeline-dot"></div>
            </div>
            
            <div className="timeline-steps">
              <div className="timeline-step">
                <span className="step-num">01</span>
                <h3>You Explain</h3>
                <p>Teach Curio a concept using your own words. Explain it like you're talking to a curious friend.</p>
              </div>

              <div className="timeline-step">
                <span className="step-num">02</span>
                <h3>Curio Questions</h3>
                <p>Curio acts as a curious student, identifying vague statements or gaps and asking targeted follow-ups.</p>
              </div>

              <div className="timeline-step">
                <span className="step-num">03</span>
                <h3>You Discover</h3>
                <p>Get a detailed report showing your clarity, completeness, accuracy, and depth scores, along with review tips.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CHAT PRODUCT PREVIEW */}
      <section className="product-preview-section">
        <div className="section-container">
          <div className="preview-window">
            <div className="preview-header">
              <div className="preview-dots">
                <span></span>
                <span></span>
                <span></span>
              </div>
              <div className="preview-title">Curio — Teaching Session</div>
              <div className="preview-status">● Listening</div>
            </div>

            <div className="preview-chat-body">
              <div className="preview-msg msg-user">
                <div className="preview-avatar">Y</div>
                <div className="msg-content">
                  <span className="msg-author">You</span>
                  <div className="msg-bubble">
                    Photosynthesis is the process where plants take in sunlight, water, and carbon dioxide to make glucose (food) and release oxygen as a byproduct.
                  </div>
                </div>
              </div>

              <div className="preview-msg msg-curio">
                <div className="preview-avatar curio-av">✦</div>
                <div className="msg-content">
                  <span className="msg-author">Curio</span>
                  <div className="msg-bubble">
                    So the plant takes in water and carbon dioxide, and the energy from sunlight helps turn those into glucose. But what's the role of chlorophyll in all this? How does it help capture that sunlight?
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WHY CURIO */}
      <section className="why-curio-section">
        <div className="section-container">
          <div className="text-center margin-bottom-lg">
            <span className="section-label">WHY CURIO</span>
            <h2 className="section-title">Learning that tests understanding, not memory</h2>
          </div>

          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">✏️</div>
              <h3>Teach, don't select</h3>
              <p>Explain concepts in your own words instead of choosing answers from a multiple-choice list.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">❓</div>
              <h3>Curio asks why</h3>
              <p>The AI follows up when your explanation is vague, incomplete, or contains potential contradictions.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">🔍</div>
              <h3>Find the hidden gaps</h3>
              <p>Curio identifies the exact points where your explanation skips critical parts of the concept.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3>Get your Report</h3>
              <p>See scores across clarity, completeness, accuracy, and depth, plus misconceptions and recommended reviews.</p>
            </div>
          </div>
        </div>
      </section>

      {/* REPORT PREVIEW */}
      <section className="report-preview-section">
        <div className="section-container">
          <div className="report-preview-layout">
            <div className="report-preview-text">
              <span className="section-label">THE OUTCOME</span>
              <h2 className="section-title">An honest view of what you know</h2>
              <p>
                Every session ends with a personalized Understanding Report. 
                Instead of simple letter grades, Curio maps your cognitive structure 
                so you know exactly what parts need a second look.
              </p>
              
              <div className="report-preview-metrics">
                <div className="mini-metric">
                  <span>Clarity</span>
                  <div className="mini-bar"><div className="fill" style={{width: "82%"}}></div></div>
                  <strong>8.2</strong>
                </div>
                <div className="mini-metric">
                  <span>Completeness</span>
                  <div className="mini-bar"><div className="fill" style={{width: "70%"}}></div></div>
                  <strong>7.0</strong>
                </div>
                <div className="mini-metric">
                  <span>Accuracy</span>
                  <div className="mini-bar"><div className="fill" style={{width: "90%"}}></div></div>
                  <strong>9.0</strong>
                </div>
              </div>
            </div>

            <div className="report-preview-card">
              <div className="preview-card-header">
                <span className="card-badge">UNDERSTANDING REPORT</span>
                <h3>Photosynthesis Results</h3>
              </div>
              
              <div className="preview-card-sections">
                <div className="card-sec success">
                  <h5>✓ What You Explained Well</h5>
                  <p>Role of sunlight, basic chemical equation, plant absorption.</p>
                </div>
                <div className="card-sec warning">
                  <h5>⚠ Gaps Found</h5>
                  <p>Light-dependent reactions, chlorophyll energy conversion process.</p>
                </div>
                <div className="card-sec danger">
                  <h5>? Possible Misconceptions</h5>
                  <p>Confused direct sugar synthesis timing with solar capturing.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* LEARNING SCIENCE */}
      <section className="science-section">
        <div className="section-container">
          <div className="text-center margin-bottom-lg">
            <span className="section-label">COGNITIVE SCIENCE</span>
            <h2 className="section-title">Built on proven learning models</h2>
          </div>

          <div className="science-grid">
            <div className="science-card">
              <h4>The Feynman Technique</h4>
              <p>
                Named after physicist Richard Feynman, this technique says that explaining a concept 
                simply to others forces you to locate and resolve the gaps in your own knowledge.
              </p>
            </div>

            <div className="science-card">
              <h4>The Protégé Effect</h4>
              <p>
                Studies show that students who prepare to teach others (or teach a peer) develop 
                significantly better conceptual understanding and recall than those who study for a test.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="cta-section">
        <div className="section-container text-center">
          <h2>Ready to find out what you really understand?</h2>
          <p>Don't study harder. Explain better.</p>
          <button className="primary-button hero-cta" onClick={onStart}>
            Start Teaching →
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-brand">
            <span className="brand-logo">✦</span>
            <h4>Curio</h4>
            <p>Learn by explaining.</p>
          </div>

          <div className="footer-columns">
            <div className="footer-col">
              <h5>Product</h5>
              <button className="footer-link-btn" onClick={scrollToHowItWorks}>
                How it works
              </button>
              <button className="footer-link-btn" onClick={onStart}>
                Start Teaching
              </button>
            </div>
            <div className="footer-col">
              <h5>Resources</h5>
              <a href="https://github.com/Nimalan07/curio-ai.git" target="_blank" rel="noreferrer">
                GitHub Repository
              </a>
              <a href="http://localhost:8000/docs" target="_blank" rel="noreferrer">
                API Docs
              </a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2026 Curio AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default Home;
