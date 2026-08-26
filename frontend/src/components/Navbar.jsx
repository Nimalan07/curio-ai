function Navbar({
  onHome,
  showBack = false,
  onScrollToHowItWorks,
}) {
  return (
    <header className="navbar">
      <div className="navbar-container">
        <button className="brand" onClick={onHome}>
          <div className="brand-icon">✦</div>
          <span className="brand-text">Curio</span>
        </button>

        <div className="navbar-links">
          {!showBack && onScrollToHowItWorks && (
            <button
              className="nav-link-btn"
              onClick={onScrollToHowItWorks}
            >
              How it works
            </button>
          )}

          {showBack ? (
            <button className="nav-back-btn" onClick={onHome}>
              ← Home
            </button>
          ) : (
            <button className="nav-cta-btn" onClick={onHome}>
              Start Teaching →
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;
