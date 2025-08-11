import React from 'react';

const Live: React.FC<{onHome: () => void}> = ({onHome}: {onHome: () => void}) => {
    return (
        <div>
            <h1>Live Match</h1>
            <button onClick={() => onHome()}>Home</button>
        </div>
    );
}

export default Live;