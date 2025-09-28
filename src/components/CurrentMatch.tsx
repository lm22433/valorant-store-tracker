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

    return (
        <div className="home">
            <main className="main-content">
                <section className="history-top-row">
                    <h1>Live Match</h1>
                    <p>{match?.MatchID}</p>
                </section>
            </main>
        </div>
    );
}

export default Live;