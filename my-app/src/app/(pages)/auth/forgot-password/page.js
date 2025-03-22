'use client';
import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import '../auth-shared.css';
import './page.css';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const loadingToast = toast.loading('Sending reset instructions...');

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success('Reset instructions sent!', { id: loadingToast });
        setIsSubmitted(true);
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      toast.error(error.message || 'Failed to send reset instructions', { id: loadingToast });
    } finally {
      setLoading(false);
    }
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
              Recover Your<br/>
              <span className="gradient-text">Account Access</span>
            </motion.h1>

            <motion.p
              className="hero-description"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              Don&apos;t worry, we&apos;ll help you get back to making impact. 
              Enter your email and we&apos;ll send you instructions to reset your password.
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
                  <h2>Forgot Password?</h2>
                  <p>Enter your email to receive reset instructions</p>
                </div>

                <form onSubmit={handleSubmit} className="auth-form">
                  <div className="form-group">
                    <label htmlFor="email">Email Address</label>
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="Enter your email"
                    />
                  </div>

                  <button type="submit" className="btn btn-primary auth-submit" disabled={loading}>
                    {loading ? 'Sending...' : 'Send Reset Instructions'}
                  </button>

                  <Link href="/auth/login" className="auth-back-link">
                    ← Back to Login
                  </Link>
                </form>
              </>
            ) : (
              <div className="success-message">
                <div className="success-icon">✓</div>
                <h2>Check Your Email</h2>
                <p>
                  We&apos;ve sent password reset instructions to:<br/>
                  <strong>{email}</strong>
                </p>
                <p className="note">
                  Don&apos;t see the email? Check your spam folder or
                  <button 
                    className="resend-link"
                    onClick={handleSubmit}
                  >
                    click here to resend
                  </button>
                </p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}