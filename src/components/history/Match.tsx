import React from 'react';
import { MatchDetailsResponse } from '../../types';

const Match: React.FC<{match: MatchDetailsResponse}> = ({match}: {match: MatchDetailsResponse}) => {

    return (
        <div>
            {match.matchInfo.mapId}
        </div>
    )
}

export default Match