import React, { useState } from 'react';
import Match from './history/Match';
import useHistoryData from '../hooks/useHistoryData';
import LoadingScreen from './common/LoadingScreen';

interface HistoryProps {
    registerRefetch: (fn: () => void) => void;
}

const History: React.FC<HistoryProps> = ({ registerRefetch }) => {

    const [queueID, setQueueID] = useState<string>("");
    const { user, matches, isLoading, error, refetch } = useHistoryData(queueID);
    
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
                <section className="history-top-row">
                    <h1>Match History</h1>
                    <div className="match-filter">
                        <select 
                            name="queueId"
                            value={queueID}
                            onChange={e => {setQueueID(e.target.value);}}
                        >
                            <option value="">All</option>
                            <option value="unrated">Unrated</option>
                            <option value="competitive">Competitive</option>
                            <option value="deathmatch">Deathmatch</option>
                            <option value="spikerush">Spike Rush</option>
                            <option value="swiftplay">Swiftplay</option>
                        </select>
                    </div>
                </section>
                <section className="match-list">
                    {matches.length > 0 ? matches.map((match) => <Match key={match.matchInfo.matchId} match={match} user={user}/>)
                    :
                    <div className="no-matches">
                        <h2>No Matches to Display</h2>
                    </div>}
                </section>
            </main>
        </div>
    );
}

export default History;