import React, { useState } from "react";
import "./auth.css";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider, githubProvider } from "./firebase";

function getDisplayName(user, fallbackEmail = "") {
  if (user?.displayName?.trim()) {
    return user.displayName.trim();
  }

  if (user?.email?.trim()) {
    return user.email.split("@")[0];
  }

  if (fallbackEmail.trim()) {
    return fallbackEmail.split("@")[0];
  }

  return "User";
}

export default function Login({
  onGoToSignup = () => {},
  onLoginSuccess = () => {},
  onForgotPassword = () => console.log("Forgot password"),
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setError("");
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      localStorage.setItem("uid", user.uid);
      localStorage.setItem("email", user.email);
      localStorage.setItem("displayName", getDisplayName(user));
      setLoading(false);
      onLoginSuccess();
    } catch (err) {
      console.error(err);
      setError(err.message || "Google login failed.");
      setLoading(false);
    }
  };

  const handleGithubLogin = async () => {
    setError("");
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, githubProvider);
      const user = result.user;
      localStorage.setItem("uid", user.uid);
      localStorage.setItem("email", user.email);
      localStorage.setItem("displayName", getDisplayName(user));
      setLoading(false);
      onLoginSuccess();
    } catch (err) {
      console.error(err);
      setError(err.message || "GitHub login failed.");
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!email.trim()) {
      setError("Please enter your email address.");
      setLoading(false);
      return;
    }
    if (!password.trim()) {
      setError("Please enter your password.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("http://localhost:5001/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || data.message || "Login failed");
        setLoading(false);
        return;
      }

      if (data.uid) {
        localStorage.setItem("uid", data.uid);
        localStorage.setItem("email", email);
        localStorage.setItem("displayName", getDisplayName(null, email));
      }

      setLoading(false);
      onLoginSuccess();
    } catch (err) {
      console.error(err);
      setError("Network error. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="brand-icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none">
          <path
            d="M13 2L3 14h8l-1 8 11-14h-8l0-6z"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      <div className="auth-header">
        <h1 className="auth-title">Login</h1>
        <p className="auth-subtitle">Access your account</p>
      </div>

      <div className="auth-card">
        <div className="social-row">
          <button type="button" className="social-btn" onClick={handleGoogleLogin} disabled={loading}>
            <GoogleIcon />
            Google
          </button>

          <button type="button" className="social-btn" onClick={handleGithubLogin} disabled={loading}>
            <GithubIcon />
            GitHub
          </button>
        </div>

        <div className="divider">
          <span />
          <div>or continue with email</div>
          <span />
        </div>

        <form className="form-grid" onSubmit={handleSubmit}>
          <div>
            <label className="label">Email Address</label>
            <input
              className="input"
              placeholder="john@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
          </div>

          <div>
            <label className="label">Password</label>
            <div className="password-wrap">
              <input
                className="input"
                type={showPass ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
              <button
                type="button"
                className="eye-btn"
                onClick={() => setShowPass((p) => !p)}
                aria-label="Toggle password visibility"
                disabled={loading}
              >
                {showPass ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>
          </div>

          <div className="row">
            <label className="check">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                disabled={loading}
              />
              <span>Remember me</span>
            </label>

            <span className="link" onClick={onForgotPassword}>
              Forgot password?
            </span>
          </div>

          <button className="primary-btn" type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>

          {error ? <div className="error">{error}</div> : null}
        </form>

        <div className="bottom-text">
          Don't have an account?{" "}
          <span className="link" onClick={onGoToSignup}>
            Create one
          </span>
        </div>
      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303C33.651 32.659 29.194 36 24 36c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.844 1.154 7.958 3.042l5.657-5.657C34.02 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"/>
      <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 16.108 18.977 13 24 13c3.059 0 5.844 1.154 7.958 3.042l5.657-5.657C34.02 6.053 29.268 4 24 4c-7.682 0-14.38 4.337-17.694 10.691z"/>
      <path fill="#4CAF50" d="M24 44c5.094 0 9.768-1.955 13.31-5.134l-6.146-5.202C29.115 35.091 26.686 36 24 36c-5.173 0-9.563-3.298-11.201-7.9l-6.52 5.02C9.56 39.556 16.227 44 24 44z"/>
      <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303a12.07 12.07 0 0 1-4.139 5.664l.003-.002 6.146 5.202C36.88 39.236 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"/>
    </svg>
  );
}

function GithubIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 .5C5.73.5.75 5.7.75 12.15c0 5.16 3.22 9.54 7.69 11.09.56.11.77-.25.77-.55v-2.05c-3.13.7-3.79-1.56-3.79-1.56-.51-1.35-1.25-1.71-1.25-1.71-1.02-.72.08-.71.08-.71 1.13.08 1.73 1.2 1.73 1.2 1 .1.57-1.04 1.92-1.45-2.5-.29-5.13-1.29-5.13-5.75 0-1.27.44-2.31 1.16-3.13-.12-.29-.5-1.47.11-3.05 0 0 .95-.31 3.12 1.2.9-.26 1.87-.39 2.83-.39.96 0 1.93.13 2.83.39 2.17-1.51 3.12-1.2 3.12-1.2.61 1.58.23 2.76.11 3.05.72.82 1.16 1.86 1.16 3.13 0 4.47-2.63 5.46-5.14 5.74.41.37.78 1.1.78 2.22v3.29c0 .3.2.66.78.55 4.47-1.55 7.69-5.93 7.69-11.09C23.25 5.7 18.27.5 12 .5z"/>
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M3 3l18 18" stroke="currentColor" strokeWidth="1.8" />
      <path d="M2 12s3.5-7 10-7c2.2 0 4.1.63 5.7 1.58M22 12s-3.5 7-10 7c-2.2 0-4.1-.63-5.7-1.58" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
      <path d="M9.5 9.5a3 3 0 0 0 4.2 4.2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  );
}
