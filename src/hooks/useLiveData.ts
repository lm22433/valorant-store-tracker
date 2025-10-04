import { useCallback, useEffect, useRef, useState } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { PlayerInfoResponse, CurrentMatchResponse } from '../types';

interface UseLiveDataResult {
	user: PlayerInfoResponse | null;
	match: CurrentMatchResponse | null;
	isLoading: boolean;
	error: String | null;
	refetch: () => void;
}

export const useHistoryData = (): UseLiveDataResult => {
	const [user, setUser] = useState<PlayerInfoResponse | null>(null);
    const [match, setMatch] = useState<CurrentMatchResponse | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<String | null>(null);

	const fetchData = useCallback(async () => {
		try {
			setIsLoading(true);
			setError(null);
			const [userResponse, matchResponse] = await Promise.all([
				invoke<PlayerInfoResponse>('get_account_info_command'),
				invoke<CurrentMatchResponse>('get_current_match'),
			]);
			setUser(userResponse);
            setMatch(matchResponse);
		} catch (error) {
			console.error('Failed to fetch match:', error);
			setError(error instanceof Error ? error.message : typeof(error) === 'string' ? error : 'Failed to fetch match');
		} finally {
			setIsLoading(false);
		}
	}, []);

	const fetched = useRef(false);
	useEffect(() => {
		if (fetched.current) return;
		fetched.current = true;
		fetchData();
	}, [fetchData]);

	return { user, match, isLoading, error, refetch: fetchData };
};

export default useHistoryData;
