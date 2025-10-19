import { MatchDetailsResponse, PlayerInfoResponse } from "../types/responseTypes";
import { ProcessedHistoryData, PlayerInfo, WIN, LOSS, DRAW } from "../types/historyTypes";

export const processHistoryData = (
    user: PlayerInfoResponse,
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

    const playerIndex = playerInfo.findIndex(player => (player.gameName + player.tagLine) === (user.acct.game_name + user.acct.tag_line))!;
    const playerTeam = matchResponse.teams!.find(team => playerInfo[playerIndex].teamId === team.teamId)!;
    const enemyTeam = matchResponse.teams!.find(team => playerInfo[playerIndex].teamId !== team.teamId)!;

    return {
        result: playerTeam.won && enemyTeam.won ? DRAW : playerTeam.won ? WIN : LOSS,
        mapUrl: matchResponse.matchInfo.mapId,
        gameLengthMillis: matchResponse.matchInfo.gameLengthMillis,
        gameStartMillis: matchResponse.matchInfo.gameStartMillis,
        queueID: matchResponse.matchInfo.queueID,
        players: playerInfo,
        teams: matchResponse.teams!
    }
}
