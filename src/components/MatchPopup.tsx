import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { ProcessedHistoryData, WIN, DRAW, PlayerInfo } from '../types/historyTypes';
import useAssets from '../hooks/useAssets';

type MatchPopupProps = {
    user: PlayerInfo;
    match: ProcessedHistoryData;
    isOpen: boolean;
    onClose: () => void;
};

const MatchPopup: React.FC<MatchPopupProps> = ({ user, match, isOpen, onClose }) => {

    const { maps, agents, isLoading: isAssetsLoading, error: assetsError } = useAssets();

    if (isAssetsLoading) return <div>Loading...</div>;
    if (assetsError || !maps || !agents) return <div>Error loading match data.</div>;

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

    const resultLabel = match.result === DRAW ? 'Draw' : match.result === WIN ? 'Victory' : 'Defeat';
    const resultClass = match.result === DRAW ? 'text-white' : match.result === WIN ? 'text-teal-400' : 'text-rose-400';

    const map = maps?.find(m => m.url === match.mapUrl) || null;
    const userAgent = agents?.find(a => a.uuid === user.characterId) || null;

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

        const agent = agents?.find(a => a.uuid === characterId) || null;

        const teamClasses =
            subject == user.subject ? 
                teamId === 'Blue' ? 'border-cyan-400/30 bg-gradient-to-r from-yellow-400/20 via-cyan-400/10 to-cyan-400/10'
                : teamId === 'Red' ? 'border-rose-400/30 bg-gradient-to-r from-yellow-400/20 via-rose-500/10 to-rose-500/10'
                : 'border-yellow-500/50 bg-yellow-500/10'
            : teamId === 'Blue' ? 'border-cyan-400/30 bg-cyan-400/10'
            : teamId === 'Red' ? 'border-rose-400/30 bg-rose-500/10'
            : 'border-white/10 bg-white/5';
        return (
            <div className={`grid w-full h-14 grid-cols-6 items-center rounded-lg border px-3 py-2 text-m text-white/80 ${teamClasses}`}>
                <div className="col-span-2 flex items-center gap-2 truncate">
                    <img
                        src={agent?.displayIcon || undefined}
                        alt={`${agent?.displayName || "Unknown Agent"} Portrait`}
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
                <div className="text-right font-mono text-white/80">{acs}</div>
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
                    className={`relative w-full max-w-7xl h-fit overflow-hidden rounded-2xl border border-white/10 bg-white/10 shadow-2xl backdrop-blur-lg transition-all duration-200 ${visible ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-2'}`}
                >
                    <div className="relative flex items-center justify-between border-b border-white/10 p-4 gap-3">
                        <div className="flex items-center gap-3">
                            <img
                                src={userAgent?.displayIcon || undefined}
                                alt={`${userAgent?.displayName || 'Unknown Agent'} Portrait`}
                                className="h-8 w-8 rounded-md border border-white/10 bg-black/30 object-contain"
                            />
                            <div>
                                <h3 className="text-xl font-semibold text-white">{map?.displayName || 'Unknown Map'}</h3>
                                <p className="text-xs text-white/60">{new Date(match.gameStartMillis).toLocaleString()} • {(match.queueID.charAt(0).toUpperCase() + match.queueID.slice(1)) || 'Unknown'}</p>
                            </div>
                        </div>
                        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                            <h2 className={`text-center text-2xl sm:text-3xl font-extrabold leading-tight ${resultClass}`}>
                                {resultLabel} - {match.teams[0].roundsWon} : {match.teams[1].roundsWon}
                            </h2>
                        </div>
                        <button
                            onClick={onClose}
                            className="rounded-md border border-white/20 bg-white/15 px-3 py-1 text-sm text-white hover:bg-white/25"
                        >
                            Close
                        </button>
                    </div>

                    <div className="relative max-h-full overflow-auto overscroll-contain p-4">
                        <div
                            className="absolute inset-0 pointer-events-none"
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
                            <div className="mb-3 grid grid-cols-6 gap-2 px-3 text-xs uppercase tracking-widest text-white/50">
                                <div className="col-span-2">Player</div>
                                <div className="text-center">K/D</div>
                                <div className="text-center">K/D/A</div>
                                <div className="text-right">DDΔ</div>
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
                                        teamId={p.teamId}
                                        stats={p.stats}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default MatchPopup;