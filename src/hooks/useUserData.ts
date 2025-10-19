import { invoke } from '@tauri-apps/api/core';
import { useQuery } from '@tanstack/react-query';
import { PlayerInfoResponse } from '../types/responseTypes';

export const useUserData = () => {
    const query = useQuery({
        queryKey: ['user'],
        queryFn: async () => invoke<PlayerInfoResponse>('get_account_info_command'),
        staleTime: 5 * 60 * 1000, // 5 minutes
    });

    const error = query.error ? (query.error instanceof Error ? query.error.message : 'Failed to fetch user data') : null;
    return { user: query.data ?? undefined, isLoading: query.isLoading, error, refetch: () => { void query.refetch(); } };
}

export default useUserData;