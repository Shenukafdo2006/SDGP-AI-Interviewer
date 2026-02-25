import React, { useState } from "react";
import { Mail, Lock, Eye, EyeOff, Github, UserPlus } from "lucide-react";
import "./login.css";

function Login({ onLoginSuccess, onBackToSignup }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Simple Validation
    if (!email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setError("");
    console.log("Logging in...", { email, password });
    onLoginSuccess(); 
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Welcome Back</h2>
        <p className="subtitle">Login to your account</p>

        <input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <div className="options">
          <label>
            <input type="checkbox" /> Remember me
          </label>
          <a href="#">Forgot Password?</a>
        </div>

        <button type="submit">Login</button>

        <p>
          Don’t have an account?{" "}
          <span
            className="link-text"
            onClick={onBackToSignup}
          >
            Sign Up
          </span>
        </p>
      </form>
    </div>
  );
}

export default Login;