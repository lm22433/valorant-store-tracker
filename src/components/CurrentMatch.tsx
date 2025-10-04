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
                <div className="no-matches">
                    <h2>No Current Match</h2>
                </div>
            );
        }
        return (
            <div className="error-container">
                <div className="error-card">
                <h2>Something went wrong</h2>
                    <p>{error}</p>
                <button onClick={refetch} className="retry-button">Try Again</button>
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

    return (
        <div className="home">
            <main className="main-content">
                <section className="history-top-row">
                    <h1>Live Match</h1>
                    <p>Match ID: {match?.MatchID}</p>
                    <p>Map: {mapNames[match?.MapID.split("/").pop()!]}</p>
                    <p>Mode: {match?.ModeID}</p>
                </section>
                <section className="match-list">
                    {match && match.Players && match.Players.length > 0 ? (
                        <table className="match-table">
                            <thead>
                                <tr>
                                    <th>Player Name</th>
                                    <th>Team</th>
                                    <th>Agent</th>
                                </tr>
                            </thead>
                            <tbody>
                                {match.Players.map((player) => (
                                    <tr key={player.Subject}>
                                        <td>{player.PlayerIdentity?.Subject}</td>
                                        <td>{player.TeamID}</td>
                                        <td>{player.CharacterID}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div className="no-matches">
                            <h2>No Live Match</h2>
                        </div>
                    )}
                </section>
            </main>
        </div>
    );
}

export default Live;