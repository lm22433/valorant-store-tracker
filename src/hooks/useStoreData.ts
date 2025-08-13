import { useCallback, useEffect, useState } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { PlayerInfoResponse, StorefrontResponse, WalletResponse } from '../types';
import { ValorantAPIResponse, ValorantSkin } from '../store/types';

interface UseStoreDataResult {
	user: PlayerInfoResponse | null;
	store: StorefrontResponse | null;
	wallet: WalletResponse | null;
	skinData: ValorantSkin[];
	isLoading: boolean;
	error: string | null;
	refetch: () => void;
}

export const useStoreData = (): UseStoreDataResult => {
	const [user, setUser] = useState<PlayerInfoResponse | null>(null);
	const [store, setStore] = useState<StorefrontResponse | null>(null);
	const [wallet, setWallet] = useState<WalletResponse | null>(null);
	const [skinData, setSkinData] = useState<ValorantSkin[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const fetchSkinData = useCallback(async (): Promise<ValorantSkin[]> => {
		try {
			const response = await fetch('https://valorant-api.com/v1/weapons/skins');
			if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
			const data: ValorantAPIResponse = await response.json();
			if (data.status === 200) return data.data;
			throw new Error(`API returned status ${data.status}`);
		} catch (error) {
			console.error('Failed to fetch skin data:', error);
			throw error;
		}
	}, []);

	const fetchData = useCallback(async () => {
		try {
			setIsLoading(true);
			setError(null);
			const [userInfo, storeResponse, walletInfo, skins] = await Promise.all([
				invoke<PlayerInfoResponse>('get_account_info_command'),
				invoke<StorefrontResponse>('get_store_data'),
				invoke<WalletResponse>('get_wallet_info'),
				fetchSkinData()
			]);
			setUser(userInfo);
			setStore(storeResponse);
			setWallet(walletInfo);
			setSkinData(skins);
		} catch (error) {
			console.error('Failed to fetch data:', error);
			setError(error instanceof Error ? error.message : 'Failed to fetch data');
		} finally {
			setIsLoading(false);
		}
	}, [fetchSkinData]);

	useEffect(() => {
		fetchData();
	}, [fetchData]);

	return { user, store, wallet, skinData, isLoading, error, refetch: fetchData };
};

export default useStoreData;
