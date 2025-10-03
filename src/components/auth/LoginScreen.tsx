import React from 'react';

interface Props {
  onLogin: () => void;
}

const LoginScreen: React.FC<Props> = ({ onLogin }) => (
  <div className="flex min-h-screen items-center justify-center p-8">
    <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 px-10 py-12 text-center shadow-[0_20px_60px_rgba(0,0,0,0.3)] backdrop-blur-2xl">
      <div className="mb-10">
        <h1 className="mb-2 text-4xl font-bold bg-gradient-to-r from-[#ff4655] to-[#ff6b35] bg-clip-text text-transparent">
          Valorant Store
        </h1>
        <p className="text-sm text-white/70">Track your daily shop rotation</p>
      </div>
      <button
        className="group inline-flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-[#ff4655] to-[#ff6b35] px-6 py-4 text-lg font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_10px_30px_rgba(255,70,85,0.4)] focus:outline-none focus:ring-2 focus:ring-[#ff6b35]/60 focus:ring-offset-2 focus:ring-offset-transparent"
        onClick={onLogin}
      >
        <span className="text-xl">🔐</span>
        Continue with Riot Games
      </button>
    </div>
  </div>
);

export default LoginScreen;
