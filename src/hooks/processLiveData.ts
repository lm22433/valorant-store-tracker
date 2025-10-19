import { CurrentMatchResponse } from "../types/responseTypes";
import { ProcessedLiveData } from "../types/liveTypes";

const gameMode = (str: string) => {
    if (!str) return 'Unknown';
    if (str.includes('BombGameMode')) return 'Unrated';
    if (str.includes('Competitive')) return 'Competitive';
    if (str.includes('QuickBomb')) return 'Spike Rush';
    if (str.includes('Deathmatch')) return 'Deathmatch';
    if (str.includes('Swiftplay')) return 'Swiftplay';
    if (str.includes('HURM')) return 'Team Deathmatch';
    if (str.includes('Premier')) return 'Premier';
    if (str.includes('Skirmish')) return 'Skirmish';
    return str;
};

export const processLiveData = (match: CurrentMatchResponse): ProcessedLiveData => {
    const processedMode = match.ProvisioningFlow == "CustomGame" ? 'Custom' : gameMode(match.ModeID.split("/").pop() || '');

    // Transform player objects to have lowercase keys
    const processedPlayers = match.Players.map(player => ({
        subject: player.Subject,
        teamId: player.TeamID,
        characterId: player.CharacterID,
        playerIdentity: {
            subject: player.PlayerIdentity.Subject,
            playerCardId: player.PlayerIdentity.PlayerCardID,
            playerTitleId: player.PlayerIdentity.PlayerTitleID,
            accountLevel: player.PlayerIdentity.AccountLevel,
            preferredLevelBorderId: player.PlayerIdentity.PreferredLevelBorderID,
            incognito: player.PlayerIdentity.Incognito,
            hideAccountLevel: player.PlayerIdentity.HideAccountLevel
        },
        seasonalBadgeInfo: {
            seasonId: player.SeasonalBadgeInfo.SeasonID,
            numberOfWins: player.SeasonalBadgeInfo.NumberOfWins,
            winsByTier: player.SeasonalBadgeInfo.WinsByTier,
            rank: player.SeasonalBadgeInfo.Rank,
            leaderboardRank: player.SeasonalBadgeInfo.LeaderboardRank
        },
        isCoach: player.IsCoach,
        isAssociated: player.IsAssociated
    }));


    return {
        mapUrl: match.MapID,
        mode: processedMode,
        players: processedPlayers,
    }
}