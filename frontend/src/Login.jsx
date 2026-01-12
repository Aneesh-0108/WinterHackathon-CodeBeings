import { useState } from "react";

const USERS = {
  admin: "1234",
};

function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function handleLogin() {
    if (USERS[username] !== password) {
      setError("Invalid admin credentials");
      return;
    }
    onLogin(username);
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <h1>Admin Login</h1>

        <input
          placeholder="Username"
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <div className="login-error">{error}</div>}
        <button onClick={handleLogin}>Login</button>
      </div>
    </div>
  );
}

export default Login;
