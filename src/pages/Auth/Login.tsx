
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../contexts/AuthContext';
import './LoginPage.css';

const LoginPage: React.FC = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoading, error, isAuthenticated } = useAuthContext();
  const [cardVisible, setCardVisible] = useState(false);
  const navigate = useNavigate();

  React.useEffect(() => {
    setTimeout(() => setCardVisible(true), 100);
  }, []);

  // Redirect to dashboard if already authenticated
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login({
        username: credentials.username,
        password: credentials.password
      });
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="login-bg-light">
      <div className="login-container">
        <div className={`login-card${cardVisible ? ' login-card--visible' : ''}`}>
          <h1 className="login-title">Sign In</h1>
          <p className="login-subtitle">Please login to access the dashboard.</p>
          
          <form className="login-form" onSubmit={handleSubmit} autoComplete="off">
            {error && <div className="login-error">{error}</div>}
            
            <div className="form-group">
              <label htmlFor="username" className="form-label">Username</label>
              <input
                type="text"
                id="username"
                name="username"
                className="form-input"
                placeholder="e.g. adam.luis@horilla.com"
                value={credentials.username}
                onChange={handleChange}
                required
                autoFocus
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="password" className="form-label">Password</label>
              <div className="password-input-container">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  className="form-input password-input"
                  placeholder="Use alphanumeric characters"
                  value={credentials.password}
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={togglePasswordVisibility}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                    </svg>
                  ) : (
                    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
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
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                  Secure Sign-in
                </>
              )}
            </button>
            
            <div className="form-footer">
              <Link to="/forgot-password" className="forgot-password-link">
                Forgot password?
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

export default LoginPage;
