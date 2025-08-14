import React from 'react';
import { PlayerInfoResponse, MatchDetailsResponse } from '../../types';


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
}

const Match: React.FC<MatchProps> = ({match, user}) => {

    // there must be a better way...
    const playerTeamId = match.players.find(player => player.gameName == user.acct.game_name && player.tagLine == user.acct.tag_line)!.teamId;
    const playerTeam = match.teams!.find(team => playerTeamId === team.teamId)!;
    const enemyTeam = match.teams!.find(team => playerTeamId !== team.teamId)!;

    if (playerTeam.won) {
        return (
            <div className="match-overview-won">
                <div className="map-name">
                    {mapNames[match.matchInfo.mapId.split("/").pop()!]}
                </div>
                <div className="queue-type">
                    {match.matchInfo.queueID.toLocaleUpperCase()}
                </div>
                <div className="score">
                    {match.teams![0].roundsWon} : {match.teams![1].roundsWon}
                </div>
            </div>
        )
    } else {
        return (
            <div className="match-overview-lost">
                <div className="map-name">
                    {mapNames[match.matchInfo.mapId.split("/").pop()!]}
                </div>
                <div className="queue-type">
                    {match.matchInfo.queueID.toLocaleUpperCase()}
                </div>
                <div className="score">
                    {match.teams![0].roundsWon} : {match.teams![1].roundsWon}
                </div>
            </div>
        )
    }
}

export default Match