'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import './page.css';

export default function VerificationSuccess() {
  return (
    <div className="verification-result-container">
      <motion.div 
        className="verification-result-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="success-icon">
          <svg viewBox="0 0 24 24" fill="none" className="checkmark">
            <path 
              d="M20 6L9 17L4 12" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
        </div>
        
        <h1>Email Verified Successfully!</h1>
        <p>Your account has been successfully verified. You can now log in to access your dashboard.</p>

        <Link href="/auth/ngo-login" className="login-button">
          Go to Login
        </Link>
      </motion.div>
    </div>
  );
} 