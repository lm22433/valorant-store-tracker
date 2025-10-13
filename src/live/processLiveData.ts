import { CurrentMatchResponse } from "../types";
import { ProcessedLiveData } from "./types";

const mapNames: Record<string, string> = {
    Infinity: 'Abyss',
    Ascent: 'Ascent',
    Duality: 'Bind',
    Foxtrot: 'Breeze',
    Rook: 'Corrode',
    Canyon: 'Fracture',
    Triad: 'Haven',
    Port: 'Icebox',
    Jam: 'Lotus',
    Pitt: 'Pearl',
    Poveglia: 'Range',
    Bonsai: 'Split',
    Juliett: 'Sunset',
    Skirmish_A: 'Skirmish A',
    Skirmish_B: 'Skirmish B',
    Skirmish_C: 'Skirmish C',
};

const gameMode = (str: string) => {
    if (str.includes('Unrated')) return 'Unrated';
    if (str.includes('Competitive')) return 'Competitive';
    if (str.includes('QuickBomb')) return 'Spike Rush';
    if (str.includes('Deathmatch')) return 'Deathmatch';
    if (str.includes('Swiftplay')) return 'Swiftplay';
    if (str.includes('Hurm')) return 'Team Deathmatch';
    if (str.includes('Premier')) return 'Premier';
    if (str.includes('Custom')) return 'Custom Game';
    return str;
};

export const processLiveData = (liveData: CurrentMatchResponse): ProcessedLiveData => {
    const processedMap = mapNames[liveData.MapID.split("/").pop() || ''];
    const processedMode = gameMode(liveData.ModeID.split("/").pop() || '')

    // Transform player objects to have lowercase keys
    const processedPlayers = liveData.Players.map(player => ({
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
        matchId: liveData.MatchID,
        map: processedMap,
        mode: processedMode,
        players: processedPlayers,
    }
}