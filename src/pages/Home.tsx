import React, { useState, useCallback } from 'react';
import Store from './Store';
import Live from './CurrentMatch';
import History from './MatchHistory';
import Header from '../components/Header';
import LoadingScreen from '../components/LoadingScreen';
import useAssets from '../hooks/useAssets';
import { useHistoryData } from '../hooks/useHistoryData';
import { useQueryClient } from '@tanstack/react-query';
import useUserData from '../hooks/useUserData';
import { WIN, DRAW } from '../types/historyTypes';

// Extras: Quick Stats + Recent Matches for the Home screen
const HomeExtras: React.FC<{
    userSub: string;
    openHistory: () => void;
}> = ({ userSub, openHistory }) => {
    const { matches, isLoading: isHistoryLoading, error: historyError } = useHistoryData('competitive', 15);
    const { agents, ranks, isLoading: isAssetsLoading, error: assetsError } = useAssets();

    return (
        <div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-lg">
                <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-white">Recent Competitive Matches</h3>
                    <button
                        onClick={openHistory}
                        className="rounded-md border border-white/20 bg-white/15 px-4 py-2 text-sm font-medium text-white hover:bg-white/25 transition-colors"
                    >
                        View Full History
                    </button>
                </div>
                {isHistoryLoading || isAssetsLoading ? (
                    <div className="text-white/60">Loading…</div>
                ) : historyError || assetsError ? (
                    <div className="text-rose-300/80">Failed to load recent matches</div>
                ) : matches.length === 0 ? (
                    <div className="text-white/60">No matches found</div>
                ) : (
                    <div className="space-y-2">
                        <div className="mb-3 grid grid-cols-7 gap-2 px-3 text-xs uppercase tracking-widest text-white/50">
                            <div className="text-left">Rank</div>
                            <div className="text-left col-span-2">Agent</div>
                            <div className="text-center">K/D</div>
                            <div className="text-center">K/D/A</div>
                            <div className="text-right">ACS</div>
                            <div className="text-right">Date</div>
                        </div>
                        {matches.slice(0, 5).map((m) => {
                            const me = m.players.find(p => p.subject === userSub);
                            const rank = ranks?.find(r => r.tier === me?.competitiveTier) || null;
                            const rr = me?.competitiveUpdate ?? null;
                            const rrText = rr == null ? '—' : rr > 0 ? `+${rr}` : `${rr}`;
                            const agent = agents?.find(a => a.uuid === (me?.characterId || '')) || null;
                            const k = me?.stats?.kills ?? 0;
                            const d = me?.stats?.deaths ?? 0;
                            const a = me?.stats?.assists ?? 0;
                            const acs = me?.stats?.roundsPlayed ? Math.round((me.stats.score || 0) / me.stats.roundsPlayed) : '—';
                            const date = new Date(m.gameStartMillis).toLocaleDateString();
                            const resultClass = m.result === DRAW
                                ? 'border-white/30'
                                : m.result === WIN
                                    ? 'border-emerald-500/40 bg-emerald-500/10'
                                    : 'border-rose-500/40 bg-rose-500/10';
                            return (
                                <div key={m.gameStartMillis} className={`h-15 grid grid-cols-7 items-center rounded-lg border px-3 py-2 text-m text-white/80 ${resultClass}`}>
                                    <div className="flex items-center gap-2 truncate">
                                        <img src={rank?.smallIcon || undefined} alt={(rank?.tierName || '' + rank?.divisionName) || 'Unranked'} className="h-9 w-9 rounded-sm object-contain" />
                                        <span className='font-mono text-white truncate'>{rrText}</span>
                                    </div>
                                    <div className="col-span-2 flex items-center gap-2 truncate">
                                        <img src={agent?.displayIcon || undefined} alt={agent?.displayName || 'Agent'} className="h-9 w-9 rounded-sm object-contain" />
                                        <span className="font-medium text-white/80 truncate">{agent?.displayName || 'Unknown Agent'}</span>
                                    </div>
                                    <div className="text-center font-mono text-white/80">{k && d ? (d === 0 ? (k > 0 ? '∞' : '0.00') : (k/d).toFixed(2)) : '—'}</div>
                                    <div className="text-center text-white/80">{k}/{d}/{a}</div>
                                    <div className="text-right font-mono text-white/80">{acs}</div>
                                    <div className="text-right text-white/60">{date}</div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

const Home: React.FC<{ setLoggedIn: (loggedIn: boolean) => void }> = ({ setLoggedIn }) => {

    enum Content {
        Empty,
        Store,
        Live,
        History
    }

    const queryClient = useQueryClient();
    
    const [content, setContent] = useState(Content.Empty);
    const { user, error, isLoading } = useUserData();

    const handleHome = () => {
        setContent(Content.Empty);
    }

    const handleRefresh = useCallback(() => {
        // Always refresh user info
        queryClient.invalidateQueries({ queryKey: ['user'] });

        // Invalidate queries relevant to the current content/tab
        switch (content) {
            case Content.Store:
                queryClient.invalidateQueries({ queryKey: ['store'] });
                queryClient.invalidateQueries({ queryKey: ['assets', 'skins'] });
                break;
            case Content.Live:
                queryClient.invalidateQueries({ queryKey: ['live', 'match'] });
                queryClient.invalidateQueries({ queryKey: ['live', 'names'] });
                break;
            case Content.History:
                // Broadly invalidate all history-related queries (queue list + details)
                queryClient.invalidateQueries({ queryKey: ['history'] });
                break;
            case Content.Empty:
            default:
                // Refresh recent matches block on Home (history competitive) indirectly via history invalidation
                queryClient.invalidateQueries({ queryKey: ['history'] });
                break;
        }
    }, [content, queryClient]);

    const handleLogout = () => {
        setLoggedIn(false);
    }

    if (isLoading) return <LoadingScreen message="Loading your home..." />;

    if (error) {
        return (
        <div className="flex min-h-screen items-center justify-center px-6">
            <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-10 text-center shadow-2xl backdrop-blur-2xl">
                <h2 className="text-2xl font-semibold text-white">Something went wrong</h2>
                <p className="mt-3 text-white/70">{error}</p>
                <button
                    onClick={handleRefresh}
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
            <Header user={user} onRefresh={handleRefresh} onHome={handleHome} onLogout={handleLogout}/>
            <main className="mx-auto flex w-full max-w-[1400px] flex-1 flex-col gap-10 px-4 py-10 sm:px-8 lg:px-12">
                {(() => {
                    switch(content) {
                        case Content.Empty:
                            return (
                                <div className="flex flex-col gap-10">
                                    <section className="flex flex-col gap-3">
                                        <h1 className="text-3xl font-semibold text-white sm:text-4xl">Welcome</h1>
                                        <p className="text-sm text-white/60">Choose what you want to view.</p>
                                    </section>
                                    <section>
                                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                            <button
                                                type="button"
                                                aria-label="Open Store"
                                                onClick={() => setContent(Content.Store)}
                                                className="group relative cursor-pointer overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 text-left shadow-2xl backdrop-blur-lg transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/10 hover:ring-1 hover:ring-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 active:translate-y-0 active:scale-[0.99]"
                                            >
                                                <div className="pointer-events-none absolute inset-0 opacity-30 transition-opacity bg-gradient-to-br from-fuchsia-500/20 via-pink-500/20 to-orange-400/20 group-hover:opacity-40" />
                                                <div className="relative z-10 flex items-center justify-between">
                                                    <div>
                                                        <div className="mb-2 text-lg font-semibold text-white">Store</div>
                                                        <p className="text-sm text-white/70">See today’s featured items and your shop.</p>
                                                    </div>
                                                    <svg className="h-5 w-5 text-white/80 transition-transform duration-300 group-hover:translate-x-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                                        <path d="M8 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                    </svg>
                                                </div>
                                            </button>

                                            <button
                                                type="button"
                                                aria-label="Open Live Match"
                                                onClick={() => setContent(Content.Live)}
                                                className="group relative cursor-pointer overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 text-left shadow-2xl backdrop-blur-lg transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/10 hover:ring-1 hover:ring-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 active:translate-y-0 active:scale-[0.99]"
                                            >
                                                <div className="pointer-events-none absolute inset-0 opacity-30 transition-opacity bg-gradient-to-br from-[#ff4655]/20 via-[#ff6b35]/20 to-amber-400/20 group-hover:opacity-40" />
                                                <div className="relative z-10 flex items-center justify-between">
                                                    <div>
                                                        <div className="mb-2 text-lg font-semibold text-white">Live Match</div>
                                                        <p className="text-sm text-white/70">View teams and players of your current game.</p>
                                                    </div>
                                                    <svg className="h-5 w-5 text-white/80 transition-transform duration-300 group-hover:translate-x-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                                        <path d="M8 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                    </svg>
                                                </div>
                                            </button>

                                            <button
                                                type="button"
                                                aria-label="Open Match History"
                                                onClick={() => setContent(Content.History)}
                                                className="group relative cursor-pointer overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 text-left shadow-2xl backdrop-blur-lg transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/10 hover:ring-1 hover:ring-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 active:translate-y-0 active:scale-[0.99]"
                                            >
                                                <div className="pointer-events-none absolute inset-0 opacity-30 transition-opacity bg-gradient-to-br from-cyan-400/20 via-sky-500/20 to-violet-500/20 group-hover:opacity-40" />
                                                <div className="relative z-10 flex items-center justify-between">
                                                    <div>
                                                        <div className="mb-2 text-lg font-semibold text-white">Match History</div>
                                                        <p className="text-sm text-white/70">Browse recent matches and stats.</p>
                                                    </div>
                                                    <svg className="h-5 w-5 text-white/80 transition-transform duration-300 group-hover:translate-x-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                                        <path d="M8 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                    </svg>
                                                </div>
                                            </button>
                                        </div>
                                    </section>

                                    {/* Quick Stats and Recent Matches */}
                                    <HomeExtras
                                        userSub={user?.sub || ''}
                                        openHistory={() => setContent(Content.History)}
                                    />
                                </div>
                            )
                        case Content.Store:
                            return <Store/>;
                        case Content.Live:
                            return <Live/>;
                        case Content.History:
                            return <History/>;
                        default:
                            return <></>;
                    }
                })()}
            </main>
        </div>
    )
}

export default Home;