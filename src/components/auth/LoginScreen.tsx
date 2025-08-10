import React from 'react';

interface Props {
  onLogin: () => void;
}

const LoginScreen: React.FC<Props> = ({ onLogin }) => (
  <div className="login-container">
    <div className="login-card">
      <div className="logo-section">
        <h1 className="app-title">Valorant Store</h1>
        <p className="app-subtitle">Track your daily shop rotation</p>
      </div>
      <button className="login-button" onClick={onLogin}>
        <span className="login-icon">🔐</span>
        Continue with Riot Games
      </button>
    </div>
  </div>
);

export default LoginScreen;
