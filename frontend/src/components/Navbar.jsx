function Navbar({
  onHome,
  onLogin,
  showBack = false,
  onScrollToHowItWorks,
  onScrollToFeatures,
  onScrollToScience,
  onScrollToReport,
  user,
  onLogout,
  onDashboard,
}) {
  return (
    <header className="navbar">
      <div className="navbar-container">
        <button className="brand" onClick={onHome}>
          <div className="brand-logo-container" style={{ overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <img src="/logo1.jpeg" alt="Curio Logo" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
          <span className="brand-text">Curio</span>
        </button>

        {!showBack && (
          <nav className="navbar-links">
            <button className="nav-link-btn" onClick={onScrollToFeatures}>
              Features
            </button>
            <button className="nav-link-btn" onClick={onScrollToHowItWorks}>
              How it works
            </button>
            <button className="nav-link-btn" onClick={onScrollToScience}>
              Learning science
            </button>
            <button className="nav-link-btn" onClick={onScrollToReport}>
              Understanding Report
            </button>
          </nav>
        )}

        <div className="navbar-actions">
          {showBack && (
            <button className="nav-back-btn" style={{ marginRight: '15px' }} onClick={onHome}>
              ← Home
            </button>
          )}
          {user ? (
            <div className="user-profile-menu">
              <span className="user-greeting">✦ {user.username}</span>
              {onDashboard && (
                <button className="nav-dashboard-btn" onClick={onDashboard}>
                  Dashboard
                </button>
              )}
              <button className="nav-logout-btn" onClick={onLogout}>
                Log out
              </button>
            </div>
          ) : (
            !showBack && (
              <>
                <button className="nav-login-btn" onClick={onLogin}>Log in</button>
                <button className="nav-cta-btn" onClick={onLogin}>
                  Start Teaching
                </button>
              </>
            )
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;
