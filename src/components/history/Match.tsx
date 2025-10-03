import React, { useState } from 'react';
import { ProcessedMatchData } from '../../history/types';


interface MatchProps {
    match: ProcessedMatchData;
}

const Match: React.FC<MatchProps> = ({match}) => {

    const [expanded, setExpanded] = useState<boolean>(false);

    const player = match.playerInfo[match.matchInfo.playerIndex];
    const playerTeam = match.teamInfo!.find(team => player.teamId === team.teamId)!;
    const enemyTeam = match.teamInfo!.find(team => player.teamId !== team.teamId)!;
    const draw = playerTeam.roundsWon == enemyTeam.roundsWon;

    const kda = player.stats?.kills.toString() + "/" + player.stats?.deaths.toString() + "/" + player.stats?.assists.toString();

    const isWin = playerTeam.won;
    const containerStyles = draw
        ? "border-white/30 hover:border-white/50"
        : isWin
            ? "border-emerald-500/40 hover:border-emerald-400/60"
            : "border-rose-500/40 hover:border-rose-400/60";

    const statusBadgeClasses = draw
        ? "bg-white/15 text-white"
        : isWin
            ? "bg-emerald-500/20 text-emerald-200"
            : "bg-rose-500/20 text-rose-200";

    const scoreChipClasses = draw
        ? "border-white/30 bg-white/10 text-white"
        : isWin
            ? "border-emerald-500/40 bg-emerald-500/15 text-emerald-100"
            : "border-rose-500/40 bg-rose-500/15 text-rose-100";

    return (
        <div
            className={`group relative flex flex-col gap-4 overflow-hidden rounded-2xl border bg-white/5 p-5 transition-all duration-300 backdrop-blur-xl cursor-pointer select-none sm:p-6 ${containerStyles}`}
            onClick={() => setExpanded(!expanded)}
        >
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <img
                    src={match.matchInfo.mapIconUrl}
                    alt={`${match.matchInfo.mapName} map art`}
                    className="h-full w-full object-cover object-center opacity-40"
                />
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-transparent opacity-80 transition-opacity duration-300 group-hover:opacity-100" />

            <div className="relative z-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-1 flex-col-reverse gap-4 md:flex-row md:items-center md:gap-5">
                    <div className="flex items-center gap-4">
                        <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-xl border border-white/15 bg-black/40 sm:h-20 sm:w-20">
                            <img
                                src={match.matchInfo.agentIconUrl}
                                alt={`${match.matchInfo.agentName} portrait`}
                                className="h-full w-full object-contain"
                            />
                        </div>
                        <div className="space-y-1">
                            <div className={`inline-flex items-center rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.3em] ${statusBadgeClasses}`}>
                                {draw ? "Draw" : isWin ? "Victory" : "Defeat"}
                            </div>
                            <div className="text-lg font-semibold text-white sm:text-xl">
                                {match.matchInfo.mapName}
                            </div>
                            <div className="text-xs uppercase tracking-[0.25em] text-white/50">
                                {match.matchInfo.queueID || "Unknown"}
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
                            <span className="font-medium text-white/80">{Math.round(player.stats!.score / playerTeam.roundsPlayed)}</span>
                        </div>
                        <div className={`flex items-center gap-2 rounded-full border px-3 py-1 font-semibold ${scoreChipClasses}`}>
                            <span>{match.teamInfo![0].roundsWon}</span>
                            <span className="text-white/60">:</span>
                            <span>{match.teamInfo![1].roundsWon}</span>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col items-end gap-2 text-right text-xs text-white/50">
                    <span className="font-medium uppercase tracking-[0.2em]">#{match.matchInfo.playerIndex + 1} in lobby</span>
                    <span>{new Date(match.matchInfo.gameStartMillis).toLocaleDateString()}</span>
                </div>
            </div>

            <div className="relative z-10 flex items-center justify-between text-xs text-white/50">
                <span>{expanded ? "Hide quick breakdown" : "Tap to view more details"}</span>
                <span className="text-sm text-white/70 transition-transform duration-300 group-hover:translate-x-1">{expanded ? "–" : "→"}</span>
            </div>

            <section
                className={`relative z-10 overflow-hidden rounded-xl border border-white/10 bg-black/40 text-sm text-white/70 transition-all duration-300 ease-out ${
                    expanded ? "max-h-64 opacity-100 translate-y-0" : "max-h-0 opacity-0 -translate-y-2"
                }`}
            >
                <div className={`grid gap-2 p-5 transition-opacity duration-300 ease-out ${expanded ? "opacity-100" : "opacity-0"}`}>
                    <p className="font-medium text-white">match details</p>
                    <p>more match details</p>
                    <p>yet more details!!!</p>
                </div>
            </section>
        </div>
    )
}

export default Match