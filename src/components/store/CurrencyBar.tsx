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
        bgGradient: 'from-[#ff4655] to-[#ff6b35]',
      },
      {
        id: CURRENCY_IDS.RADIANITE,
        label: 'R',
        name: 'Radianite',
        amount: balances[CURRENCY_IDS.RADIANITE] ?? 0,
        bgGradient: 'from-[#16a085] to-[#2ecc71]',
      },
      {
        id: CURRENCY_IDS.KINGDOM_CREDITS,
        label: 'KC',
        name: 'Kingdom Credits',
        amount: balances[CURRENCY_IDS.KINGDOM_CREDITS] ?? 0,
        bgGradient: 'from-[#3498db] to-[#9b59b6]',
      },
    ];
  }, [balances]);

  if (!items.length) return null;

  return (
    <section aria-label="Wallet balances">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((c) => (
          <div
            key={c.id}
            className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-2xl transition-all duration-300 hover:border-white/20 hover:bg-white/[0.07]"
          >
            <div
              className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${c.bgGradient} text-lg font-bold text-white shadow-lg`}
            >
              {c.label}
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-white/70">{c.name}</span>
              <span className="text-xl font-bold text-white">{c.amount.toLocaleString()}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CurrencyBar;
