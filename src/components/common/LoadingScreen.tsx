import React from 'react';

const LoadingScreen: React.FC<{ message?: string }> = ({ message = 'Loading...' }) => (
  <div className="loading-screen">
    <div className="loading-content">
      <div className="loading-spinner"></div>
      <h2>{message}</h2>
      <p>Fetching the latest items and deals</p>
    </div>
  </div>
);

export default LoadingScreen;
