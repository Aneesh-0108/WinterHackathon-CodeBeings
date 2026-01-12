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
      setError("❌ Invalid username or password");
      return;
    }

    localStorage.setItem("cc-user", username);
    onLogin(username);
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <h1>Cloud Companion ☁️</h1>
        <p>Login to continue</p>

        <input
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <div className="error">{error}</div>}

        <button onClick={handleLogin}>Login</button>

        <p className="hint">
          Demo users:
          <br />
          <b>admin / 1234</b>
          <br />
          <b>user1 / pass1</b>
        </p>
      </div>
    </div>
  );
}

export default Login;
