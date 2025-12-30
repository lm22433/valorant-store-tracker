import { invoke } from '@tauri-apps/api/core';
import { useQuery } from '@tanstack/react-query';
import { CompetitiveUpdate, CompetitiveUpdatesResponse, MatchDetailsResponse, MatchHistoryResponse, PlayerInfoResponse } from '../types/responseTypes';
import { DRAW, LOSS, PlayerInfo, ProcessedHistoryData, WIN } from '../types/historyTypes';


const processHistoryData = (
    userSub: string,
    matchResponse: MatchDetailsResponse,
	mmrResponse: CompetitiveUpdate | undefined
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
		competitiveUpdate: mmrResponse?.RankedRatingEarned,
        accountLevel: player.accountLevel,
    }));

	playerInfo = playerInfo.sort((b, a) => (a.stats && b.stats ? a.stats.score - b.stats.score : 1));

    const playerIndex = playerInfo.findIndex(p => p.subject === userSub)!;
    const playerTeam = matchResponse.teams!.find(team => playerInfo[playerIndex].teamId === team.teamId)!;
    const enemyTeam = matchResponse.teams!.find(team => playerInfo[playerIndex].teamId !== team.teamId)!;

    return {
        result: !playerTeam.won && !enemyTeam.won ? DRAW : playerTeam.won ? WIN : LOSS,
        mapUrl: matchResponse.matchInfo.mapId,
        gameLengthMillis: matchResponse.matchInfo.gameLengthMillis,
        gameStartMillis: matchResponse.matchInfo.gameStartMillis,
        queueID: matchResponse.matchInfo.queueID,
        players: playerInfo,
        teams: matchResponse.teams!
    }
}


interface UseHistoryDataResult {
	matches: ProcessedHistoryData[];
	isLoading: boolean;
	error: string | null;
	refetch: () => void;
}

export const useHistoryData = (queueId: string, count: number): UseHistoryDataResult => {
	const userQuery = useQuery({
		queryKey: ['user'],
		queryFn: async () => invoke<PlayerInfoResponse>('get_account_info_command'),
		staleTime: 5 * 60 * 1000, // 5 minutes
	});

	const userSub = userQuery.data?.sub ?? null;

	const historyQuery = useQuery({
		queryKey: ['history', 'queue', queueId, count.toString(), userSub],
		queryFn: async () => invoke<MatchHistoryResponse>('get_history_data', { args: { queueId, count } }),
		staleTime: 60 * 1000,
	});

	const ids = historyQuery.data?.History.map(h => h.MatchID) ?? [];

	const mmrQuery = useQuery({
		queryKey: ['history', 'mmr', queueId, count.toString(), userSub],
		queryFn: async () => invoke<CompetitiveUpdatesResponse>('get_competitive_updates', { args: { queue: queueId, endIndex: count }}),
		enabled: queueId === 'competitive',
		staleTime: 60 * 1000
	});

	const mmrs = mmrQuery.data?.Matches ?? [];

	const detailsQuery = useQuery({
		queryKey: ['history', 'details', queueId, ids, userSub],
		// Only fetch details once we have both IDs and a userSub to compute user-centric results
		enabled: ids.length > 0 && !!userSub,
		queryFn: async () => {
			// Limit parallelization to be polite
			const limit = 4;
			const results: MatchDetailsResponse[] = [];
			for (let i = 0; i < ids.length; i += limit) {
				const chunk = ids.slice(i, i + limit);
				const res = await Promise.all(chunk.map(id => invoke<MatchDetailsResponse>('get_match_data', { args: { matchId: id } })));
				results.push(...res);
			}
			return results;
		},
		select: (data) => (userSub ? data.map((m) => processHistoryData(userSub, m, mmrs.find(mmr => mmr.MatchID === m.matchInfo.matchId))) : []),
		staleTime: 5 * 60 * 1000,
	});

	const isLoading = historyQuery.isLoading || detailsQuery.isLoading || !userSub;
	const anyErr = (historyQuery.error || detailsQuery.error) as unknown;
	const error = anyErr ? (anyErr instanceof Error ? anyErr.message : 'Failed to fetch match history') : null;
	const matches = detailsQuery.data ?? [];

	return { matches, isLoading, error, refetch: () => { void Promise.all([historyQuery.refetch(), detailsQuery.refetch()]); } };
};

export default useHistoryData;
