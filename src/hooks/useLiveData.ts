import { invoke } from '@tauri-apps/api/core';
import { useQuery } from '@tanstack/react-query';
import { CurrentMatchResponse, NameServiceResponse } from '../types/responseTypes';
import { ProcessedLiveData } from '../types/liveTypes';


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
		matchId: match.MatchID,
        mapUrl: match.MapID,
        mode: processedMode,
        players: processedPlayers,
    }
}


interface UseLiveDataResult {
	match: ProcessedLiveData | null;
	names: NameServiceResponse | null;
	isLoading: boolean;
	error: String | null;
	refetch: () => void;
}

export const useLiveData = (): UseLiveDataResult => {
	const matchQuery = useQuery({
		queryKey: ['live', 'match'],
		queryFn: async () => invoke<CurrentMatchResponse>('get_current_match'),
		select: (data) => processLiveData(data),
		refetchInterval: 5000,
		staleTime: 3000,
		retry: 1,
	});

	const namesQuery = useQuery({
		queryKey: ['live', 'names', matchQuery.data?.matchId ?? 'none'],
		enabled: !!matchQuery.data,
		queryFn: async () => invoke<NameServiceResponse>('get_game_name', { puuids: matchQuery.data!.players.map(p => p.subject) }),
		staleTime: 3000,
		retry: 1,
	});

	const isLoading = matchQuery.isLoading || (namesQuery.isLoading && !!matchQuery.data);
	const error = (matchQuery.error || namesQuery.error) ? ((matchQuery.error || namesQuery.error) instanceof Error ? (matchQuery.error || namesQuery.error as any).message : 'Failed to fetch match') : null;

	return {
		match: matchQuery.data ?? null,
		names: namesQuery.data ?? null,
		isLoading,
		error,
		refetch: () => { void Promise.all([matchQuery.refetch(), namesQuery.refetch()]); }
	};
};

export default useLiveData;
