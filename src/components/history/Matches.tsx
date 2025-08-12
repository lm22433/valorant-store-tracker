import React from 'react';
import { MatchID } from '../../types';

const Matches: React.FC<{ids: MatchID[]}> = ({ids}: {ids: MatchID[]}) => {
    return (
        <div>
            {ids.map((match) => (<div>{match.MatchID}</div>))}
        </div>
    );
}

export default Matches;