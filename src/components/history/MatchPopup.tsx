import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { ProcessedMatchData } from '../../history/types';

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

    const playersSorted = [...match.playerInfo].sort((a, b) => {
        const aACS = a.stats && a.stats.roundsPlayed ? a.stats.score / a.stats.roundsPlayed : 0;
        const bACS = b.stats && b.stats.roundsPlayed ? b.stats.score / b.stats.roundsPlayed : 0;
        return bACS - aACS;
    });

    const PlayerRow = ({
        name,
        tagline,
        characterId,
        teamId,
        stats,
    }: {
        name: string;
        tagline: string;
        characterId: string;
        teamId: string;
        stats: NonNullable<typeof match.playerInfo[number]['stats']> | null;
    }) => {
        const k = stats?.kills ?? 0;
        const d = stats?.deaths ?? 0;
        const a = stats?.assists ?? 0;
        const acs = stats?.roundsPlayed ? Math.round((stats.score || 0) / stats.roundsPlayed) : '—';
        const teamClasses = teamId === 'Blue'
            ? 'border-blue-400/30 bg-blue-500/10'
            : teamId === 'Red'
                ? 'border-rose-400/30 bg-rose-500/10'
                : 'border-white/10 bg-white/5';
        return (
            <div className={`grid grid-cols-4 items-center rounded-lg border px-3 py-2 text-sm text-white/80 ${teamClasses}`}>
                <div className="col-span-2 flex items-center gap-2 truncate">
                    <img
                        src={`https://media.valorant-api.com/agents/${characterId}/displayicon.png`}
                        alt="agent"
                        className="h-7 w-7 rounded-sm object-contain"
                        onError={(e) => { (e.currentTarget as HTMLImageElement).style.visibility = 'hidden'; }}
                    />
                    <span className="font-medium text-white">{name}</span>
                    <span className="text-white/50">#{tagline}</span>
                </div>
                <div className="text-white/80">{k}/{d}/{a}</div>
                <div className="text-white/70">{acs}</div>
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
                    className={`relative w-[96vw] max-w-[1600px] max-h-[90vh] overflow-hidden rounded-2xl border border-white/10 bg-white/10 shadow-2xl backdrop-blur-lg transition-all duration-200 ${visible ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-2'}`}
                >
                    <div className="flex items-center justify-between border-b border-white/10 p-4 gap-3">
                        <div className="flex items-center gap-3">
                            <img
                                src={match.matchInfo.agentIconUrl}
                                alt={`${match.matchInfo.agentName} icon`}
                                className="h-8 w-8 rounded-md border border-white/10 bg-black/30 object-contain"
                            />
                            <div>
                                <h3 className="text-lg font-semibold text-white">{match.matchInfo.mapName}</h3>
                                <p className="text-xs text-white/60">{new Date(match.matchInfo.gameStartMillis).toLocaleString()} • {match.matchInfo.queueID || 'Unknown'}</p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="rounded-md border border-white/20 bg-white/15 px-3 py-1 text-sm text-white hover:bg-white/25"
                        >
                            Close
                        </button>
                    </div>

                    <div className="max-h-[80vh] overflow-auto overscroll-contain p-4">
                        <div className="mb-3 grid grid-cols-4 gap-2 px-3 text-xs uppercase tracking-widest text-white/50">
                            <div className="col-span-2">Player</div>
                            <div>K/D/A</div>
                            <div>ACS</div>
                        </div>
                        <div className="space-y-2">
                            {playersSorted.map(p => (
                                <PlayerRow
                                    key={p.subject}
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