import { useState } from "react";
import axios from "axios";

function Register({ onRegister, onSwitchToLogin }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);

  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    // ========================================
    // Validation
    // ========================================

    if (!name.trim() || !email.trim() || !password || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/register`,
        {
          name: name.trim(),
          email: email.trim(),
          password,
        },
      );

      if (!response.data?.success || !response.data?.token) {
        throw new Error(response.data?.message || "Registration failed.");
      }

      // ========================================
      // Save JWT
      // ========================================

      localStorage.setItem("mathmentor-token", response.data.token);

      // ========================================
      // Save User
      // ========================================

      localStorage.setItem(
        "mathmentor-user",
        JSON.stringify(response.data.user),
      );

      // ========================================
      // Continue to Application
      // ========================================

      onRegister(response.data.user);
    } catch (err) {
      console.error("Registration Error:", err);

      setError(
        err.response?.data?.message ||
          err.message ||
          "Unable to create account. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">🧠</div>

        <h1>Create Account</h1>

        <p className="auth-subtitle">
          Create your MathMentor AI account and start learning.
        </p>

        {error && <div className="auth-error">⚠️ {error}</div>}

        <form className="auth-form" onSubmit={handleSubmit}>
          {/* Name */}

          <div className="form-group">
            <label htmlFor="register-name">Name</label>

            <input
              id="register-name"
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Enter your name"
              autoComplete="name"
              disabled={loading}
            />
          </div>

          {/* Email */}

          <div className="form-group">
            <label htmlFor="register-email">Email</label>

            <input
              id="register-email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Enter your email"
              autoComplete="email"
              disabled={loading}
            />
          </div>

          {/* Password */}

          <div className="form-group">
            <label htmlFor="register-password">Password</label>

            <div className="password-input-wrapper">
              <input
                id="register-password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Minimum 6 characters"
                autoComplete="new-password"
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

          {/* Confirm Password */}

          <div className="form-group">
            <label htmlFor="confirm-password">Confirm Password</label>

            <div className="password-input-wrapper">
              <input
                id="confirm-password"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                placeholder="Re-enter your password"
                autoComplete="new-password"
                disabled={loading}
              />

              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          {/* Submit */}

          <button className="auth-submit" type="submit" disabled={loading}>
            {loading ? (
              <>
                <span className="spinner"></span>
                Creating account...
              </>
            ) : (
              "Create Account"
            )}
          </button>
        </form>

        {/* Switch Login */}

        <div className="auth-switch">
          <span>Already have an account?</span>

          <button type="button" onClick={onSwitchToLogin}>
            Login
          </button>
        </div>
      </div>
    </div>
  );
}

export default Register;
