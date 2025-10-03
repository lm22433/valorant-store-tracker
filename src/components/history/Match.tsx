import React, { useState } from 'react';
import { ProcessedMatchData } from '../../history/types';


interface MatchProps {
    match: ProcessedMatchData;
}

const Match: React.FC<MatchProps> = ({match}) => {

    const [expanded, setExpanded] = useState<boolean>(false);

    const player = match.playerInfo[match.matchInfo.playerIndex];
    const playerTeam = match.teamInfo!.find(team => player.teamId === team.teamId)!;

    const kda = player.stats?.kills.toString() + "/" + player.stats?.deaths.toString() + "/" + player.stats?.assists.toString();

    const isWin = playerTeam.won;
    const containerStyles = isWin
        ? "border-emerald-400/40 shadow-[0_24px_60px_rgba(16,185,129,0.20)] hover:-translate-y-1.5 hover:shadow-[0_28px_70px_rgba(16,185,129,0.30)]"
        : "border-rose-400/40 shadow-[0_24px_60px_rgba(244,63,94,0.18)] hover:-translate-y-1.5 hover:shadow-[0_28px_70px_rgba(244,63,94,0.28)]";

    return (
        <div
            className={`group relative overflow-hidden rounded-3xl border bg-white/5 p-6 sm:p-8 transition-all duration-300 backdrop-blur-xl cursor-pointer select-none ${containerStyles}`}
            onClick={() => setExpanded(!expanded)}
        >
            <div className="pointer-events-none absolute inset-0 opacity-30">
                <img src={match.matchInfo.mapIconUrl} alt={`${match.matchInfo.mapName} background`} className="h-full w-full object-cover" />
            </div>
            <div className="pointer-events-none absolute -left-10 top-1/2 hidden h-64 w-64 -translate-y-1/2 opacity-50 md:block">
                <img src={match.matchInfo.agentIconUrl} alt={`${match.matchInfo.agentName} portrait`} className="h-full w-full object-contain" />
            </div>
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/40 via-black/20 to-transparent" />

            <section className="relative z-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                <div className="space-y-3">
                    <div className={`inline-flex items-center gap-2 rounded-full border px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] ${isWin ? "border-emerald-400/40 bg-emerald-500/10 text-emerald-100" : "border-rose-400/40 bg-rose-500/10 text-rose-100"}`}>
                        {isWin ? "Victory" : "Defeat"}
                    </div>
                    <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-white/70">
                        {match.matchInfo.queueID || "Unknown"}
                    </div>
                    <div>
                        <h2 className="text-2xl font-semibold text-white sm:text-3xl">{match.matchInfo.mapName}</h2>
                        <p className="text-sm text-white/60">#{match.matchInfo.playerIndex + 1} in lobby · {match.matchInfo.agentName}</p>
                    </div>
                </div>

                <div className="grid gap-3 text-sm text-white/70 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="flex flex-col rounded-2xl bg-black/30 px-4 py-3">
                        <span className="text-xs font-medium uppercase tracking-[0.2em] text-white/50">KDA</span>
                        <span className="text-lg font-semibold text-white">{kda}</span>
                    </div>
                    <div className="flex flex-col rounded-2xl bg-black/30 px-4 py-3">
                        <span className="text-xs font-medium uppercase tracking-[0.2em] text-white/50">Score / Rnd</span>
                        <span className="text-lg font-semibold text-white">{Math.round(player.stats!.score / playerTeam.roundsPlayed)}</span>
                    </div>
                    <div className="flex flex-col rounded-2xl bg-black/30 px-4 py-3">
                        <span className="text-xs font-medium uppercase tracking-[0.2em] text-white/50">Result</span>
                        <span className={`text-lg font-semibold ${isWin ? "text-emerald-200" : "text-rose-200"}`}>
                            {match.teamInfo![0].roundsWon}
                            <span className="mx-1 text-white/60">:</span>
                            {match.teamInfo![1].roundsWon}
                        </span>
                    </div>
                    <div className="flex flex-col rounded-2xl bg-black/30 px-4 py-3">
                        <span className="text-xs font-medium uppercase tracking-[0.2em] text-white/50">Played</span>
                        <span className="text-lg font-semibold text-white">
                            {new Date(match.matchInfo.gameStartMillis).toLocaleDateString()}
                        </span>
                    </div>
                </div>
            </section>

            <div className="relative z-10 mt-6 flex items-center justify-between text-sm text-white/60">
                <span>{expanded ? "Hide details" : "Tap for quick breakdown"}</span>
                <span className="text-lg text-white/80 transition-transform duration-300 group-hover:translate-x-1">{expanded ? "–" : "→"}</span>
            </div>

            {expanded ? (
                <section className="relative z-10 mt-6 grid gap-2 rounded-2xl border border-white/10 bg-black/40 p-6 text-sm text-white/70">
                    <p className="text-white">match details</p>
                    <p>more match details</p>
                    <p>yet more details!!!</p>
                </section>
            ) : null}
        </div>
    )
}

export default Match