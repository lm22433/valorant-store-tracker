import { invoke } from '@tauri-apps/api/core';
import { useQuery } from '@tanstack/react-query';
import { CURRENCY_IDS, StorefrontResponse } from '../types/responseTypes';
import { ProcessedStoreData, ProcessedStoreItem, ValorantAPIResponse, ValorantSkin } from '../types/storeTypes';


// Precompute currency id for VP
const VP = CURRENCY_IDS.VALORANT_POINTS;

export const processStoreData = (
  storeResponse: StorefrontResponse,
  skins: ValorantSkin[]
): ProcessedStoreData => {
  const skinMap = new Map(skins.map(skin => [skin.uuid, skin]));
  const levelToSkinMap = new Map<string, ValorantSkin>();

  skins.forEach(skin => {
    skin.levels.forEach(level => levelToSkinMap.set(level.uuid, skin));
  });

  const dailyStoreItems: ProcessedStoreItem[] = storeResponse.SkinsPanelLayout.SingleItemStoreOffers.map(offer => {
    let matchedSkin = levelToSkinMap.get(offer.OfferID) || skinMap.get(offer.OfferID);
    if (!matchedSkin) {
      for (const skin of skins) {
        if (skin.levels.some(level => level.uuid === offer.OfferID)) {
          matchedSkin = skin;
          break;
        }
      }
    }
    const cost = offer.Cost?.[VP] || 0;
    return {
      uuid: matchedSkin?.uuid || offer.OfferID,
      displayName: matchedSkin?.displayName || 'Unknown Skin',
      displayIcon: matchedSkin?.displayIcon || '',
      cost,
      category: 'Weapon Skin',
      skinData: matchedSkin
    };
  });

  const nightMarketItems: ProcessedStoreItem[] = [];
  if (storeResponse.AccessoryStore?.AccessoryStoreOffers) {
    storeResponse.AccessoryStore.AccessoryStoreOffers.forEach(offer => {
      const reward = offer.Offer.Rewards?.[0];
      if (!reward) return;
      const matchedSkin = skinMap.get(reward.ItemID) || levelToSkinMap.get(reward.ItemID);
      const cost = offer.Offer.Cost?.[VP] || 0;
      nightMarketItems.push({
        uuid: reward.ItemID,
        displayName: matchedSkin?.displayName || 'Unknown Item',
        displayIcon: matchedSkin?.displayIcon || '',
        cost,
        category: 'Accessory',
        skinData: matchedSkin
      });
    });
  }

  const timeUntilReset = storeResponse.SkinsPanelLayout.SingleItemOffersRemainingDurationInSeconds || 0;
  const resetTimestamp = Math.floor(Date.now() / 1000) + timeUntilReset;

  return {
    dailyStore: dailyStoreItems,
    nightMarket: nightMarketItems,
    timeUntilReset: resetTimestamp
  };
};


interface UseStoreDataResult {
	store: ProcessedStoreData | null;
	isLoading: boolean;
	error: string | null;
	refetch: () => void;
}

export const useStoreData = (): UseStoreDataResult => {
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

	const storeQuery = useQuery({
		queryKey: ['store'],
		queryFn: async () => invoke<StorefrontResponse>('get_store_data'),
		enabled: !!skinsQuery.data,
    	select: (data) => processStoreData(data, skinsQuery.data ?? []),
		staleTime: 60 * 60 * 1000, // store rotates daily; 1h is safe
	});	

	const isLoading = storeQuery.isLoading || skinsQuery.isLoading;
	const firstError = (storeQuery.error || skinsQuery.error) as unknown;
	const error = firstError ? (firstError instanceof Error ? firstError.message : 'Failed to fetch store data') : null;

	return {
		store: storeQuery.data ?? null,
		isLoading,
		error,
		refetch: () => { void Promise.all([storeQuery.refetch(), skinsQuery.refetch()]); }
	};
};

export default useStoreData;
