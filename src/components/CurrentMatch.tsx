import React, { useState, useEffect, useMemo } from 'react';
import useLiveData from '../hooks/useLiveData';
import LoadingScreen from './common/LoadingScreen';

interface LiveProps {
    registerRefetch: (fn: () => void) => void;
}

const Live: React.FC<LiveProps> = ({ registerRefetch }) => {

    const { user, match, isLoading, error, refetch } = useLiveData();
    
    useEffect(() => registerRefetch(() => refetch), [registerRefetch, refetch]);    

    if (isLoading) return <LoadingScreen message="Loading your match..." />;

    if (error) {
        // If error is an object with code 404, or error string contains '404', show 'No current match'
        if ((typeof error === 'object' && (error as any).code === 404) || (typeof error === 'string' && error.includes('404'))) {
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

    const mapNames: Record<string, string> = {
        Infinity: 'Abyss',
        Ascent: 'Ascent',
        Duality: 'Bind',
        Foxtrot: 'Breeze',
        Rook: 'Corrode',
        Canyon: 'Fracture',
        Triad: 'Haven',
        Port: 'Icebox',
        Jam: 'Lotus',
        Pitt: 'Pearl',
        Poveglia: 'Range',
        Bonsai: 'Split',
        Juliett: 'Sunset',
        Skirmish_A: 'Skirmish A',
        Skirmish_B: 'Skirmish B',
        Skirmish_C: 'Skirmish C',
    };

    const PlayerRow = ({subject, teamId, characterId}: {subject: string, teamId: string, characterId: string}) => {

        const teamClasses = teamId === 'Blue'
            ? 'border-cyan-400/30 bg-cyan-400/10'
            : teamId === 'Red'
                ? 'border-rose-400/30 bg-rose-500/10'
                : 'border-white/10 bg-white/5';

        return (
            <div key={subject} className={`grid w-full grid-cols-6 items-center rounded-lg border px-3 py-2 text-sm text-white/80 ${teamClasses}`}>
                <div className="col-span-2 flex items-center gap-2 truncate">
                <img
                    src={`https://media.valorant-api.com/agents/${characterId}/displayicon.png`}
                    alt="agent"
                    className="h-7 w-7 rounded-sm object-contain"
                    onError={(e) => { (e.currentTarget as HTMLImageElement).style.visibility = 'hidden'; }}
                />
                <span>{subject}</span>
                </div>
            </div>
        )
    };

    return (
        <div className="flex min-h-screen flex-col">
            <main className="mx-auto flex w-full max-w-[1400px] flex-1 flex-col gap-10 px-4 py-10 sm:px-8 lg:px-12">
                <section className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                <div className="space-y-2">
                    <h1 className="text-3xl font-semibold text-white sm:text-4xl">Live Match</h1>
                    <p className="text-sm text-white/60">Match ID: {match?.MatchID}</p>
                    <p className="text-sm text-white/60">Map: {mapNames[match?.MapID.split("/").pop()!]}</p>
                    <p className="text-sm text-white/60">Mode: {match?.ModeID}</p>
                </div>
                </section>
                <section className='absolute inset-0 flex items-center justify-center p-4'>
                    {match && match.Players && match.Players.length > 0 && (
                        <div className={`relative w-full max-w-5xl max-h-screen overflow-hidden rounded-2xl border border-white/10 bg-white/10 shadow-2xl backdrop-blur-lg`}>
                            <div className="relative flex items-center justify-between border-b border-white/10 p-4 gap-3">
                            <div className="max-h-full overflow-auto overscroll-contain p-4">
                                <div className="mb-3 grid grid-cols-6 gap-2 px-3 text-xs uppercase tracking-widest text-white/50">
                                    <div className="text-left">Player</div>
                                </div>
                                <div className="space-y-2">
                                    {match.Players.map((p) => (
                                        <PlayerRow 
                                            key={p.Subject}
                                            subject={p.Subject}
                                            teamId={p.TeamID}
                                            characterId={p.CharacterID}
                                        />
                                    ))}
                                </div>
                            </div>
                            </div>
                        </div>
                    )}
                </section>
            </main>
        </div>
    );
}

export default Live;