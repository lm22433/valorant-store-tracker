import { StorefrontResponse } from '../types';
import { CURRENCY_IDS } from '../types';
import { ProcessedStoreData, ProcessedStoreItem, ValorantSkin } from './types';

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
