import React from 'react';

const History: React.FC<{onHome: () => void}> = ({onHome}: {onHome: () => void}) => {
    return (
        <div>
            <h1>Match History</h1>
            <button onClick={() => onHome()}>Home</button>
        </div>
    );
}

export default History;