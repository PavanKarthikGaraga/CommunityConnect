'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import '../auth-shared.css';
import './page.css';

export default function ResetPasswordPage() {
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password === formData.confirmPassword) {
      // Add your password reset logic here
      setIsSubmitted(true);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="auth-container">
      <div className="auth-content">
        {/* Left Side */}
        <motion.div 
          className="auth-hero"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="hero-content">
            <motion.h1
              className="hero-title"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              Create Your<br/>
              <span className="gradient-text">New Password</span>
            </motion.h1>

            <motion.p
              className="hero-description"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              Choose a strong password to protect your account and continue making positive impact in your community.
            </motion.p>
          </div>
        </motion.div>

        {/* Right Side - Form */}
        <motion.div 
          className="auth-form-container"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="auth-card">
            {!isSubmitted ? (
              <>
                <div className="auth-header">
                  <h2>Reset Password</h2>
                  <p>Enter your new password below</p>
                </div>

                <form onSubmit={handleSubmit} className="auth-form">
                  <div className="form-group">
                    <label htmlFor="password">New Password</label>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      placeholder="Enter new password"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="confirmPassword">Confirm Password</label>
                    <input
                      type="password"
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                      placeholder="Confirm new password"
                    />
                  </div>

                  <div className="password-requirements">
                    <h4>Password Requirements:</h4>
                    <ul>
                      <li className={formData.password.length >= 8 ? 'valid' : ''}>
                        At least 8 characters
                      </li>
                      <li className={/[A-Z]/.test(formData.password) ? 'valid' : ''}>
                        One uppercase letter
                      </li>
                      <li className={/[0-9]/.test(formData.password) ? 'valid' : ''}>
                        One number
                      </li>
                      <li className={/[!@#$%^&*]/.test(formData.password) ? 'valid' : ''}>
                        One special character
                      </li>
                    </ul>
                  </div>

                  <button type="submit" className="btn btn-primary auth-submit">
                    Reset Password
                  </button>
                </form>
              </>
            ) : (
              <div className="success-message">
                <div className="success-icon">✓</div>
                <h2>Password Reset Successful!</h2>
                <p>Your password has been successfully updated.</p>
                <a href="/auth/login" className="btn btn-primary auth-submit">
                  Continue to Login
                </a>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}