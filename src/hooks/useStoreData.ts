import { invoke } from '@tauri-apps/api/core';
import { useQuery } from '@tanstack/react-query';
import { StorefrontResponse } from '../types/responseTypes';
import { ValorantAPIResponse, ValorantSkin } from '../types/storeTypes';

interface UseStoreDataResult {
	store: StorefrontResponse | null;
	skinData: ValorantSkin[];
	isLoading: boolean;
	error: string | null;
	refetch: () => void;
}

export const useStoreData = (): UseStoreDataResult => {
	const storeQuery = useQuery({
		queryKey: ['store'],
		queryFn: async () => invoke<StorefrontResponse>('get_store_data'),
		staleTime: 60 * 60 * 1000, // store rotates daily; 1h is safe
	});

	const skinsQuery = useQuery({
		queryKey: ['assets', 'skins'],
		queryFn: async (): Promise<ValorantSkin[]> => {
			const response = await fetch('https://valorant-api.com/v1/weapons/skins');
			if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
			const data: ValorantAPIResponse = await response.json();
			if (data.status === 200) return data.data;
			throw new Error(`API returned status ${data.status}`);
		},
		staleTime: 24 * 60 * 60 * 1000,
		gcTime: 7 * 24 * 60 * 60 * 1000,
	});

	const isLoading = storeQuery.isLoading || skinsQuery.isLoading;
	const firstError = (storeQuery.error || skinsQuery.error) as unknown;
	const error = firstError ? (firstError instanceof Error ? firstError.message : 'Failed to fetch store data') : null;

	return {
		store: storeQuery.data ?? null,
		skinData: skinsQuery.data ?? [],
		isLoading,
		error,
		refetch: () => { void Promise.all([storeQuery.refetch(), skinsQuery.refetch()]); }
	};
};

export default useStoreData;
