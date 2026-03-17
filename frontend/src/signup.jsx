import React, { useState } from "react";
import "./auth.css";

export default function Signup({ onGoToLogin = () => {}, onSignupSuccess = () => {} }) {

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName]   = useState("");
  const [email, setEmail]         = useState("");
  const [password, setPassword]   = useState("");
  const [showPass, setShowPass]   = useState(false);
  const [agree, setAgree]         = useState(false);
  const [error, setError]         = useState("");

  // 🔹 API CALL
  const handleSignup = async (data) => {
    try {
      const res = await fetch("http://localhost:5001/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (result.success) {
        console.log("Signup success");
        onSignupSuccess();   // go to dashboard
      } else {
        setError(result.error || "Signup failed");
      }

    } catch (err) {
      console.log(err);
      setError("Server error");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!firstName.trim() || !lastName.trim())
      return setError("Please enter your first and last name.");

    if (!email.trim())
      return setError("Please enter your email.");

    if (password.length < 6)
      return setError("Password must be at least 6 characters.");

    if (!agree)
      return setError("Please accept the Terms.");

    handleSignup({
      firstName,
      lastName,
      email,
      password
    });
  };

  return (
    <div className="auth-page">

      <div className="auth-header">
        <h1 className="auth-title">Create Account</h1>
        <p className="auth-subtitle">Join thousands of creators today</p>
      </div>

      <div className="auth-card">

        <form className="form-grid" onSubmit={handleSubmit}>

          <div className="two-col">
            <div>
              <label className="label">First Name</label>
              <input
                className="input"
                value={firstName}
                onChange={(e)=>setFirstName(e.target.value)}
                placeholder="John"
              />
            </div>

            <div>
              <label className="label">Last Name</label>
              <input
                className="input"
                value={lastName}
                onChange={(e)=>setLastName(e.target.value)}
                placeholder="Doe"
              />
            </div>
          </div>

          <div>
            <label className="label">Email</label>
            <input
              className="input"
              value={email}
              onChange={(e)=>setEmail(e.target.value)}
              placeholder="john@email.com"
            />
          </div>

          <div>
            <label className="label">Password</label>

            <div className="password-wrap">
              <input
                className="input"
                type={showPass ? "text" : "password"}
                value={password}
                onChange={(e)=>setPassword(e.target.value)}
                placeholder="******"
              />

              <button
                type="button"
                className="eye-btn"
                onClick={()=>setShowPass(!showPass)}
              >
                {showPass ? "Hide" : "Show"}
              </button>
            </div>

          </div>

          <label className="check">
            <input
              type="checkbox"
              checked={agree}
              onChange={(e)=>setAgree(e.target.checked)}
            />
            I agree to the Terms of Service
          </label>

          <button className="primary-btn" type="submit">
            Create Account
          </button>

          {error && <div className="error">{error}</div>}

        </form>

        <div className="bottom-text">
          Already have an account?
          <span className="link" onClick={onGoToLogin}>
            Sign in
          </span>
        </div>

      </div>

    </div>
  );
}