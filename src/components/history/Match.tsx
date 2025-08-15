import React, { useState } from 'react';
import { ProcessedMatchData } from '../../history/types';


interface MatchProps {
    match: ProcessedMatchData;
}

const Match: React.FC<MatchProps> = ({match}) => {

    const [expanded, setExpanded] = useState<boolean>(false);

    // there must be a better way...
    const player = match.playerInfo.find(player => (player.gameName + player.tagLine) === match.matchInfo.player)!;
    const playerTeam = match.teamInfo!.find(team => player.teamId === team.teamId)!;

    const icon = <img src={match.matchInfo.mapIconUrl}></img>;

    return (
        <div className={playerTeam.won ? "match-won" : "match-lost"} onClick={() => setExpanded(!expanded)}>
            <div className="background">{icon}</div>
            <section className="match-overview">
                <p>{match.matchInfo.mapName}</p>
                <div className="queue-type">
                    {match.matchInfo.queueID.toLocaleUpperCase()}
                </div>
                <div style={{width: "10rem", display: "flex", justifyContent: 'space-between', alignItems: 'center'}}>
                    <p>ACS: {Math.round(player.stats!.score / playerTeam.roundsPlayed)}</p>
                    <p>{match.teamInfo![0].roundsWon} : {match.teamInfo![1].roundsWon}</p>
                </div>
            </section>
            {expanded ?
            <section className="match-details">
                <p>match details</p>
                <p>more match details</p>
                <p>yet more details!!!</p>
            </section>
            : <></>}
        </div>
    )
}

export default Match