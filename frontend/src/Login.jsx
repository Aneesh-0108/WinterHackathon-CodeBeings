import { useState } from "react";

const USERS = {
  admin: "1234",
  user1: "pass1",
};

function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function handleLogin() {
    if (!USERS[username] || USERS[username] !== password) {
      setError("Invalid username or password");
      return;
    }

    localStorage.setItem("cc-user", username);
    onLogin(username);
  }

  return (
    <div className="login-page">
      <div className="login-card fade-in">
        <h1 className="login-title">Arcade Companion</h1>
        <p className="login-subtitle">Sign in to continue</p>

        <input
          className="login-input"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          className="login-input"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <div className="login-error">{error}</div>}

        <button className="login-btn" onClick={handleLogin}>
          Login →
        </button>
      </div>
    </div>
  );
}

export default Login;
