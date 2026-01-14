import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "./firebase"; // adjust path if needed

function UserLogin({ onUserLogin, onAdminClick }) {
  async function handleGoogleLogin() {
    try {
      const result = await signInWithPopup(auth, provider);

      console.log("Google user:", result.user);

      // Integrate with your existing flow
      // This keeps your routing logic unchanged
      onUserLogin(result.user.email);
    } catch (err) {
      console.error("Google login failed:", err);
      alert("Google login failed");
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <h1>User Login</h1>

        <input placeholder="Username" />
        <input type="password" placeholder="Password" />

        <button onClick={onUserLogin}>Login</button>

        <div className="divider">or</div>

        {/* ✅ FIXED GOOGLE LOGIN */}
        <button className="google-btn" onClick={handleGoogleLogin}>
          Continue with Google
        </button>

        <div className="divider">or</div>

        <button className="secondary-btn" onClick={onAdminClick}>
          Login as Admin →
        </button>
      </div>
    </div>
  );
}

export default UserLogin;
