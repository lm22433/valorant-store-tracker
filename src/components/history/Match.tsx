import React, { useState } from 'react';
import { PlayerInfoResponse, MatchDetailsResponse } from '../../types';
import { ValorantMap } from '../../history/types';


const mapNames: Record<string, string> = {
    "Infinity": "Abyss",
    "Ascent": "Ascent",
    "Duality": "Bind",
    "Foxtrot": "Breeze",
    "Rook": "Corrode",
    "Canyon": "Fracture",
    "Triad": "Haven",
    "Port": "Icebox",
    "Jam": "Lotus",
    "Pitt": "Pearl",
    "Poveglia": "Range",
    "Bonsai": "Split",
    "Juliett": "Sunset"
}

interface MatchProps {
    match: MatchDetailsResponse;
    user: PlayerInfoResponse;
    maps: ValorantMap[];
}

const Match: React.FC<MatchProps> = ({match, user, maps}) => {

    const [expanded, setExpanded] = useState<boolean>(false);

    // there must be a better way...
    const player = match.players.find(player => player.gameName == user.acct.game_name && player.tagLine == user.acct.tag_line)!;
    const playerTeam = match.teams!.find(team => player.teamId === team.teamId)!;
    // const enemyTeam = match.teams!.find(team => playerTeamId !== team.teamId)!;

    const mapName = mapNames[match.matchInfo.mapId.split("/").pop()!];

    const map = maps.find(map => map.displayName === mapName)!;
    const icon = <img src={map.listViewIcon}></img>;

    return (
        <div className={playerTeam.won ? "match-won" : "match-lost"} onClick={() => setExpanded(!expanded)}>
            <div className="background">{icon}</div>
            <section className="match-overview">
                <p>{mapName}</p>
                <div className="queue-type">
                    {match.matchInfo.queueID.toLocaleUpperCase()}
                </div>
                <div style={{width: "10rem", display: "flex", justifyContent: 'space-between', alignItems: 'center'}}>
                    <p>ACS: {Math.round(player.stats!.score / playerTeam.roundsPlayed)}</p>
                    <p>{match.teams![0].roundsWon} : {match.teams![1].roundsWon}</p>
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