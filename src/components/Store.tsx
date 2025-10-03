import React, { useMemo, useEffect } from 'react';
import useStoreData from '../hooks/useStoreData';
import useTimer from '../hooks/useTimer';
import LoadingScreen from './common/LoadingScreen';
import StoreCountdown from './store/StoreCountdown';
import StoreItems from './store/StoreItems';
import { processStoreData } from '../store/processStoreData';

interface StoreProps {
    registerRefetch: (fn: () => void) => void;
}

const Store: React.FC<StoreProps> = ({ registerRefetch }) => {
  const { store, skinData, isLoading, error, refetch } = useStoreData();

  useEffect(() => registerRefetch(() => refetch), [registerRefetch, refetch]);

  const processedStore = useMemo(() => {
    if (!store || !skinData.length) return null;
    return processStoreData(store, skinData);
  }, [store, skinData]);

  const timeRemaining = useTimer(processedStore?.timeUntilReset || 0);

  if (isLoading) return <LoadingScreen message="Loading your store..." />;

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center px-6">
        <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-10 text-center shadow-2xl backdrop-blur-2xl">
          <h2 className="text-2xl font-semibold text-white">Something went wrong</h2>
          <p className="mt-3 text-white/70">{error}</p>
          <button
            onClick={refetch}
            className="mt-8 inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-[#ff4655] to-[#ff6b35] px-6 py-3 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_10px_30px_rgba(255,70,85,0.3)] focus:outline-none focus:ring-2 focus:ring-[#ff6b35]/60 focus:ring-offset-2 focus:ring-offset-transparent"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <main className="mx-auto flex w-full max-w-[1400px] flex-1 flex-col gap-12 px-4 py-10 sm:px-8">
        <StoreCountdown timeRemaining={timeRemaining} />
        <section className="space-y-8">
          <h3 className="text-center text-2xl font-semibold text-white">Daily Store</h3>
          <StoreItems items={processedStore?.dailyStore || []} />
        </section>
        {processedStore?.nightMarket?.length ? (
          <section className="space-y-8">
            <h3 className="text-center text-2xl font-semibold text-white">Night Market</h3>
            <StoreItems items={processedStore.nightMarket} />
          </section>
        ) : null}
      </main>
    </div>
  );
};

export default Store;
