import React, { useState } from 'react';
import { ProcessedMatchData } from '../../history/types';


interface MatchProps {
    match: ProcessedMatchData;
}

const Match: React.FC<MatchProps> = ({match}) => {

    const [expanded, setExpanded] = useState<boolean>(false);

    const player = match.playerInfo[match.matchInfo.playerIndex];
    const playerTeam = match.teamInfo!.find(team => player.teamId === team.teamId)!;

    const mapIcon = <img src={match.matchInfo.mapIconUrl}></img>;
    const agentIcon = <img src={match.matchInfo.agentIconUrl}></img>;

    const kda = player.stats?.kills.toString() + "/" + player.stats?.deaths.toString() + "/" + player.stats?.assists.toString();

    return (
        <div className={playerTeam.won ? "match-won" : "match-lost"} onClick={() => setExpanded(!expanded)}>
            <div className="background">{mapIcon}</div>
            <div className="agent">{agentIcon}</div>
            <section className="match-overview">
                <p>{match.matchInfo.mapName}</p>
                <div className="queue-type">
                    {match.matchInfo.queueID.toLocaleUpperCase()}
                </div>
                <div style={{display: "flex", alignItems: 'center'}}>
                    <p>{kda}</p>
                    <p className="left-margin">#{match.matchInfo.playerIndex + 1}</p>
                    <p className="left-margin">{Math.round(player.stats!.score / playerTeam.roundsPlayed)}</p>
                    <p className="result left-margin">
                        <span>{match.teamInfo![0].roundsWon}</span>
                        <span className="result-colon">:</span>
                        <span>{match.teamInfo![1].roundsWon}</span>
                    </p>
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