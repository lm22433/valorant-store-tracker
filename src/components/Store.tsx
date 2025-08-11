import React, { useCallback, useMemo } from 'react';
import useStoreData from '../hooks/useStoreData';
import useTimer from '../hooks/useTimer';
import LoadingScreen from './common/LoadingScreen';
import Header from './store/Header';
import StoreCountdown from './store/StoreCountdown';
import StoreItems from './store/StoreItems';
import { processStoreData } from '../store/processStoreData';

const Store: React.FC<{onHome: () => void}> = ({onHome}: {onHome: () => void}) => {
  const { user, store, skinData, isLoading, error, refetch } = useStoreData();

  const processedStore = useMemo(() => {
    if (!store || !skinData.length) return null;
    return processStoreData(store, skinData);
  }, [store, skinData]);

  const timeRemaining = useTimer(processedStore?.timeUntilReset || 0);

  const handleRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  if (isLoading) return <LoadingScreen message="Loading your store..." />;

  if (error) {
    return (
      <div className="error-container">
        <div className="error-card">
          <h2>Something went wrong</h2>
            <p>{error}</p>
          <button onClick={handleRefresh} className="retry-button">Try Again</button>
        </div>
      </div>
    );
  }

  return (
    <div className="home">
      <Header user={user} onRefresh={handleRefresh} onHome={onHome} />
      <main className="main-content">
        <StoreCountdown timeRemaining={timeRemaining} />
        <section className="store-section">
          <h3 className="section-title">Daily Store</h3>
          <StoreItems items={processedStore?.dailyStore || []} />
        </section>
        {processedStore?.nightMarket?.length ? (
          <section className="store-section">
            <h3 className="section-title">Night Market</h3>
            <StoreItems items={processedStore.nightMarket} />
          </section>
        ) : null}
      </main>
    </div>
  );
};

export default Store;
