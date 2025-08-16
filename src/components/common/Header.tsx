import React from 'react';
import { PlayerInfoResponse } from '../../types';

interface Props {
  user: PlayerInfoResponse | null;
  onRefresh: () => void;
  onHome: () => void;
}

const Header: React.FC<Props> = ({ user, onRefresh, onHome }) => (
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
        <button className="refresh-button" onClick={onRefresh} title="Refresh">
          ↻
        </button>
        <button className="home-button" onClick={onHome} title="Home">
          ⌂
        </button>
      </div>
    </div>
  </header>
);

export default Header;
