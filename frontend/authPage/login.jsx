import React, { useState } from "react";
import { Mail, Lock, Eye, EyeOff, Github } from "lucide-react";
// import { signInWithEmailAndPassword } from "firebase/auth";
// import { auth } from "../src/firebase";
import "./login.css";

function Login({ onLoginSuccess, onGoToSignup }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const token = await user.getIdToken();

      const response = await fetch("http://localhost:5001/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      localStorage.setItem("token", token);
      localStorage.setItem("uid", user.uid);

      console.log("Login success:", data);
      onLoginSuccess();
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  return (
    <div className="login-page">
      <div className="login-wrapper">
        <div className="login-card">
          <div className="brand-circle">
            <img
              src="/logos/revolvelogo.jpeg"
              alt="Revolve Interview"
              className="brand-logo"
            />
          </div>

          <h2>Welcome back</h2>
          <p className="subtitle">Log in to your account</p>

          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label>Email Address</label>
              <div className="input-inner">
                <Mail className="field-icon" size={18} />
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError("");
                  }}
                  required
                />
              </div>
            </div>

            <div className="input-group">
              <label>Password</label>
              <div className="input-inner">
                <Lock className="field-icon" size={18} />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (error) setError("");
                  }}
                  required
                />
                <button
                  type="button"
                  className="toggle-eye"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {error && <p className="error-message">{error}</p>}

            <div className="options">
              <label className="remember-me">
                <input type="checkbox" />
                <span>Remember me</span>
              </label>
              <a href="#" className="forgot-link">Forgot password?</a>
            </div>

            <button type="submit" className="login-btn">Log In</button>
          </form>

          <div className="divider">
            <span>or continue with</span>
          </div>

          <div className="social-row">
            <button className="social-btn" type="button">
              <img
                src="https://www.svgrepo.com/show/355037/google.svg"
                alt="Google"
                width="18"
              />
              Google
            </button>

            <button className="social-btn" type="button">
              <Github size={18} />
              GitHub
            </button>
          </div>

          <p className="footer-note">
            Don’t have an account?
            <span className="link-text" onClick={onGoToSignup}> Sign up</span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;