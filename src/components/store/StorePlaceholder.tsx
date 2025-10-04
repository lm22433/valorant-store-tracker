import React from 'react';

const StorePlaceholder: React.FC = () => (
  <div className="flex h-full flex-col rounded-3xl border border-white/10 bg-white/[0.06] p-6 animate-pulse">
    <div className="flex flex-1 flex-col">
      <div className="mb-6 h-40 w-full rounded-2xl bg-white/10" />
      <div className="mt-auto space-y-3 text-center">
        <div className="mx-auto h-5 w-full rounded-full bg-white/10" />
        <div className="mx-auto h-5 w-2/3 rounded-full bg-white/10" />
      </div>
    </div>
  </div>
);

export default StorePlaceholder;
