import React, { useState, useCallback } from 'react';
import Store from './Store';
import Live from './CurrentMatch';
import History from './MatchHistory';
import Header from './common/Header';
import LoadingScreen from './common/LoadingScreen';
import useUserData from '../hooks/useUserData';

const Home: React.FC = () => {

    enum Content {
        Empty,
        Store,
        Live,
        History
    }
    
    const [content, setContent] = useState(Content.Empty);
    const [activeContentRefetch, setActiveContentRefetch] = useState<(() => void) | null>(null);
    const { user, isLoading, error, refetch } = useUserData();

    const handleHome = () => {
        setContent(Content.Empty);
        setActiveContentRefetch(null);
    }

    // const handleRefresh = useCallback(() => {
    //     if (activeContentRefetch) {
    //         activeContentRefetch();
    //     } else {
    //         refetch();
    //     }
    // }, [refetch, activeContentRefetch]);

    const handleRefresh = useCallback(() => {
        if (activeContentRefetch) {
            activeContentRefetch();
        } else {
            refetch();
        }
    }, [activeContentRefetch]);

    if (isLoading) return <LoadingScreen message="Loading your home..." />;

    if (error) {
        return (
        <div className="error-container">
            <div className="error-card">
            <h2>Something went wrong</h2>
                <p>{error}</p>
            <button onClick={handleRefresh} className="retry-button">Try Again</button>
            </div>
        </div>
        );
    }

    return (
        <div>
        <Header user={user} onRefresh={handleRefresh} onHome={handleHome}/>
        <div>
            {(() => {
                switch(content) {
                    case Content.Empty:
                        return (
                            <div className="button-grid">
                                <button className="button" onClick={() => setContent(Content.Store)}>Store</button>
                                <button className="button" onClick={() => setContent(Content.Live)}>Live Match</button>
                                <button className="button" onClick={() => setContent(Content.History)}>Match History</button>
                            </div>
                        )
                    case Content.Store:
                        return <Store registerRefetch={setActiveContentRefetch}/>;
                    case Content.Live:
                        return <Live/>;
                    case Content.History:
                        return <History registerRefetch={setActiveContentRefetch}/>;
                    default:
                        return <></>;
                }
            })()}
        </div>
        </div>
    )
}

export default Home;