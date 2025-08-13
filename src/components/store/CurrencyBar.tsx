import React, { useMemo } from 'react';
import { CURRENCY_IDS, WalletResponse } from '../../types';

type Props = {
  wallet: WalletResponse | null;
};

const CurrencyBar: React.FC<Props> = ({ wallet }) => {
  const balances = wallet?.Balances;

  const items = useMemo(() => {
    if (!balances) return [];
    return [
      {
        id: CURRENCY_IDS.VALORANT_POINTS,
        label: 'VP',
        name: 'Valorant Points',
        amount: balances[CURRENCY_IDS.VALORANT_POINTS] ?? 0,
        gradient: 'linear-gradient(135deg, #ff4655 0%, #ff6b35 100%)',
      },
      {
        id: CURRENCY_IDS.RADIANITE,
        label: 'R',
        name: 'Radianite',
        amount: balances[CURRENCY_IDS.RADIANITE] ?? 0,
        gradient: 'linear-gradient(135deg, #16a085 0%, #2ecc71 100%)',
      },
      {
        id: CURRENCY_IDS.KINGDOM_CREDITS,
        label: 'KC',
        name: 'Kingdom Credits',
        amount: balances[CURRENCY_IDS.KINGDOM_CREDITS] ?? 0,
        gradient: 'linear-gradient(135deg, #3498db 0%, #9b59b6 100%)',
  },
    ];
  }, [balances]);

  if (!items.length) return null;

  return (
    <section className="currency-section" aria-label="Wallet balances">
      <div className="currency-grid">
        {items.map((c) => (
          <div key={c.id} className="currency-card">
            <div className="currency-badge" style={{ background: c.gradient }}>
              {c.label}
            </div>
            <div className="currency-info">
              <div className="currency-name">{c.name}</div>
              <div className="currency-amount">{c.amount.toLocaleString()}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CurrencyBar;
