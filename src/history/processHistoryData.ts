import { MatchDetailsResponse, PlayerInfoResponse } from "../types";
import { ProcessedMatchData, MatchInfo, ValorantMap, PlayerInfo, TeamInfo } from "./types";

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


export const processMatchData = (
  matchResponse: MatchDetailsResponse,
  user: PlayerInfoResponse,
  maps: ValorantMap[]
): ProcessedMatchData => {
    
    const mapName = mapNames[matchResponse.matchInfo.mapId.split("/").pop()!];

    const matchInfo: MatchInfo = {
        player: user.acct.game_name + user.acct.tag_line,
        mapName: mapName,
        mapIconUrl: maps.find(map => map.displayName === mapName)!.listViewIcon,
        gameLengthMillis: matchResponse.matchInfo.gameLengthMillis,
        gameStartMillis: matchResponse.matchInfo.gameStartMillis,
        queueID: matchResponse.matchInfo.queueID
    }

    const playerInfo: PlayerInfo[] = matchResponse.players.map(player => ({
        subject: player.subject,
        gameName: player.gameName,
        tagLine: player.tagLine,
        teamId: player.teamId,
        partyId: player.partyId,
        characterId: player.characterId,
        stats: player.stats,
        roundDamage: player.roundDamage,
        competitiveTier: player.competitiveTier,
        accountLevel: player.accountLevel,
    }));

    const teamInfo: TeamInfo[] = matchResponse.teams!;

    return {
        matchInfo: matchInfo,
        playerInfo: playerInfo,
        teamInfo: teamInfo
    }
}
