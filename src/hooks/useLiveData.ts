import { useCallback, useEffect, useRef, useState } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { CurrentMatchResponse, NameServiceResponse } from '../types/responseTypes';

interface UseLiveDataResult {
	match: CurrentMatchResponse | null;
	names: NameServiceResponse | null;
	isLoading: boolean;
	error: String | null;
	refetch: () => void;
}

export const useLiveData = (): UseLiveDataResult => {
    const [match, setMatch] = useState<CurrentMatchResponse | null>(null);
	const [names, setNames] = useState<NameServiceResponse | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<String | null>(null);

	const fetchData = useCallback(async () => {
		try {
			setIsLoading(true);
			setError(null);
			const matchResponse = await invoke<CurrentMatchResponse>('get_current_match');
            setMatch(matchResponse);
			const nameResponse = await invoke<NameServiceResponse>('get_game_name', { puuids: matchResponse.Players.map(p => p.Subject) });
			setNames(nameResponse);
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

	return { match, names, isLoading, error, refetch: fetchData };
};

export default useLiveData;
