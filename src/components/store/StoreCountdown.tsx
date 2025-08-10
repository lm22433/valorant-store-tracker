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
    <section className="countdown-section">
      <div className="countdown-card">
        <div className="countdown-content">
          <h3 className="countdown-title">Store Rotation</h3>
          <p className="countdown-subtitle">Next refresh in</p>
          <div className="countdown-display">
            {timeUnits.map((unit, index) => (
              <div key={index} className="time-unit">
                <span className="time-number">{unit.value}</span>
                <span className="time-label">{unit.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default StoreCountdown;
