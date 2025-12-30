import React, { useState } from 'react';
import MatchPopup from './MatchPopup';
import { ProcessedHistoryData, WIN, DRAW } from '../types/historyTypes';
import useUserData from '../hooks/useUserData';
import useAssets from '../hooks/useAssets';


const Match: React.FC<{match: ProcessedHistoryData}> = ({ match }) => {

    const { user, isLoading: isUserLoading, error: userError } = useUserData();
    const { maps, agents, isLoading: isAssetsLoading, error: assetsError } = useAssets();

    if (isUserLoading || isAssetsLoading) return <div>Loading...</div>;
    if (userError || assetsError || !user) return <div>Error loading match data.</div>;

    const player = match.players.find(p => p.subject === user.sub)!;
    const playerIndex = match.players.indexOf(player);
    const map = maps?.find(m => m.url === match.mapUrl) || null;
    const agent = agents?.find(a => a.uuid === player.characterId) || null;
    const [popup, setPopup] = useState<boolean>(false);
    
    const kda = player.stats?.kills.toString() + "/" + player.stats?.deaths.toString() + "/" + player.stats?.assists.toString();

    const containerStyles = match.result === DRAW
        ? "border-white/30 hover:border-white/50"
        : match.result === WIN
            ? "border-emerald-500/40 hover:border-emerald-400/60"
            : "border-rose-500/40 hover:border-rose-400/60";

    const statusBadgeClasses = match.result === DRAW
        ? "bg-white/15 text-white"
        : match.result === WIN
            ? "bg-emerald-500/20 text-emerald-200"
            : "bg-rose-500/20 text-rose-200";

    const scoreChipClasses = match.result === DRAW
        ? "border-white/30 bg-white/10 text-white"
        : match.result === WIN
            ? "border-emerald-500/40 bg-emerald-500/15 text-emerald-100"
            : "border-rose-500/40 bg-rose-500/15 text-rose-100";

    return (
        <div
            className={`group relative flex flex-col gap-4 overflow-hidden rounded-2xl border bg-white/5 p-5 transition-all duration-300 backdrop-blur-xl cursor-pointer select-none sm:p-6 ${containerStyles}`}
            onClick={() => setPopup(!popup)}
        >
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <img
                    src={map?.splash || undefined}
                    alt={`${map?.displayName || 'Unknown Map'} Art`}
                    className="h-full w-full object-cover object-center opacity-40"
                />
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-transparent opacity-80 transition-opacity duration-300 group-hover:opacity-100" />

            <div className="relative z-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-1 flex-col-reverse gap-4 md:flex-row md:items-center md:gap-5">
                    <div className="flex items-center gap-4">
                        <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-xl border border-white/15 bg-black/40 sm:h-20 sm:w-20">
                            <img
                                src={agent?.displayIcon || undefined}
                                alt={`${agent?.displayName || 'Unknown Agent'} Portrait`}
                                className="h-full w-full object-contain"
                            />
                        </div>
                        <div className="space-y-1">
                            <div className={`inline-flex items-center rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.3em] ${statusBadgeClasses}`}>
                                {match.result === DRAW ? "Draw" : match.result === WIN ? "Victory" : "Defeat"}
                            </div>
                            <div className="text-lg font-semibold text-white sm:text-xl">
                                {map?.displayName || 'Unknown Map'}
                            </div>
                            <div className="text-xs uppercase tracking-[0.25em] text-white/50">
                                {match.queueID || "Unknown"}
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-white/60 md:ml-auto">
                        <div className="flex items-center gap-2 rounded-full border border-white/10 bg-black/40 px-3 py-1">
                            <span className="font-semibold text-white">KDA</span>
                            <span className="font-medium text-white/80">{kda}</span>
                        </div>
                        <div className="flex items-center gap-2 rounded-full border border-white/10 bg-black/40 px-3 py-1">
                            <span className="font-semibold text-white">Score/Rnd</span>
                            <span className="font-medium text-white/80">{Math.round(player.stats!.score / player.stats!.roundsPlayed)}</span>
                        </div>
                        <div className={`flex items-center gap-2 rounded-full border px-3 py-1 font-semibold ${scoreChipClasses}`}>
                            <span>{match.teams[0].roundsWon}</span>
                            <span className="text-white/60">:</span>
                            <span>{match.teams[1].roundsWon}</span>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col items-end gap-2 text-right text-xs text-white/50">
                    <span className="font-medium uppercase tracking-[0.2em]">#{playerIndex + 1} in lobby</span>
                    <span>{new Date(match.gameStartMillis).toLocaleDateString()}</span>
                </div>
            </div>

            <section>
                <MatchPopup user={player} match={match} isOpen={popup} onClose={() => setPopup(false)} />
            </section>
        </div>
    )
}

export default Match