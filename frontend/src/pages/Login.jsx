import { useState } from "react";
import "./Login.css";
import GoogleIcon from "../components/GoogleIcon";

const API_URL = "http://localhost:8000";

export default function Login({ onSuccess, onBack }) {
  const [mode, setMode] = useState("signin");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!username.trim() || !password.trim()) {
      setError("Please enter your username and password.");
      return;
    }

    setLoading(true);

    try {
      const endpoint =
        mode === "signin"
          ? "/api/auth/login"
          : "/api/auth/register";

      const response = await fetch(`${API_URL}${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username.trim(),
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Authentication failed.");
      }

      if (onSuccess) {
        onSuccess(data.user, data.token);
      }
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `${API_URL}/api/auth/google`;
  };

  return (
    <div className="login-page">
      {/* Top navigation */}
      <header className="login-nav">
        <div
          className="curio-brand"
          onClick={onBack}
        >
          <div className="curio-logo" style={{ overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <img src="/logo1.jpeg" alt="Curio Logo" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
          <span>Curio</span>
        </div>

        <button
          className="back-home"
          onClick={onBack}
        >
          ← Back to home
        </button>
      </header>

      {/* Main */}
      <main className="login-main">
        <div className="login-decoration decoration-one"></div>
        <div className="login-decoration decoration-two"></div>

        <section className="login-card">
          {/* Left side */}
          <div className="login-intro">
            <div className="intro-badge">
              <span>●</span>
              AI-powered active learning
            </div>

            <h1>
              Learn by
              <br />
              <span>explaining.</span>
            </h1>

            <p>
              Welcome back to Curio. Teach what you know,
              discover what you missed, and build deeper
              understanding.
            </p>

            <div className="learning-points">
              <div className="learning-point">
                <div className="point-icon">✦</div>
                <div>
                  <strong>Explain</strong>
                  <span>Teach a concept in your own words.</span>
                </div>
              </div>

              <div className="learning-point">
                <div className="point-icon">?</div>
                <div>
                  <strong>Discover</strong>
                  <span>Curio asks questions that expose gaps.</span>
                </div>
              </div>

              <div className="learning-point">
                <div className="point-icon">✓</div>
                <div>
                  <strong>Understand</strong>
                  <span>Get a personalized understanding report.</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right side */}
          <div className="login-form-container">
            <div className="form-heading">
              <h2>
                {mode === "signin"
                  ? "Welcome back"
                  : "Create your account"}
              </h2>

              <p>
                {mode === "signin"
                  ? "Continue your learning journey."
                  : "Start discovering what you really understand."}
              </p>
            </div>

            {/* Google */}
            <button
              className="google-btn"
              onClick={handleGoogleLogin}
            >
              <GoogleIcon size={21} />
              <span>Continue with Google</span>
            </button>

            <div className="divider">
              <span>or continue with username</span>
            </div>

            <form onSubmit={handleSubmit}>
              <label>Username</label>
              <input
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />

              <label>Password</label>
              <div className="password-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />

                <button
                  type="button"
                  className="show-password"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>

              {mode === "signin" && (
                <div className="form-options">
                  <label className="remember">
                    <input type="checkbox" />
                    <span>Remember me</span>
                  </label>

                  <button
                    type="button"
                    className="forgot-password"
                  >
                    Forgot password?
                  </button>
                </div>
              )}

              {error && (
                <div className="login-error">
                  {error}
                </div>
              )}

              <button
                type="submit"
                className="login-submit"
                disabled={loading}
              >
                {loading
                  ? "Please wait..."
                  : mode === "signin"
                  ? "Sign in"
                  : "Create account"}
              </button>
            </form>

            <div className="switch-mode">
              {mode === "signin"
                ? "Don't have an account?"
                : "Already have an account?"}

              <button
                onClick={() =>
                  setMode(
                    mode === "signin"
                      ? "signup"
                      : "signin"
                  )
                }
              >
                {mode === "signin"
                  ? "Create one"
                  : "Sign in"}
              </button>
            </div>

            <p className="privacy-text">
              By continuing, you agree to Curio's terms
              and privacy policy.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
