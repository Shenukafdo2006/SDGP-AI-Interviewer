import React, { useState } from "react";
import { User, Mail, Lock, Eye, EyeOff, Github } from "lucide-react";
import "./Signup.css";

function Signup({ onSignupSuccess, onGoToLogin }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    agree: false,
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
    // Clear error when user interacts
    if (errors[name]) setErrors({ ...errors, [name]: "" });
  };

  const validate = () => {
    let newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Full name is required";
    if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Invalid email address";
    if (formData.password.length < 8) newErrors.password = "Must be at least 8 characters";
    if (!formData.agree) newErrors.agree = "You must agree to the terms";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      console.log("Form Submitted", formData);
      onSignupSuccess();
    }
  };

  return (
    <div className="signup-wrapper">
      <div className="signup-card">
        {/* Top Icon */}
        <div className="header-icon">
          <div className="icon-box">
            <User size={28} color="#fff" strokeWidth={2.5} />
            <div className="plus-badge">+</div>
          </div>
        </div>

        <h2>Create your account</h2>
        <p className="subtitle">Join thousands of users building amazing things</p>

        <form onSubmit={handleSubmit}>
          {/* Full Name */}
          <div className="input-field">
            <label>Full Name</label>
            <div className={`input-wrapper ${errors.name ? "error-border" : ""}`}>
              <User className="icon" size={18} />
              <input
                type="text"
                name="name"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleChange}
              />
            </div>
            {errors.name && <span className="error-msg">{errors.name}</span>}
          </div>

          {/* Email */}
          <div className="input-field">
            <label>Email Address</label>
            <div className={`input-wrapper ${errors.email ? "error-border" : ""}`}>
              <Mail className="icon" size={18} />
              <input
                type="email"
                name="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Password */}
          <div className="input-field">
            <label>Password</label>
            <div className={`input-wrapper ${errors.password ? "error-border" : ""}`}>
              <Lock className="icon" size={18} />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Create a strong password"
                value={formData.password}
                onChange={handleChange}
              />
              <button 
                type="button" 
                className="toggle-pass" 
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <p className="hint">Must be at least 8 characters</p>
          </div>

          {/* Agreement */}
          <div className="checkbox-field">
            <input
              type="checkbox"
              name="agree"
              id="agree"
              checked={formData.agree}
              onChange={handleChange}
            />
            <label htmlFor="agree">
              I agree to the <span>Terms of Service</span> and <span>Privacy Policy</span>
            </label>
          </div>
          {errors.agree && <p className="error-msg text-center">{errors.agree}</p>}

          <button type="submit" className="btn-primary">Create Account</button>
        </form>

        <div className="divider">
          <span>or continue with</span>
        </div>

        <div className="social-group">
          <button className="btn-social">
            <img src="https://www.svgrepo.com/show/355037/google.svg" alt="Google" width="18" />
            Google
          </button>
          <button className="btn-social">
            <Github size={18} />
            GitHub
          </button>
        </div>

        <p className="footer-text">
          Already have an account? <span onClick={onGoToLogin}>Sign in</span>
        </p>
      </div>
    </div>
  );
}

export default Signup;