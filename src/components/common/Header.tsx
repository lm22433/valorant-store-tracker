import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { PlayerInfoResponse } from '../../types';

interface Props {
  user: PlayerInfoResponse | null;
  onRefresh: () => void;
  onHome: () => void;
  onLogout: () => void;
}

const Header: React.FC<Props> = ({ user, onRefresh, onHome, onLogout }) => {
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  useEffect(() => {
    if (!showLogoutConfirm) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        setShowLogoutConfirm(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [showLogoutConfirm]);

  return (
    <>
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
            <button
              className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-xl text-white transition duration-200 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/30"
              onClick={() => setShowLogoutConfirm(true)}
              title="Logout"
            >
              →
            </button>
          </div>
        </div>
      </header>

      {showLogoutConfirm && ReactDOM.createPortal(
        <div className="fixed inset-0 z-50" role="dialog" aria-modal>
          <div className="absolute inset-0 bg-black/60" onClick={() => setShowLogoutConfirm(false)} />
          <div className="absolute inset-0 flex items-center justify-center p-4">
            <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/10 p-5 text-white backdrop-blur-md shadow-2xl">
              <h2 className="mb-2 text-lg font-semibold">Log out?</h2>
              <p className="mb-4 text-sm text-white/80">You will need to sign in again to access your store and match data.</p>
              <div className="flex justify-end gap-3">
                <button onClick={() => setShowLogoutConfirm(false)} className="rounded-md border border-white/20 bg-white/10 px-3 py-2 text-sm hover:bg-white/15">Cancel</button>
                <button
                  onClick={() => { setShowLogoutConfirm(false); onLogout(); }}
                  className="rounded-md border border-rose-400/40 bg-rose-500/20 px-3 py-2 text-sm text-rose-100 hover:bg-rose-500/30"
                  autoFocus
                >
                  Log out
                </button>
              </div>
            </div>
          </div>
        </div>, document.body)}
    </>
  );
};

export default Header;
