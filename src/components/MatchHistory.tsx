import React, {useCallback} from 'react';
import Matches from './history/Matches';
import useHistoryData from '../hooks/useHistoryData';
import LoadingScreen from './common/LoadingScreen';
import Header from './store/Header';

const History: React.FC<{onHome: () => void}> = ({onHome}: {onHome: () => void}) => {

    const { user, history, isLoading, error, refetch } = useHistoryData();

    const handleRefresh = useCallback(() => {
        refetch();
    }, [refetch]);

    if (isLoading) return <LoadingScreen message="Loading your matches..." />;

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
                <h1>Match History</h1>
                <Matches ids={history!.History}/>
            </main>
        </div>
    );
}

export default History;