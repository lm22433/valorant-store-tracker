import React, { useState, useEffect, useMemo } from 'react';
import Match from '../components/Match';
import useHistoryData from '../hooks/useHistoryData';
import LoadingScreen from '../components/LoadingScreen';
import { processHistoryData } from '../hooks/processHistoryData';
import { ValorantAgent, ValorantMap } from '../types/assetTypes';
import { PlayerInfoResponse } from '../types/responseTypes';

interface HistoryProps {
    user: PlayerInfoResponse | null;
    maps: ValorantMap[];
    agents: ValorantAgent[];
    registerRefetch: (fn: () => void) => void;
}

const History: React.FC<HistoryProps> = ({ user, maps, agents, registerRefetch }) => {

    const [queueID, setQueueID] = useState<string>("");
    const { matches, isLoading, error, refetch } = useHistoryData(queueID);
    
    useEffect(() => registerRefetch(() => refetch), [registerRefetch, refetch]);

    const processedMatches = useMemo(() => {
        if (!matches || !user || !maps.length || !agents.length) return null;
        return matches.map(match => processHistoryData(match));
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
        <div className="flex min-h-screen flex-col">
            <main className="mx-auto flex w-full max-w-[1400px] flex-1 flex-col gap-10 px-4 py-10 sm:px-8 lg:px-12">
                <section className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                    <div className="space-y-2">
                        <h1 className="text-3xl font-semibold text-white sm:text-4xl">Match History</h1>
                        <p className="text-sm text-white/60">Dive into your recent performances and track momentum across queues.</p>
                    </div>
                    <div className="flex flex-col gap-2 text-sm font-medium text-white/70 md:flex-row md:items-center md:gap-4">
                        <span className="uppercase tracking-[0.3em] text-xs text-white/50 md:text-right">Queue</span>
                        <div className="relative inline-flex items-center">
                            <select
                                name="queueId"
                                value={queueID}
                                onChange={e => {setQueueID(e.target.value);}}
                                className="appearance-none rounded-xl border border-white/10 bg-black/30 px-5 py-3 pr-12 text-xs font-semibold uppercase tracking-[0.4em] text-white transition focus:border-[#ff6b35] focus:outline-none focus:ring-2 focus:ring-[#ff6b35]/40"
                            >
                                <option value="">All</option>
                                <option value="unrated">Unrated</option>
                                <option value="competitive">Competitive</option>
                                <option value="deathmatch">Deathmatch</option>
                                <option value="spikerush">Spike Rush</option>
                                <option value="swiftplay">Swiftplay</option>
                            </select>
                            <span className="pointer-events-none absolute right-4 text-sm text-white/70">▾</span>
                        </div>
                    </div>
                </section>
                <section className="flex flex-col gap-6">
                    {processedMatches && processedMatches.length > 0 ?
                        processedMatches.map((match) => (
                            <Match
                                key={`${match.matchInfo.gameStartMillis}-${match.matchInfo.queueID}`}
                                user={user}
                                maps={maps}
                                agents={agents}
                                match={match}
                            />
                        ))
                    :
                    <div className="flex h-[60vh] items-center justify-center rounded-3xl border border-dashed border-white/15 bg-white/5 text-center backdrop-blur-xl">
                        <div className="space-y-2">
                            <h2 className="text-2xl font-semibold text-white">No Matches to Display</h2>
                            <p className="text-sm text-white/60">Play a few games to populate your history.</p>
                        </div>
                    </div>}
                </section>
            </main>
        </div>
    );
}

export default History;