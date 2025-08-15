import { useCallback, useEffect, useState } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { PlayerInfoResponse, MatchDetailsResponse, MatchHistoryResponse } from '../types';
import { ValorantAPIResponse, ValorantMap } from '../history/types';

interface UseHistoryDataResult {
	user: PlayerInfoResponse | null;
	matches: MatchDetailsResponse[];
	maps: ValorantMap[];
	isLoading: boolean;
	error: String | null;
	refetch: () => void;
}

export const useHistoryData = (queueId: string): UseHistoryDataResult => {
	const [user, setUser] = useState<PlayerInfoResponse | null>(null);
	const [matches, setMatches] = useState<MatchDetailsResponse[]>([]);
	const [maps, setMaps] = useState<ValorantMap[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<String | null>(null);

	const fetchMapData = useCallback(async (): Promise<ValorantMap[]> => {
		try {
			const response = await fetch('https://valorant-api.com/v1/maps');
			if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
			const data: ValorantAPIResponse = await response.json();
			if (data.status === 200) return data.data;
			throw new Error(`API returned status ${data.status}`);
		} catch (error) {
			console.error('Failed to fetch map data:', error);
			throw error;
		}
	}, []);

	const fetchData = useCallback(async () => {
		try {
			setIsLoading(true);
			setError(null);
			const [userResponse, historyResponse, mapResponse] = await Promise.all([
				invoke<PlayerInfoResponse>('get_account_info_command'),
				invoke<MatchHistoryResponse>('get_history_data', {args: {queueId: queueId}}),
				fetchMapData()
			]);
			setUser(userResponse);
			setMaps(mapResponse);

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

	return { user, matches, maps, isLoading, error, refetch: fetchData };
};

export default useHistoryData;
