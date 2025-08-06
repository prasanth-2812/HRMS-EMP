import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './LoginPage.css';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [cardVisible, setCardVisible] = useState(false);

  React.useEffect(() => {
    setTimeout(() => setCardVisible(true), 100);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitted(true);
      setIsLoading(false);
    }, 1000);
  };

  if (isSubmitted) {
    return (
      <div className="login-bg-light">
        <div className="login-container">
          <div className={`login-card${cardVisible ? ' login-card--visible' : ''}`}>
            <h1 className="login-title">Check Your Email</h1>
            <p className="login-subtitle">
              We've sent a password reset link to <strong>{email}</strong>
            </p>
            
            <div className="success-message">
              <svg width="48" height="48" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="success-icon">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p>Please check your email and click the reset link to continue.</p>
            </div>
            
            <div className="form-footer">
              <Link to="/login" className="forgot-password-link">
                Back to Login
              </Link>
            </div>
          </div>
          
          <div className="login-logo">
            <img src="/logo.svg" alt="SYNC" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="login-bg-light">
      <div className="login-container">
        <div className={`login-card${cardVisible ? ' login-card--visible' : ''}`}>
          <h1 className="login-title">Forgot Password</h1>
          <p className="login-subtitle">
            Enter your email address and we'll send you a link to reset your password.
          </p>
          
          <form className="login-form" onSubmit={handleSubmit} autoComplete="off">
            <div className="form-group">
              <label htmlFor="email" className="form-label">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                className="form-input"
                placeholder="e.g. john.doe@SYNC.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoFocus
              />
            </div>
            
            <button
              type="submit"
              className="login-btn"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="login-spinner"></span>
              ) : (
                <>
                  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="btn-icon">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Send Reset Link
                </>
              )}
            </button>
            
            <div className="form-footer">
              <Link to="/login" className="forgot-password-link">
                Back to Login
              </Link>
            </div>
          </form>
        </div>
        
        <div className="login-logo">
          <img src="/logo.svg" alt="SYNC" />
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
