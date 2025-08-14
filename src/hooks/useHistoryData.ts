import { useCallback, useEffect, useState } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { PlayerInfoResponse, MatchDetailsResponse, MatchHistoryResponse } from '../types';

interface UseHistoryDataResult {
	user: PlayerInfoResponse | null;
	matches: MatchDetailsResponse[];
	isLoading: boolean;
	error: String | null;
	refetch: () => void;
}

export const useHistoryData = (queueId: string): UseHistoryDataResult => {
	const [user, setUser] = useState<PlayerInfoResponse | null>(null);
	const [matches, setMatches] = useState<MatchDetailsResponse[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<String | null>(null);

	const fetchData = useCallback(async () => {
		try {
			setIsLoading(true);
			setError(null);
			const [userResponse, historyResponse] = await Promise.all([
				invoke<PlayerInfoResponse>('get_account_info_command'),
				invoke<MatchHistoryResponse>('get_history_data', {args: {queueId: queueId}})
			]);
			setUser(userResponse);

			const matchDetailsList = await Promise.all(
				historyResponse.History.map(match =>
					invoke<MatchDetailsResponse>('get_match_data', {args: {matchId: match.MatchID}})
				)
			);
			setMatches(matchDetailsList);
		} catch (error) {
			console.error('Failed to fetch match history:', error);
			setError(error instanceof Error ? error.message : typeof(error) === 'string' ? error : 'Failed to fetch match history');
		} finally {
			setIsLoading(false);
		}
	}, [queueId]);

	useEffect(() => {
		fetchData();
	}, [fetchData]);

	return { user, matches, isLoading, error, refetch: fetchData };
};

export default useHistoryData;
