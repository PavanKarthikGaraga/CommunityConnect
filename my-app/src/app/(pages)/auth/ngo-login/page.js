'use client';
import { useState } from 'react';
import { useAuth } from '@/AuthContext/AuthContext';
import { useRouter } from 'next/navigation';
import { Toaster, toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { FiUser, FiMail, FiGlobe, FiLock, FiBriefcase } from 'react-icons/fi';
import LoadingSpinner from '@/components/LoadingSpinner';
import './page.css';

export default function NGOAuthPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [accountType, setAccountType] = useState('NGO');
  const [formData, setFormData] = useState({
    organizationName: '',
    email: '',
    website: '',
    representativeName: '',
    password: '',
    confirmPassword: '',
    department: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const result = await login(formData.email, formData.password);
        
        if (result.success) {
          toast.success('Welcome back!');
          router.push(`/dashboard/${accountType}`);
        } else {
          toast.error(result.error || 'Invalid credentials');
        }
      } else {
        if (formData.password !== formData.confirmPassword) {
          toast.error('Passwords do not match');
          setLoading(false);
          return;
        }

        const registrationData = {
          organizationName: formData.organizationName,
          email: formData.email,
          website: formData.website,
          representativeName: formData.representativeName,
          password: formData.password,
          role: accountType,
          department: accountType === 'Government' ? formData.department : undefined
        };

        console.log('Sending registration data:', {
          ...registrationData,
          password: '[REDACTED]'
        });

        const response = await fetch('/api/auth/ngo/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(registrationData)
        });

        const data = await response.json();

        if (response.ok) {
          toast.success('Registration successful!');
          router.push('/auth/verification-pending');
        } else {
          toast.error(data.error || 'Registration failed');
        }
      }
    } catch (err) {
      console.error('Auth error:', err);
      toast.error('An error occurred');
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

  return (
    <div className="ngo-auth-container">
      <Toaster position="top-right" />
      
      <div className="ngo-auth-content">
        <motion.div 
          className="ngo-auth-animation"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="animation-content">
            <div className="floating-shapes">
              <div className="shape shape-1"></div>
              <div className="shape shape-2"></div>
              <div className="shape shape-3"></div>
            </div>
            <h2>{isLogin ? 'Welcome Back!' : 'Join Our Community'}</h2>
            <p>Empowering NGOs to create lasting social impact</p>
          </div>
        </motion.div>

        <motion.div 
          className="ngo-auth-card"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="auth-header">
            <h1>{isLogin ? 'Organization Login' : 'Organization Registration'}</h1>
            
            <div className="account-type-selector">
              <button 
                type="button"
                className={`type-btn ${accountType === 'NGO' ? 'active' : ''}`}
                onClick={() => setAccountType('NGO')}
              >
                NGO
              </button>
              <button 
                type="button"
                className={`type-btn ${accountType === 'Government' ? 'active' : ''}`}
                onClick={() => setAccountType('Government')}
              >
                Government
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="ngo-auth-form">
            {!isLogin && (
              <>
                <div className="form-group">
                  <div className="input-icon">
                    <input
                      type="text"
                      placeholder={`${accountType} Organization Name`}
                      name="organizationName"
                      value={formData.organizationName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                {accountType === 'Government' && (
                  <div className="form-group">
                    <div className="input-icon">
                      <input
                        type="text"
                        placeholder="Department Name"
                        name="department"
                        value={formData.department}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                )}

                <div className="form-group">
                  <div className="input-icon">
                    <input
                      type="url"
                      placeholder="Website"
                      name="website"
                      value={formData.website}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <div className="input-icon">
                    <input
                      type="text"
                      placeholder="Representative Name"
                      name="representativeName"
                      value={formData.representativeName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
              </>
            )}

            <div className="form-group">
              <div className="input-icon">
                <input
                  type="email"
                  placeholder={`${accountType} Email`}
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <div className="input-icon">
                <input
                  type="password"
                  placeholder="Password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {!isLogin && (
              <div className="form-group">
                <div className="input-icon">
                  <input
                    type="password"
                    placeholder="Confirm Password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            )}

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? <LoadingSpinner /> : (isLogin ? 'Login' : 'Register')}
            </button>
          </form>

          <div className="auth-switch">
            <button 
              className="switch-btn"
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin ? "Don't have an account? Register" : "Already registered? Login"}
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
