import { MatchDetailsResponse } from "../types/responseTypes";
import { ProcessedHistoryData, MatchInfo, PlayerInfo, TeamInfo } from "../types/historyTypes";

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
    "Juliett": "Sunset",
    "Skirmish_A": "Skirmish A",
    "Skirmish_B": "Skirmish B",
    "Skirmish_C": "Skirmish C"
};

export const processHistoryData = (
  matchResponse: MatchDetailsResponse
): ProcessedHistoryData => {
    
    let playerInfo: PlayerInfo[] = matchResponse.players.map(player => ({
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

    playerInfo = playerInfo.sort((b,a) => a.stats && b.stats ? a.stats.score - b.stats.score : 1);

    const teamInfo: TeamInfo[] = matchResponse.teams!;

    const matchInfo: MatchInfo = {
        mapName: mapNames[matchResponse.matchInfo.mapId.split("/").pop() || ''] || 'Unknown Map',
        gameLengthMillis: matchResponse.matchInfo.gameLengthMillis,
        gameStartMillis: matchResponse.matchInfo.gameStartMillis,
        queueID: matchResponse.matchInfo.queueID
    }

    return {
        matchInfo: matchInfo,
        playerInfo: playerInfo,
        teamInfo: teamInfo
    }
}
