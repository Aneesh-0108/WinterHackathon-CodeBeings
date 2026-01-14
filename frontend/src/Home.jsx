import { useState } from "react";

function Home({ onLoginClick }) {
  const [section, setSection] = useState("home");

  return (
    <div className="home-wrapper">
      {/* ======================
          SIDEBAR
      ====================== */}
      <aside className="home-sidebar">
        <div className="project-title">Arcade Companion</div>

        {["home", "about", "architecture", "team", "links"].map((item) => (
          <button
            key={item}
            className={`nav-btn ${section === item ? "active" : ""}`}
            onClick={() => setSection(item)}
          >
            {item.toUpperCase()}
          </button>
        ))}
      </aside>

      {/* ======================
          MAIN CONTENT
      ====================== */}
      <main className="home-content">
        {/* HOME */}
        {section === "home" && (
          <div className="fade">
            <h1 className="hero-text">
              Hybrid AI Chatbot <br />
              for Google Cloud Arcade & Skill Boost
            </h1>

            <button
              className="cta-btn"
              onClick={() => {
                if (typeof onLoginClick === "function") {
                  onLoginClick();
                }
              }}
            >
              getStarted();
            </button>

            {/* SAMPLE CARDS */}
            <div className="sample-grid">
              <div className="sample-card">
                <h4>Profile & Verification</h4>
                <p>Fix profile visibility, verification, and email issues.</p>
              </div>

              <div className="sample-card">
                <h4>Labs & Progress</h4>
                <p>Resolve lab errors, timers, region mismatch, and badges.</p>
              </div>

              <div className="sample-card">
                <h4>Safe Escalation</h4>
                <p>Account‑specific issues are escalated responsibly.</p>
              </div>
            </div>
          </div>
        )}

        {/* ABOUT */}
        {section === "about" && (
          <div className="fade">
            <h2>About</h2>
            <p>
              Arcade Companion is a responsible hybrid chatbot designed to
              assist Google Cloud Arcade & Skill Boost users with instant help
              while safely escalating sensitive issues.
            </p>
          </div>
        )}

        {/* ARCHITECTURE */}
        {section === "architecture" && (
          <div className="fade">
            <h2>Architecture Flow</h2>

            <div className="arch-flow">
              <div className="arch-box">React Frontend</div>
              <span>↓</span>
              <div className="arch-box">Backend Core API</div>
              <span>↓</span>
              <div className="arch-box">Intent Logic + Dataset</div>
              <span>↓</span>
              <div className="arch-box">AI / Escalation Layer</div>
            </div>

            <p className="arch-note">
              (This replaces placeholder images with a clear flow diagram.)
            </p>
          </div>
        )}

        {/* TEAM */}
        {section === "team" && (
          <div className="fade">
            <h2>Team</h2>
            <div className="team-grid">
              <div className="team-card">Deekshith – Frontend</div>
              <div className="team-card">Aneesh – Backend Core</div>
              <div className="team-card">Akshaj – Data</div>
            </div>
          </div>
        )}

        {/* LINKS */}
        {section === "links" && (
          <div className="fade">
            <h2>Links</h2>
            <button className="link-btn">GitHub Repo</button>
            <button className="link-btn secondary">Live Demo (Soon)</button>
          </div>
        )}
      </main>
    </div>
  );
}

export default Home;
