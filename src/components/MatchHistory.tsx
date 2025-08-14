import React from 'react';
import Match from './history/Match';
import useHistoryData from '../hooks/useHistoryData';
import LoadingScreen from './common/LoadingScreen';

interface HistoryProps {
    registerRefetch: (fn: () => void) => void;
}

const History: React.FC<HistoryProps> = ({ registerRefetch }) => {

    const { user, matches, isLoading, error, refetch } = useHistoryData();
    registerRefetch(() => refetch);


    if (isLoading) return <LoadingScreen message="Loading your matches..." />;

    if (error) {
        return (
        <div className="error-container">
            <div className="error-card">
            <h2>Something went wrong</h2>
                <p>{error}</p>
            <button onClick={refetch} className="retry-button">Try Again</button>
            </div>
        </div>
        );
    }

    return (
        <div className="home">
            <main className="main-content">
                <h1>Match History</h1>
                {matches.map((match) => <Match key={match.matchInfo.matchId} match={match} user={user}/>)}
            </main>
        </div>
    );
}

export default History;