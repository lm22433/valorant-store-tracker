import React from 'react';
import { PlayerInfoResponse } from '../../types';

interface Props {
  user: PlayerInfoResponse | null;
  onRefresh: () => void;
}

const Header: React.FC<Props> = ({ user, onRefresh }) => (
  <header className="header">
    <div className="header-content">
      <div className="user-info">
        <div className="avatar">
          {user?.username?.charAt(0).toUpperCase() || 'A'}
        </div>
        <div className="user-details">
          <h2 className="welcome-text">Welcome back</h2>
          <p className="username">{user?.username || 'Agent'}</p>
        </div>
      </div>
      <div className="header-actions">
        <button className="refresh-button" onClick={onRefresh} title="Refresh Store">
          ↻
        </button>
      </div>
    </div>
  </header>
);

export default Header;
