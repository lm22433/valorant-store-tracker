import { invoke } from '@tauri-apps/api/core';
import { useQuery } from '@tanstack/react-query';
import { CurrentMatchResponse, NameServiceResponse } from '../types/responseTypes';

interface UseLiveDataResult {
	match: CurrentMatchResponse | null;
	names: NameServiceResponse | null;
	isLoading: boolean;
	error: String | null;
	refetch: () => void;
}

export const useLiveData = (): UseLiveDataResult => {
	const matchQuery = useQuery({
		queryKey: ['live', 'match'],
		queryFn: async () => invoke<CurrentMatchResponse>('get_current_match'),
		refetchInterval: 5000,
		staleTime: 3000,
		retry: 1,
	});

	const namesQuery = useQuery({
		queryKey: ['live', 'names', matchQuery.data?.MatchID ?? 'none'],
		enabled: !!matchQuery.data,
		queryFn: async () => invoke<NameServiceResponse>('get_game_name', { puuids: matchQuery.data!.Players.map(p => p.Subject) }),
		staleTime: 3000,
		retry: 1,
	});

	const isLoading = matchQuery.isLoading || (namesQuery.isLoading && !!matchQuery.data);
	const error = (matchQuery.error || namesQuery.error) ? ((matchQuery.error || namesQuery.error) instanceof Error ? (matchQuery.error || namesQuery.error as any).message : 'Failed to fetch match') : null;

	error && console.log('useLiveData error:', error);

	return {
		match: matchQuery.data ?? null,
		names: namesQuery.data ?? null,
		isLoading,
		error,
		refetch: () => { void Promise.all([matchQuery.refetch(), namesQuery.refetch()]); }
	};
};

export default useLiveData;
