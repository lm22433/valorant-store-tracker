import React from 'react';
import { PlayerInfoResponse } from '../../types';

interface Props {
  user: PlayerInfoResponse | null;
  onRefresh: () => void;
  onHome: () => void;
}

const Header: React.FC<Props> = ({ user, onRefresh, onHome }) => (
  <header className="border-b border-white/10 bg-white/5 px-6 py-6 backdrop-blur-xl">
    <div className="mx-auto flex max-w-[1400px] items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#ff4655] to-[#ff6b35] text-lg font-bold text-white">
          {user?.username?.charAt(0).toUpperCase() || 'A'}
        </div>
        <div className="flex flex-col">
          <h2 className="text-sm font-medium text-white/60">Welcome back</h2>
          <p className="text-lg font-semibold text-white">{user?.username || 'Agent'}</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <button
          className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-lg text-white transition-transform duration-300 hover:bg-white/10 hover:text-white hover:rotate-180 focus:outline-none focus:ring-2 focus:ring-white/30"
          onClick={onRefresh}
          title="Refresh Store"
        >
          ↻
        </button>
        <button
          className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-xl text-white transition duration-200 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/30"
          onClick={onHome}
          title="Home"
        >
          ⌂
        </button>
      </div>
    </div>
  </header>
);

export default Header;
