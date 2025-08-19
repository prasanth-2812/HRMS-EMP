import React from 'react';
import './LoadingSpinner.css';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'secondary' | 'white';
  className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  color = 'primary', 
  className = '' 
}) => {
  return (
    <div 
      className={`loading-spinner loading-spinner--${size} loading-spinner--${color} ${className}`}
      role="status"
      aria-label="Loading"
    >
      <div className="loading-spinner__circle"></div>
      <span className="sr-only">Loading...</span>
    </div>
  );
};

export default LoadingSpinner;