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
                <div>
                    <button onClick={() => setContent(Content.Store)}>Store</button>
                    <button onClick={() => setContent(Content.Live)}>Live Match</button>
                    <button onClick={() => setContent(Content.History)}>Match History</button>
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