import { MatchDetailsResponse } from "../types";
import { ProcessedMatchData, MatchInfo, PlayerInfo, TeamInfo } from "./types";

export const processMatchData = (
  matchResponse: MatchDetailsResponse
): ProcessedMatchData => {
    
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
        mapName: matchResponse.matchInfo.mapId,
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
