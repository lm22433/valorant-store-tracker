import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { ProcessedMatchData, WIN, DRAW } from '../../history/types';

type MatchPopupProps = {
    match: ProcessedMatchData;
    isOpen: boolean;
    onClose: () => void;
};

const MatchPopup: React.FC<MatchPopupProps> = ({ match, isOpen, onClose }) => {
    const [visible, setVisible] = useState(false);
    useEffect(() => {
        if (!isOpen) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', onKey);
        requestAnimationFrame(() => setVisible(true));
        const prevOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => {
            window.removeEventListener('keydown', onKey);
            document.body.style.overflow = prevOverflow;
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    // const playersSorted = [...match.players].sort((a, b) => {
    //     const aACS = a.stats && a.stats.roundsPlayed ? a.stats.score / a.stats.roundsPlayed : 0;
    //     const bACS = b.stats && b.stats.roundsPlayed ? b.stats.score / b.stats.roundsPlayed : 0;
    //     return bACS - aACS;
    // });

    const resultLabel = match.result === DRAW ? 'Draw' : match.result === WIN ? 'Victory' : 'Defeat';
    const resultClass = match.result === DRAW ? 'text-white' : match.result === WIN ? 'text-teal-400' : 'text-rose-400';

    // Precompute damage dealt per round by subject and damage received per round per subject
    const dealtBy: Record<string, Record<number, number>> = {};
    const receivedBy: Record<string, Record<number, number>> = {};
    for (const p of match.players) {
        if (p.roundDamage) {
            for (const rd of p.roundDamage) {
                // damage dealt by p.subject in rd.round
                (dealtBy[p.subject] ||= {})[rd.round] = (dealtBy[p.subject][rd.round] || 0) + rd.damage;
                // damage received by rd.receiver in rd.round
                (receivedBy[rd.receiver] ||= {})[rd.round] = (receivedBy[rd.receiver][rd.round] || 0) + rd.damage;
            }
        }
    }

    const computeDamageDelta = (subject: string, roundsPlayed?: number) => {
        if (!roundsPlayed || roundsPlayed <= 0) return '—' as const;
        const dealt = dealtBy[subject] || {};
        const received = receivedBy[subject] || {};
        let sum = 0;
        for (let r = 0; r < roundsPlayed; r++) {
            const dGiven = dealt[r] || 0;
            const dTaken = received[r] || 0;
            sum += dGiven - dTaken;
        }
        return Math.round(sum / roundsPlayed);
    };

    const PlayerRow = ({
        subject,
        name,
        tagline,
        characterId,
        teamId,
        stats,
    }: {
        subject: string;
        name: string;
        tagline: string;
        characterId: string;
        teamId: string;
        stats: NonNullable<typeof match.players[number]['stats']> | null;
    }) => {
        const k = stats?.kills ?? 0;
        const d = stats?.deaths ?? 0;
        const a = stats?.assists ?? 0;
        const acs = stats?.roundsPlayed ? Math.round((stats.score || 0) / stats.roundsPlayed) : '—';
        const kd = d === 0 ? (k > 0 ? '∞' : '0.00') : (k / d).toFixed(2);
        const dd = computeDamageDelta(subject, stats?.roundsPlayed);
        const teamClasses = teamId === 'Blue'
            ? 'border-cyan-400/30 bg-cyan-400/10'
            : teamId === 'Red'
                ? 'border-rose-400/30 bg-rose-500/10'
                : 'border-white/10 bg-white/5';
        return (
            <div className={`grid w-full grid-cols-6 items-center rounded-lg border px-3 py-2 text-sm text-white/80 ${teamClasses}`}>
                <div className="col-span-2 flex items-center gap-2 truncate">
                    <img
                        src={`https://media.valorant-api.com/agents/${characterId}/displayicon.png`}
                        alt="agent"
                        className="h-7 w-7 rounded-sm object-contain"
                        onError={(e) => { (e.currentTarget as HTMLImageElement).style.visibility = 'hidden'; }}
                    />
                    <span className="font-medium text-white">
                        {name}<span className="text-white/50">#{tagline}</span>
                    </span>
                </div>
                <div className="text-center font-mono text-white/80">{kd}</div>
                <div className="text-center text-white/80">{k}/{d}/{a}</div>
                <div className="text-right font-mono text-white/80">{dd}</div>
                <div className="text-right font-mono text-white/70">{acs}</div>
            </div>
        );
    };

    return ReactDOM.createPortal(
        <div className="fixed inset-0 z-50" role="dialog" aria-modal='true'>
            <div
                className={`absolute inset-0 bg-black/60 transition-opacity duration-200 ${visible ? 'opacity-100' : 'opacity-0'}`}
                onClick={onClose}
            />
            <div className="absolute inset-0 flex items-center justify-center p-4">
                <div
                    onClick={(e) => e.stopPropagation()}
                    className={`relative w-full max-w-5xl max-h-screen overflow-hidden rounded-2xl border border-white/10 bg-white/10 shadow-2xl backdrop-blur-lg transition-all duration-200 ${visible ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-2'}`}
                >
                    <div className="relative flex items-center justify-between border-b border-white/10 p-4 gap-3">
                        <div className="flex items-center gap-3">
                            <img
                                src={match.agentIconUrl}
                                alt={`${match.agentName} icon`}
                                className="h-8 w-8 rounded-md border border-white/10 bg-black/30 object-contain"
                            />
                            <div>
                                <h3 className="text-lg font-semibold text-white">{match.mapName}</h3>
                                <p className="text-xs text-white/60">{new Date(match.gameStartMillis).toLocaleString()} • {match.queueID || 'Unknown'}</p>
                            </div>
                        </div>
                        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                            <h2 className={`text-center text-2xl sm:text-3xl font-extrabold leading-tight ${resultClass}`}>
                                {resultLabel} {match.teams[0].roundsWon}:{match.teams[1].roundsWon}
                            </h2>
                        </div>
                        <button
                            onClick={onClose}
                            className="rounded-md border border-white/20 bg-white/15 px-3 py-1 text-sm text-white hover:bg-white/25"
                        >
                            Close
                        </button>
                    </div>

                    <div className="max-h-full overflow-auto overscroll-contain p-4">
                        <div className="mb-3 grid grid-cols-6 gap-2 px-3 text-xs uppercase tracking-widest text-white/50">
                            <div className="col-span-2">Player</div>
                            <div className="text-center">K/D</div>
                            <div className="text-center">K/D/A</div>
                            <div className="text-right">DD</div>
                            <div className="text-right">ACS</div>
                        </div>
                        <div className="space-y-2">
                            {match.players.map(p => (
                                <PlayerRow
                                    key={p.subject}
                                    subject={p.subject}
                                    name={p.gameName}
                                    tagline={p.tagLine}
                                    characterId={p.characterId}
                                    teamId={p.teamId as string}
                                    stats={p.stats}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default MatchPopup;