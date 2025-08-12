import React from 'react';
import { HistoryData } from '../../types';

const Matches: React.FC<{ids: HistoryData[]}> = ({ids}: {ids: HistoryData[]}) => {
    return (
        <div>
            {ids.map((match) => (<div>{match.MatchID}</div>))}
        </div>
    );
}

export default Matches;