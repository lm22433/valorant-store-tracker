import React, { useState } from 'react';
import Store from './Store';
import Live from './CurrentMatch';
import History from './MatchHistory';

const Home: React.FC = () => {

    enum Content {
        Empty,
        Store,
        Live,
        History
    }
    
    const [content, setContent] = useState(Content.Empty);

    const handleHome = () => {
        setContent(Content.Empty);
    }

    switch(content) {
        case Content.Empty:
            return (
                <div className="home-landing">
                    <div className="landing-inner">
                        <div className="landing-headline">
                            <h1 className="landing-title">Valorant Companion App</h1>
                            <p className="landing-sub">Track your in-game store, view your match history and statistics and much more!</p>
                        </div>
                        <div className="nav-grid">
                            <button onClick={() => setContent(Content.Store)} className="nav-card" aria-label="Open Store">
                                <div className="nav-card-bg" />
                                <div className="nav-card-content">
                                    <span className="nav-icon store">🛒</span>
                                    <h2 className="nav-title">Store</h2>
                                    <p className="nav-desc">View your daily store offers!</p>
                                </div>
                                <span className="nav-arrow">→</span>
                            </button>
                            <button onClick={() => setContent(Content.Live)} className="nav-card" aria-label="Live Match Insights">
                                <div className="nav-card-bg" />
                                <div className="nav-card-content">
                                    <span className="nav-icon live">🎯</span>
                                    <h2 className="nav-title">Live Match</h2>
                                    <p className="nav-desc">Track your current match and get real time info!</p>
                                </div>
                                <span className="nav-arrow">→</span>
                            </button>
                            <button onClick={() => setContent(Content.History)} className="nav-card" aria-label="Match History">
                                <div className="nav-card-bg" />
                                <div className="nav-card-content">
                                    <span className="nav-icon history">📜</span>
                                    <h2 className="nav-title">Match History</h2>
                                    <p className="nav-desc">Review your past match history and statistics!</p>
                                </div>
                                <span className="nav-arrow">→</span>
                            </button>
                        </div>
                    </div>
                </div>
            );
        case Content.Store:
            return <Store onHome={handleHome}/>;
        case Content.Live:
            return <Live onHome={handleHome}/>;
        case Content.History:
            return <History onHome={handleHome}/>;
        default:
            return <></>;
    }
}

export default Home;