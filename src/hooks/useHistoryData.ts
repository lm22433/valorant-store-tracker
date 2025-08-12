import { useCallback, useEffect, useState } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { MatchHistoryResponse, PlayerInfoResponse } from '../types';

interface UseHistoryDataResult {
	user: PlayerInfoResponse | null;
	history: MatchHistoryResponse | null;
	isLoading: boolean;
	error: string | null;
	refetch: () => void;
}

export const useHistoryData = (): UseHistoryDataResult => {
	const [user, setUser] = useState<PlayerInfoResponse | null>(null);
	const [history, setHistory] = useState<MatchHistoryResponse | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const fetchData = useCallback(async () => {
		try {
			setIsLoading(true);
			setError(null);
			const [userInfo, historyResponse] = await Promise.all([
				invoke<PlayerInfoResponse>('get_account_info_command'),
				invoke<MatchHistoryResponse>('get_history_data'),
			]);
			setUser(userInfo);
			setHistory(historyResponse);
		} catch (error) {
			console.error('Failed to fetch data:', error);
			setError(error instanceof Error ? error.message : 'Failed to fetch data');
		} finally {
			setIsLoading(false);
		}
	}, []);

	useEffect(() => {
		fetchData();
	}, [fetchData]);

	return { user, history, isLoading, error, refetch: fetchData };
};

export default useHistoryData;
