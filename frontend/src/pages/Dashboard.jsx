import Navbar from "../components/Navbar";
import GrowthDashboard from "../components/GrowthDashboard";

export default function Dashboard({ user, onLogout, onHome }) {

  return (
    <div className="dashboard-page">

      <Navbar
        onHome={onHome}
        user={user}
        onLogout={onLogout}
        showBack={true}
      />

      <main className="dashboard-container" style={{ maxWidth: "1000px", margin: "0 auto", padding: "40px 20px" }}>

        <div className="dashboard-heading" style={{ marginBottom: "32px" }}>

          <span className="section-label" style={{ color: "#64748b", fontWeight: "700", letterSpacing: "1.5px", fontSize: "12px" }}>
            CURIO DASHBOARD
          </span>

          <h1 style={{ fontSize: "36px", color: "#0f172a", marginTop: "8px" }}>
            See yourself getting better.
          </h1>

          <p style={{ color: "#64748b", marginTop: "8px", fontSize: "16px" }}>
            Your sessions become a picture of
            how your understanding develops.
          </p>

        </div>

        <GrowthDashboard />

      </main>

    </div>
  );
}
