import { MatchDetailsResponse } from "../types/responseTypes";
import { ProcessedHistoryData, MatchInfo, PlayerInfo, TeamInfo } from "../types/historyTypes";

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

    const teamInfo: TeamInfo[] = matchResponse.teams!;

    const matchInfo: MatchInfo = {
        mapUrl: matchResponse.matchInfo.mapId,
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
