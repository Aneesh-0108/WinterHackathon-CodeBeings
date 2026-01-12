function Home({ onLoginClick }) {
  return (
    <div className="landing-page">
      <div className="landing-card">
        <h1>Cloud Companion ☁️</h1>

        <p className="tagline">
          Hybrid AI Chatbot for Google Cloud Arcade & Skill Boost
        </p>

        {/* ABOUT */}
        <section className="landing-section">
          <h3>🚀 What is this project?</h3>
          <p>
            Cloud Companion is a responsible hybrid chatbot that helps Google
            Cloud Arcade & Skill Boost users get instant answers to common
            queries while safely escalating account-specific issues.
          </p>
        </section>

        {/* ARCHITECTURE */}
        <section className="landing-section">
          <h3>🏗️ Architecture Overview</h3>
          <ul>
            <li>React frontend for clean user experience</li>
            <li>Express backend with strict separation of concerns</li>
            <li>Rule-based intent detection</li>
            <li>AI fallback for unresolved queries</li>
            <li>Safe escalation for sensitive issues</li>
          </ul>

          <a href="#" className="link-btn" onClick={(e) => e.preventDefault()}>
            View Architecture →
          </a>
        </section>

        {/* TEAM */}
        <section className="landing-section">
          <h3>👥 Team</h3>

          <div className="team-grid">
            <div className="team-card">
              <h4>Deekshith Shetty</h4>
              <p>Frontend Developer</p>
            </div>

            <div className="team-card">
              <h4>Aneesh Hebbar</h4>
              <p>Backend Core Developer</p>
            </div>

            <div className="team-card">
              <h4>Akshaj Shetty</h4>
              <p>Data & Knowledge Engineer</p>
            </div>
          </div>
        </section>

        {/* LINKS */}
        <section className="landing-section">
          <h3>🔗 Links</h3>

          <div className="link-group">
            <a
              href="https://github.com/your-org/your-repo"
              target="_blank"
              rel="noreferrer"
              className="link-btn"
            >
              GitHub Repository
            </a>

            <a
              href="#"
              className="link-btn secondary"
              onClick={(e) => e.preventDefault()}
            >
              Live Demo (Coming Soon)
            </a>
          </div>
        </section>

        {/* LOGIN */}
        <button className="login-btn" onClick={onLoginClick}>
          Login to Continue →
        </button>
      </div>
    </div>
  );
}

export default Home;
