import { useCallback, useEffect, useState, useRef } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { PlayerInfoResponse, StorefrontResponse, WalletResponse } from '../types';
import { ValorantAPIBuddiesResponse, ValorantAPIPlayerCardsResponse, ValorantAPIPlayerTitlesResponse, ValorantAPISpraysResponse, ValorantAPIWeaponsSkinsResponse, ValorantBuddy, ValorantPlayerCard, ValorantPlayerTitle, ValorantWeaponSkin, ValorantSpray } from '../store/types';

interface UseStoreDataResult {
	user: PlayerInfoResponse | null;
	store: StorefrontResponse | null;
	wallet: WalletResponse | null;
	buddyData: ValorantBuddy[];
	playerCardData: ValorantPlayerCard[];
	playerTitleData: ValorantPlayerTitle[];
	sprayData: ValorantSpray[];
	weaponSkinData: ValorantWeaponSkin[];
	isLoading: boolean;
	error: string | null;
	refetch: () => void;
}

export const useStoreData = (): UseStoreDataResult => {
	const [user, setUser] = useState<PlayerInfoResponse | null>(null);
	const [store, setStore] = useState<StorefrontResponse | null>(null);
	const [wallet, setWallet] = useState<WalletResponse | null>(null);
	const [buddyData, setBuddyData] = useState<ValorantBuddy[]>([]);
	const [playerCardData, setPlayerCardData] = useState<ValorantPlayerCard[]>([]);
	const [playerTitleData, setPlayerTitleData] = useState<ValorantPlayerTitle[]>([]);
	const [sprayData, setSprayData] = useState<ValorantSpray[]>([]);
	const [weaponSkinData, setWeaponSkinData] = useState<ValorantWeaponSkin[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const fetchBuddyData = useCallback(async (): Promise<ValorantBuddy[]> => {
		try {
			const response = await fetch('https://valorant-api.com/v1/buddies');
			if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
			const data: ValorantAPIBuddiesResponse = await response.json();
			if (data.status === 200) return data.data;
			throw new Error(`API returned status ${data.status}`);
		} catch (error) {
			console.error('Failed to fetch buddy data:', error);
			throw error;
		}
	}, []);

	const fetchPlayerCardData = useCallback(async (): Promise<ValorantPlayerCard[]> => {
		try {
			const response = await fetch('https://valorant-api.com/v1/playercards');
			if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
			const data: ValorantAPIPlayerCardsResponse = await response.json();
			if (data.status === 200) return data.data;
			throw new Error(`API returned status ${data.status}`);
		} catch (error) {
			console.error('Failed to fetch player card data:', error);
			throw error;
		}
	}, []);

	const fetchPlayerTitleData = useCallback(async (): Promise<ValorantPlayerTitle[]> => {
		try {
			const response = await fetch('https://valorant-api.com/v1/playertitles');
			if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
			const data: ValorantAPIPlayerTitlesResponse = await response.json();
			if (data.status === 200) return data.data;
			throw new Error(`API returned status ${data.status}`);
		} catch (error) {
			console.error('Failed to fetch player title data:', error);
			throw error;
		}
	}, []);

	const fetchSprayData = useCallback(async (): Promise<ValorantSpray[]> => {
		try {
			const response = await fetch('https://valorant-api.com/v1/sprays');	
			if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
			const data: ValorantAPISpraysResponse = await response.json();
			if (data.status === 200) return data.data;
			throw new Error(`API returned status ${data.status}`);
		} catch (error) {
			console.error('Failed to fetch spray data:', error);
			throw error;
		}
	}, []);

	const fetchSkinData = useCallback(async (): Promise<ValorantWeaponSkin[]> => {
		try {
			const response = await fetch('https://valorant-api.com/v1/weapons/skins');
			if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
			const data: ValorantAPIWeaponsSkinsResponse = await response.json();
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
			const [userInfo, storeResponse, walletInfo, buddies, playerCards, playerTitles, sprays, weaponSkins] = await Promise.all([
				invoke<PlayerInfoResponse>('get_account_info_command'),
				invoke<StorefrontResponse>('get_store_data'),
				invoke<WalletResponse>('get_wallet_info'),
				fetchBuddyData(),
				fetchPlayerCardData(),
				fetchPlayerTitleData(),
				fetchSprayData(),
				fetchSkinData()
			]);
			setUser(userInfo);
			setStore(storeResponse);
			setWallet(walletInfo);
			setBuddyData(buddies);
			setPlayerCardData(playerCards);
			setPlayerTitleData(playerTitles);
			setSprayData(sprays);
			setWeaponSkinData(weaponSkins);
		} catch (error) {
			console.error('Failed to fetch store data:', error);
			setError(error instanceof Error ? error.message : typeof(error) === 'string' ? error : 'Failed to fetch store data');
		} finally {
			setIsLoading(false);
		}
	}, [fetchSkinData]);

	const fetched = useRef(false);
	useEffect(() => {
		if (fetched.current) return;
		fetched.current = true;
		fetchData();
	}, [fetchData]);

	return { user, store, wallet, buddyData, playerCardData, playerTitleData, sprayData, weaponSkinData, isLoading, error, refetch: fetchData };
};

export default useStoreData;
