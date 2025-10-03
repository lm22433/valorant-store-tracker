import React, { useState, useEffect, useMemo } from 'react';
import Match from './history/Match';
import useHistoryData from '../hooks/useHistoryData';
import LoadingScreen from './common/LoadingScreen';
import { processMatchData } from '../history/processHistoryData';

interface HistoryProps {
    registerRefetch: (fn: () => void) => void;
}

const History: React.FC<HistoryProps> = ({ registerRefetch }) => {

    const [queueID, setQueueID] = useState<string>("");
    const { user, matches, maps, agents, isLoading, error, refetch } = useHistoryData(queueID);
    
    useEffect(() => registerRefetch(() => refetch), [registerRefetch, refetch]);

    const processedMatches = useMemo(() => {
        if (!matches || !user || !maps.length || !agents.length) return null;
        return matches.map(match => processMatchData(match, user, maps, agents));
      }, [matches]);
    

    if (isLoading) return <LoadingScreen message="Loading your matches..." />;

    if (error) {
        return (
        <div className="flex min-h-screen items-center justify-center px-6">
            <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-10 text-center shadow-2xl backdrop-blur-2xl">
            <h2 className="text-2xl font-semibold text-white">Something went wrong</h2>
                <p className="mt-3 text-white/70">{error}</p>
            <button onClick={refetch} className="mt-8 inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-[#ff4655] to-[#ff6b35] px-6 py-3 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_10px_30px_rgba(255,70,85,0.3)] focus:outline-none focus:ring-2 focus:ring-[#ff6b35]/60 focus:ring-offset-2 focus:ring-offset-transparent">Try Again</button>
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
                    {processedMatches && processedMatches.length > 0 ?
                        processedMatches.map((match) => <Match match={match}/>)
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