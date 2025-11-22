import React from 'react';
import './LoadingSpinner.css';

const LoadingSpinner = () => {
  return (
    <div className="loading-spinner-container" data-testid="loading-spinner">
      <div className="spinner"></div>
      <p className="loading-text">Loading characters...</p>
    </div>
  );
};

export default LoadingSpinner;

