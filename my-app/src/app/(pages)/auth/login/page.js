'use client';
import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { FcGoogle } from 'react-icons/fc';
import { motion } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';
import '../auth-shared.css';
import './page.css';
import { useAuth } from '@/AuthContext/AuthContext';

// Separate component for the error handling
function ErrorHandler() {
  const searchParams = useSearchParams();
  
  useEffect(() => {
    const error = searchParams.get('error');
    if (error) {
      if (error === 'AuthFailed') {
        toast.error('Authentication failed. Please try again.');
      } else {
        toast.error('An error occurred during authentication.');
      }
    }
  }, [searchParams]);

  return null;
}

export default function AuthPage() {
  const router = useRouter();
  const { login, register } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const loadingToast = toast.loading('Signing in...');
        const result = await login(formData.email, formData.password);
        
        if (result.success) {
          toast.success('Successfully signed in!', { id: loadingToast });
        } else {
          toast.error(result.error || 'Sign in failed', { id: loadingToast });
        }
      } else {
        if (formData.password !== formData.confirmPassword) {
          toast.error('Passwords do not match');
          return;
        }

        const loadingToast = toast.loading('Creating account...');
        const result = await register({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: 'Volunteer'
        });

        if (result.success) {
          toast.success('Account created successfully!', { id: loadingToast });
        } else {
          toast.error(result.error || 'Registration failed', { id: loadingToast });
        }
      }
    } catch (err) {
      toast.error(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleGoogleSignIn = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/google`;
  };

  return (
    <>
      <Suspense fallback={null}>
        <ErrorHandler />
      </Suspense>
      <div className="auth-container">
        <Toaster position="top-center" />
        <div className="auth-content">
          {/* Left Side - Hero Section */}
          <motion.div 
            className="auth-hero"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="hero-content">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <span className="hero-badge">
                  <span className="pulse-dot"></span>
                  5000+ Volunteers Making Impact
                </span>
              </motion.div>

              <motion.h1
                className="hero-title"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                Make Change.<br/>
                Create Impact.<br/>
                <span className="gradient-text">Build Community.</span>
              </motion.h1>

              <motion.p
                className="hero-description"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                Join a network of changemakers transforming communities through 
                meaningful collaboration and innovative social initiatives.
              </motion.p>
            </div>
          </motion.div>

          {/* Right Side - Auth Form */}
          <motion.div 
            className="auth-form-container"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="auth-card">
              <div className="auth-header">
                <h2>{isLogin ? 'Welcome Back!' : 'Create Account'}</h2>
                <p>{isLogin ? 'Continue your journey of impact' : 'Start making a difference today'}</p>
              </div>

              <form onSubmit={handleSubmit} className="auth-form">
                {!isLogin && (
                  <motion.div 
                    className="form-group"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <label htmlFor="name">Full Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required={!isLogin}
                      disabled={loading}
                      placeholder="Enter your full name"
                    />
                  </motion.div>
                )}

                <div className="form-group">
                  <label htmlFor="email">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="Enter your email"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="password">Password</label>
                  <div className="password-input">
                    <input
                      type="password"
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      placeholder="Enter your password"
                    />
                  </div>
                </div>

                {!isLogin && (
                  <motion.div 
                    className="form-group"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <label htmlFor="confirmPassword">Confirm Password</label>
                    <input
                      type="password"
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required={!isLogin}
                      placeholder="Confirm your password"
                    />
                  </motion.div>
                )}

                <button 
                  type="submit" 
                  className="btn btn-primary auth-submit"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="loading-spinner"></span>
                  ) : (
                    isLogin ? 'Sign In' : 'Create Account'
                  )}
                </button>

                <div className="auth-divider">
                  <span>or continue with</span>
                </div>

                <button 
                  type="button"
                  onClick={handleGoogleSignIn}
                  className="btn btn-outline google-btn"
                  disabled={loading}
                >
                  <FcGoogle className="google-icon" />
                  Continue with Google
                </button>

                <p className="auth-switch">
                  {isLogin ? "Don't have an account? " : "Already have an account? "}
                  <button
                    type="button"
                    className="switch-btn"
                    onClick={() => setIsLogin(!isLogin)}
                  >
                    {isLogin ? 'Sign Up' : 'Sign In'}
                  </button>
                </p>
                <p className="auth-switch-links">
                  <Link href="/auth/forgot-password">Forgot Password?</Link>
                  <Link href="/auth/ngo-login">Orgonisation Login</Link>
                </p>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
} 