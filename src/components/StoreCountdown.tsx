import React, { useMemo } from 'react';

interface Props {
  timeRemaining: string;
}

const StoreCountdown: React.FC<Props> = ({ timeRemaining }) => {
  const timeUnits = useMemo(() => {
    return timeRemaining.split(':').map((unit, index) => ({
      value: unit,
      label: index === 0 ? 'HRS' : index === 1 ? 'MIN' : 'SEC'
    }));
  }, [timeRemaining]);

  return (
  <section>
      <div className="rounded-3xl border border-white/10 bg-white/5 p-10 text-center backdrop-blur-2xl">
        <h3 className="text-xl font-semibold text-white">Store Rotation</h3>
        <p className="mt-2 text-white/60">Next refresh in</p>
        <div className="mt-8 flex justify-center gap-8 md:gap-12">
          {timeUnits.map((unit, index) => (
            <div key={index} className="flex flex-col items-center">
              <span className="bg-gradient-to-r from-[#ff4655] to-[#ff6b35] bg-clip-text text-4xl font-bold text-transparent md:text-5xl">
                {unit.value}
              </span>
              <span className="mt-2 text-xs font-medium tracking-[0.3em] text-white/50">
                {unit.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StoreCountdown;
