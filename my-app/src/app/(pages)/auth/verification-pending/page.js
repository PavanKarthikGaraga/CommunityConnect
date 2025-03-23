'use client';
import { motion } from 'framer-motion';
import { FiMail, FiArrowLeft, FiRefreshCw } from 'react-icons/fi';
import Link from 'next/link';
import './page.css';

export default function VerificationPending() {
  return (
    <div className="verification-container">
      <motion.div 
        className="verification-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="verification-icon">
          <FiMail size={50} />
        </div>
        
        <h1>Check Your Email</h1>
        <p>
          We've sent a verification link to your email address. Please check your inbox and click the link to verify your NGO account.
        </p>

        <div className="verification-info">
          <h3>Next steps:</h3>
          <ul>
            <li>Open your email inbox</li>
            <li>Look for an email from CommunityConnect</li>
            <li>Click the verification link in the email</li>
            <li>Return to login once verified</li>
          </ul>
        </div>

        <div className="verification-actions">
          <p className="resend-info">
            Didn't receive the email? Check your spam folder or
            <button className="resend-button">
              <FiRefreshCw /> Resend verification email
            </button>
          </p>
        </div>

        <Link href="/auth/ngo-login" className="back-to-login">
          <FiArrowLeft />
          Back to Login
        </Link>
      </motion.div>
    </div>
  );
} 