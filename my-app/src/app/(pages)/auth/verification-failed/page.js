'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import './page.css';

export default function VerificationFailed() {
  return (
    <div className="verification-result-container">
      <motion.div 
        className="verification-result-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="error-icon">
          <svg viewBox="0 0 24 24" fill="none" className="crossmark">
            <path 
              d="M18 6L6 18M6 6l12 12" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
        </div>
        
        <h1>Verification Failed</h1>
        <p>We couldn't verify your email address. The link might be expired or invalid.</p>

        <div className="action-buttons">
          <Link href="/auth/ngo-login" className="login-button">
            Back to Login
          </Link>
          <button className="resend-button">
            Resend Verification Email
          </button>
        </div>
      </motion.div>
    </div>
  );
} 