import React, { useState, useCallback, useRef } from 'react';
import Store from './Store';
import Live from './CurrentMatch';
import History from './MatchHistory';
import Header from '../components/Header';
import LoadingScreen from '../components/LoadingScreen';
import useUserData from '../hooks/useUserData';
import useAssets from '../hooks/useAssets';
import { ValorantAgent, ValorantMap } from '../types/assetTypes';

interface HomeProps {
    setLoggedIn: (loggedIn: boolean) => void;
}

const Home: React.FC<HomeProps> = ({ setLoggedIn }) => {

    enum Content {
        Empty,
        Store,
        Live,
        History
    }
    
    const cachedMaps = useRef<ValorantMap[]>([]);
    const cachedAgents = useRef<ValorantAgent[]>([]);
    const [content, setContent] = useState(Content.Empty);
    const [activeContentRefetch, setActiveContentRefetch] = useState<(() => void) | null>(null);
    const { user, isLoading, error, refetch } = useUserData();
    const { maps, agents } = useAssets(cachedMaps, cachedAgents);

    const handleHome = () => {
        setContent(Content.Empty);
        setActiveContentRefetch(null);
    }

    const handleRefresh = useCallback(() => {
        if (activeContentRefetch) {
            activeContentRefetch();
        } else {
            refetch();
        }
    }, [activeContentRefetch, refetch]);

    const handleLogout = () => {
        setLoggedIn(false);
    }

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
        <Header user={user} onRefresh={handleRefresh} onHome={handleHome} onLogout={handleLogout}/>
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
                        return <Live user={user} maps={maps} agents={agents} registerRefetch={setActiveContentRefetch}/>;
                    case Content.History:
                        return <History user={user} maps={maps} agents={agents} registerRefetch={setActiveContentRefetch}/>;
                    default:
                        return <></>;
                }
            })()}
        </div>
        </div>
    )
}

export default Home;