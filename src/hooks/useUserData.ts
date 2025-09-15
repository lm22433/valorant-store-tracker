import { useState, useEffect, useCallback } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { PlayerInfoResponse } from '../types';

export const useUserData = () => {
    const [user, setUser] = useState<PlayerInfoResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

    const fetchData = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);
            const userInfo = await invoke<PlayerInfoResponse>('get_account_info_command');
            setUser(userInfo);
        } catch (error) {
            console.error('Failed to fetch user data:', error);
            setError(error instanceof Error ? error.message : typeof(error) === 'string' ? error : 'Failed to fetch user data');
        } finally {
            setIsLoading(false);
        }
    }, []);
    
    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return { user, isLoading, error, refetch: fetchData };
}

export default useUserData;