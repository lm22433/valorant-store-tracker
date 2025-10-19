import React from 'react';
import useLiveData from '../hooks/useLiveData';
import LoadingScreen from '../components/LoadingScreen';
import { ValorantAgent } from '../types/assetTypes';
import useAssets from '../hooks/useAssets';
import useUserData from '../hooks/useUserData';

const Live: React.FC = () => {

    const { match, names, isLoading: isMatchLoading, error: matchError } = useLiveData();
    const { user, isLoading: isUserLoading, error: userError } = useUserData();
    const { maps, agents, isLoading: isAssetsLoading, error: assetsError } = useAssets();

    const map = maps?.find(m => m.url === match?.mapUrl) || null;

    if (isMatchLoading || isUserLoading || isAssetsLoading) return <LoadingScreen message="Loading your match..." />;

    if (!match) {
        return (
            <div className="flex min-h-[80vh] items-center justify-center">
            <div className="flex h-[60vh] m-20 w-[80vw] items-center justify-center rounded-3xl border border-dashed border-white/15 bg-white/5 text-center backdrop-blur-xl">
                <div className="space-y-2">
                    <h2 className="text-2xl font-semibold text-white">No Match to Display</h2>
                    <p className="text-sm text-white/60">Load into a game to view match details.</p>
                </div>
            </div>
            </div>
        );
    }

    if (matchError || userError || assetsError) {
        // Show friendly "no match" state when notFound is true
        return (
        <div className="flex min-h-screen items-center justify-center px-6">
            <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-10 text-center shadow-2xl backdrop-blur-2xl">
            <h2 className="text-2xl font-semibold text-white">Something went wrong</h2>
                <p className="mt-3 text-white/70">{matchError || userError || assetsError}</p>
            <button onClick={() => window.location.reload()} className="mt-8 inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-[#ff4655] to-[#ff6b35] px-6 py-3 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_10px_30px_rgba(255,70,85,0.3)] focus:outline-none focus:ring-2 focus:ring-[#ff6b35]/60 focus:ring-offset-2 focus:ring-offset-transparent">Try Again</button>
            </div>
        </div>
        );
    }

    const PlayerRow = ({subject, teamId, agent}: {subject: string, teamId: string, agent: ValorantAgent | null}) => {
        // Placeholder values for live match (stats not available during game)
        const nameInfo = names?.find(n => n.subject === subject);
        const name = nameInfo?.gameName + "#" + nameInfo?.tagLine;
        const k = '—';
        const d = '—';
        const a = '—';
        const acs = '—';
        const kd = '—';
        const dd = '—';

        const teamClasses =
            subject === user?.sub ? 
                teamId === 'Blue' ? 'border-cyan-400/30 bg-gradient-to-r from-yellow-400/30 via-cyan-400/10 to-cyan-400/10'
                : teamId === 'Red' ? 'border-rose-400/30 bg-gradient-to-r from-yellow-400/30 via-rose-500/10 to-rose-500/10'
                : 'border-yellow-500/50 bg-yellow-500/10'
            : teamId === 'Blue' ? 'border-cyan-400/30 bg-cyan-400/10'
            : teamId === 'Red' ? 'border-rose-400/30 bg-rose-500/10'
            : 'border-white/10 bg-white/5';

        return (
            <div key={subject} className={`grid w-full h-14 grid-cols-6 items-center rounded-lg border px-3 py-2 text-m text-white/80 ${teamClasses}`}>
                <div className="col-span-2 flex items-center gap-2 truncate">
                    <img
                        src={agent?.displayIcon || undefined}
                        alt={agent?.displayName || "Unknown Agent"}
                        className="h-7 w-7 rounded-sm object-contain"
                        onError={(e) => { (e.currentTarget as HTMLImageElement).style.visibility = 'hidden'; }}
                    />
                    <span className="font-medium text-white">
                        {name || agent?.displayName || "Unknown Agent"}<span className="text-white/50"></span>
                    </span>
                </div>
                <div className="text-center font-mono text-white/80">{kd}</div>
                <div className="text-center text-white/80">{k}/{d}/{a}</div>
                <div className="text-right font-mono text-white/80">{dd}</div>
                <div className="text-right font-mono text-white/80">{acs}</div>
            </div>
        );
    };

    return (
        <div className="flex min-h-screen flex-col">
            <main className="mx-auto flex w-full max-w-[1400px] flex-1 flex-col gap-10 px-4 py-10 sm:px-8 lg:px-12">
                {!match ? 
                <div className="flex min-h-[80vh] items-center justify-center">
                    <div className="flex h-[60vh] m-20 w-[80vw] items-center justify-center rounded-3xl border border-dashed border-white/15 bg-white/5 text-center backdrop-blur-xl">
                        <div className="space-y-2">
                            <h2 className="text-2xl font-semibold text-white">No Match to Display</h2>
                            <p className="text-sm text-white/60">Load into a game to view match details.</p>
                        </div>
                    </div>
                </div>
                :
                <div>
                    <section className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between mb-8">
                    <div className="space-y-2">
                        <h1 className="text-3xl font-semibold text-white sm:text-4xl">Live Match</h1>
                        <p className="text-sm text-white/60">Map: {map?.displayName || "Unknown Map"}</p>
                        <p className="text-sm text-white/60">Mode: {match.mode}</p>
                    </div>
                    </section>
                    
                    <section className="w-full">
                        {match && match.players.length > 0 && (
                            <div className="relative w-full mb-6 rounded-2xl border border-white/10 bg-white/5 shadow-2xl backdrop-blur-lg overflow-hidden">
                                <div
                                    className="absolute inset-0 rounded-2xl pointer-events-none"
                                    style={{
                                        backgroundImage: `url(${map?.splash || ''})`,
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center',
                                        opacity: 0.15,
                                        WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,1), rgba(0,0,0,0))',
                                        maskImage: 'linear-gradient(to bottom, rgba(0,0,0,1), rgba(0,0,0,0))'
                                    }}
                                />

                                <div className="relative z-10">
                                    <div className="flex items-center justify-between border-b border-white/10 p-4">
                                        <div>
                                            <h3 className="text-xl font-semibold text-white">Match Players</h3>
                                            <p className="text-sm text-white/60">Live statistics unavailable during match</p>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-lg font-semibold text-white">In Progress</div>
                                            <div className="text-sm text-white/60">{match.players.length} players</div>
                                        </div>
                                    </div>

                                    <div className="p-4">
                                        <div className="mb-3 grid grid-cols-6 gap-2 px-3 text-xs uppercase tracking-widest text-white/50">
                                            <div className="col-span-2">Player</div>
                                            <div className="text-center">K/D</div>
                                            <div className="text-center">K/D/A</div>
                                            <div className="text-right">DDΔ</div>
                                            <div className="text-right">ACS</div>
                                        </div>
                                        <div className="space-y-2">
                                            {match.players.map((p) => (
                                                <PlayerRow 
                                                    key={p.subject}
                                                    subject={p.subject}
                                                    teamId={p.teamId}
                                                    agent={agents?.find(a => a.uuid === p.characterId) || null}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>)}
                    </section>
                </div>}
            </main>
        </div>
    );
}

export default Live;