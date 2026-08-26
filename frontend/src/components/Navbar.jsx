function Navbar({ onHome, showBack = false, onScrollToHowItWorks, onScrollToFeatures }) {
  return (
    <header className="navbar">
      <div className="navbar-container">
        <button className="brand" onClick={onHome}>
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
        </button>

        {!showBack && (
          <nav className="navbar-links">
            <button className="nav-link-btn" onClick={onScrollToHowItWorks}>
              How it works
            </button>
            <button className="nav-link-btn" onClick={onScrollToFeatures}>
              Features
            </button>
          </nav>
        )}

        <div className="navbar-actions">
          {showBack ? (
            <button className="nav-back-btn" onClick={onHome}>
              ← Home
            </button>
          ) : (
            <>
              <button className="nav-login-btn">Log in</button>
              <button className="nav-cta-btn" onClick={onHome}>
                Start Teaching
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;
