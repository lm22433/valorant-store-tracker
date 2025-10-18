import React from 'react';

const LoadingScreen: React.FC<{ message?: string }> = ({ message = 'Loading...' }) => (
  <div className="flex min-h-screen items-center justify-center">
    <div className="text-center">
      <div className="mx-auto mb-8 h-16 w-16 animate-spin rounded-full border-[3px] border-white/10 border-t-[#ff4655]"></div>
      <h2 className="text-xl font-semibold">{message}</h2>
      <p className="text-white/60">Fetching the latest items and deals</p>
    </div>
  </div>
);

export default LoadingScreen;
