import { invoke } from '@tauri-apps/api/core';
import { useQuery } from '@tanstack/react-query';
import { MatchDetailsResponse, MatchHistoryResponse } from '../types/responseTypes';

interface UseHistoryDataResult {
	matches: MatchDetailsResponse[];
	isLoading: boolean;
	error: String | null;
	refetch: () => void;
}

export const useHistoryData = (queueId: string, count: number): UseHistoryDataResult => {
	const historyQuery = useQuery({
		queryKey: ['history', 'queue', queueId, count.toString()],
		queryFn: async () => invoke<MatchHistoryResponse>('get_history_data', { args: { queueId, count } }),
		staleTime: 60 * 1000,
	});

	const detailsQuery = useQuery({
		queryKey: ['history', 'details', queueId, historyQuery.data?.History?.map(h => h.MatchID) ?? []],
		enabled: !!historyQuery.data && historyQuery.data.History.length > 0,
		queryFn: async () => {
			const ids = historyQuery.data!.History.map(h => h.MatchID);
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
		staleTime: 5 * 60 * 1000,
	});

	const isLoading = historyQuery.isLoading || detailsQuery.isLoading;
	const anyErr = (historyQuery.error || detailsQuery.error) as unknown;
	const error = anyErr ? (anyErr instanceof Error ? anyErr.message : 'Failed to fetch match history') : null;
	const matches = detailsQuery.data ?? [];

	return { matches, isLoading, error, refetch: () => { void Promise.all([historyQuery.refetch(), detailsQuery.refetch()]); } };
};

export default useHistoryData;
