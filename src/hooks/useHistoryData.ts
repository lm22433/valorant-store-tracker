import { useCallback, useEffect, useRef, useState } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { MatchDetailsResponse, MatchHistoryResponse } from '../types/responseTypes';

interface UseHistoryDataResult {
	matches: MatchDetailsResponse[];
	isLoading: boolean;
	error: String | null;
	refetch: () => void;
}

export const useHistoryData = (queueId: string): UseHistoryDataResult => {
	const [matches, setMatches] = useState<MatchDetailsResponse[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<String | null>(null);

	const fetchData = useCallback(async () => {
		try {
			setIsLoading(true);
			setError(null);
			const historyResponse = await invoke<MatchHistoryResponse>('get_history_data', {args: {queueId: queueId}})
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

	const lastQueueID = useRef<string | null>(null);
	useEffect(() => {
		if (lastQueueID.current === queueId) return;
		lastQueueID.current = queueId;
		fetchData();
	}, [fetchData]);

	return { matches, isLoading, error, refetch: fetchData };
};

export default useHistoryData;
