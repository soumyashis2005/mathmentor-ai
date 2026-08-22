import { useState } from "react";
import axios from "axios";

function Login({ onLogin, onSwitchToRegister }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    if (!email.trim() || !password) {
      setError("Please enter your email and password.");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/login`,
        {
          email: email.trim(),
          password,
        },
      );

      if (!response.data?.success || !response.data?.token) {
        throw new Error(response.data?.message || "Login failed.");
      }

      // Save JWT
      localStorage.setItem("mathmentor-token", response.data.token);

      // Save user information
      localStorage.setItem(
        "mathmentor-user",
        JSON.stringify(response.data.user),
      );

      onLogin(response.data.user);
    } catch (err) {
      console.error("Login Error:", err);

      setError(
        err.response?.data?.message ||
          err.message ||
          "Unable to login. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">🧠</div>

        <h1>Welcome Back</h1>

        <p className="auth-subtitle">Login to continue using MathMentor AI.</p>

        {error && <div className="auth-error">⚠️ {error}</div>}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="login-email">Email</label>

            <input
              id="login-email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Enter your email"
              autoComplete="email"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="login-password">Password</label>

            <div className="password-input-wrapper">
              <input
                id="login-password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Enter your password"
                autoComplete="current-password"
                disabled={loading}
              />

              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          <button className="auth-submit" type="submit" disabled={loading}>
            {loading ? (
              <>
                <span className="spinner"></span>
                Logging in...
              </>
            ) : (
              "Login"
            )}
          </button>
        </form>

        <div className="auth-switch">
          <span>Don't have an account?</span>

          <button type="button" onClick={onSwitchToRegister}>
            Create account
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;
