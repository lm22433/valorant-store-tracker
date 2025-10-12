import { StorefrontResponse, CURRENCY_IDS } from '../types';
import { ProcessedStoreData, ProcessedStoreItem, ValorantWeaponSkin, ValorantBuddy, ValorantPlayerCard, ValorantPlayerTitle, ValorantSpray } from './types';

const VP = CURRENCY_IDS.VALORANT_POINTS;
const KC = CURRENCY_IDS.KINGDOM_CREDITS;

const ITEM_TYPE_LABELS: Record<string, string> = {
  // Weapon Skin Level
  'e7c63390-eda7-46e0-bb7a-a6abdacd2433': 'Weapon Skin',
  // Gun Buddy
  'dd3bf334-87f3-40bd-b043-682a57a8dc3a': 'Gun Buddy',
  // Spray
  'd5f120f8-ff8c-4aac-92ea-f2b5acbe9475': 'Spray',
  // Player Card
  '3f296c07-64c3-494c-923b-fe692a4fa1bd': 'Player Card',
  // Title
  'de7caa6b-adf7-4588-bbd1-143831e786c6': 'Title',
};

export const processStoreData = (
  storeResponse: StorefrontResponse,
  skins: ValorantWeaponSkin[],
  buddies: ValorantBuddy[] = [],
  playerCards: ValorantPlayerCard[] = [],
  playerTitles: ValorantPlayerTitle[] = [],
  sprays: ValorantSpray[] = []
): ProcessedStoreData => {
  const skinMap = new Map(skins.map(skin => [skin.uuid, skin]));
  const levelToSkinMap = new Map<string, ValorantWeaponSkin>();

  skins.forEach(skin => {
    skin.levels.forEach(level => levelToSkinMap.set(level.uuid, skin));
  });

  // Accessory maps for buddies, player cards, titles and sprays
  const buddyMap = new Map(buddies.map(b => [b.uuid, b]));
  const buddyLevelToBuddyMap = new Map<string, ValorantBuddy>();
  buddies.forEach(b => b.levels.forEach(l => buddyLevelToBuddyMap.set(l.uuid, b)));

  const playerCardMap = new Map(playerCards.map(pc => [pc.uuid, pc]));
  const playerTitleMap = new Map(playerTitles.map(pt => [pt.uuid, pt]));

  const sprayMap = new Map(sprays.map(s => [s.uuid, s]));
  const sprayLevelToSprayMap = new Map<string, ValorantSpray>();
  sprays.forEach(s => s.levels.forEach(l => sprayLevelToSprayMap.set(l.uuid, s)));

  const dailyStoreItems: ProcessedStoreItem[] = storeResponse.SkinsPanelLayout.SingleItemStoreOffers.map(offer => {
    const reward = offer.Rewards?.[0];
    let matchedSkin = (reward && (levelToSkinMap.get(reward.ItemID) || skinMap.get(reward.ItemID)))
      || levelToSkinMap.get(offer.OfferID)
      || skinMap.get(offer.OfferID);
    if (!matchedSkin) {
      for (const skin of skins) {
        if (
          (reward && skin.levels.some(level => level.uuid === reward.ItemID)) ||
          skin.levels.some(level => level.uuid === offer.OfferID)
        ) {
          matchedSkin = skin;
          break;
        }
      }
    }
    const cost = offer.Cost?.[VP] ?? offer.Cost?.[KC] ?? 0;
    let currencyLabel: string | undefined = undefined;
    if (offer.Cost?.[VP]) {
      currencyLabel = 'VP';
    } else if (offer.Cost?.[KC]) {
      currencyLabel = 'KC';
    }
    return {
      uuid: matchedSkin?.uuid || offer.OfferID,
      displayName: matchedSkin?.displayName || 'Unknown Skin',
      displayIcon: matchedSkin?.displayIcon || '',
      cost,
      currencyLabel,
      category: 'Weapon Skin',
      skinData: matchedSkin
    };
  });

  // Accessory Store (sprays, cards, titles, buddies)
  const accessoryStoreItems: ProcessedStoreItem[] = [];
  if (storeResponse.AccessoryStore?.AccessoryStoreOffers) {
    storeResponse.AccessoryStore.AccessoryStoreOffers.map(a => a.Offer).forEach(offer => {
      const reward = offer.Rewards?.[0];
      if (!reward) return;

  const cost = offer.Cost?.[VP] ?? offer.Cost?.[KC] ?? 0;
      let currencyLabel: string | undefined = undefined;
      if (offer.Cost?.[VP]) {
        currencyLabel = 'VP';
      } else if (offer.Cost?.[KC]) {
        currencyLabel = 'KC';
      }

      // Determine accessory type and try to find a matching metadata object
      console.log('Accessory offer:', reward.ItemTypeID);
      const itemTypeLabel = ITEM_TYPE_LABELS[reward.ItemTypeID] || 'Accessory';
      let displayName = 'Unknown Item';
      let displayIcon = '';
      let skinData: ValorantWeaponSkin | undefined = undefined;

      switch (itemTypeLabel) {
        case 'Gun Buddy': {
          const buddy = buddyMap.get(reward.ItemID) || buddyLevelToBuddyMap.get(reward.ItemID);
          if (buddy) {
            // If the reward is a level, prefer the level displayName/icon
            const level = buddy.levels.find(l => l.uuid === reward.ItemID);
            displayName = level?.displayName || buddy.displayName;
            displayIcon = level?.displayIcon || buddy.displayIcon || '';
          }
          break;
        }
        case 'Spray': {
          const spray = sprayMap.get(reward.ItemID) || sprayLevelToSprayMap.get(reward.ItemID);
          if (spray) {
            const level = spray.levels.find(l => l.uuid === reward.ItemID);
            displayName = level?.displayName || spray.displayName;
            displayIcon = level?.displayIcon || spray.displayIcon || '';
          }
          break;
        }
        case 'Player Card': {
          const card = playerCardMap.get(reward.ItemID);
          if (card) {
            displayName = card.displayName;
            displayIcon = card.displayIcon || '';
          }
          break;
        }
        case 'Title': {
          const title = playerTitleMap.get(reward.ItemID);
          if (title) {
            displayName = title.displayName;
            // Titles don't typically have an icon in the API; leave displayIcon empty
          }
          break;
        }
        default: {
          // Fall back to weapon skin maps in case accessory is a skin-level ID
          const matched = skinMap.get(reward.ItemID) || levelToSkinMap.get(reward.ItemID);
          if (matched) {
            displayName = matched.displayName;
            displayIcon = matched.displayIcon || '';
            skinData = matched;
          }
        }
      }

      accessoryStoreItems.push({
        uuid: reward.ItemID,
        displayName,
        displayIcon,
        cost,
        currencyLabel,
        category: itemTypeLabel,
        skinData,
      });
    });
  }

  // Night Market (Bonus Store) if present
  const nightMarketItems: ProcessedStoreItem[] = [];
  let nightMarketReset: number | undefined = undefined;
  if (storeResponse.BonusStore?.BonusStoreOffers) {
    storeResponse.BonusStore.BonusStoreOffers.forEach(bonusOffer => {
      const reward = bonusOffer.Offer.Rewards?.[0];
      if (!reward) return;
      const matchedSkin = skinMap.get(reward.ItemID) || levelToSkinMap.get(reward.ItemID);
  const discounted = bonusOffer.DiscountCosts?.[VP];
  const baseCost = bonusOffer.Offer.Cost?.[VP] ?? bonusOffer.Offer.Cost?.[KC];
  const cost = (discounted ?? baseCost ?? 0);
      let currencyLabel: string | undefined = undefined;
      if (bonusOffer.Offer.Cost?.[VP]) {
        currencyLabel = 'VP';
      } else if (bonusOffer.Offer.Cost?.[KC]) {
        currencyLabel = 'KC';
      }
      const discountPercent = bonusOffer.DiscountPercent;
      nightMarketItems.push({
        uuid: reward.ItemID,
        displayName: matchedSkin?.displayName || 'Unknown Skin',
        displayIcon: matchedSkin?.displayIcon || '',
        cost,
        currencyLabel,
        category: 'Weapon Skin (Discount)',
        skinData: matchedSkin,
        originalCost: baseCost,
        discountPercent: discountPercent,
      });
    });
    const nmRemaining = storeResponse.BonusStore.BonusStoreRemainingDurationInSeconds || 0;
    nightMarketReset = Math.floor(Date.now() / 1000) + nmRemaining;
  }

  const timeUntilReset = storeResponse.SkinsPanelLayout.SingleItemOffersRemainingDurationInSeconds || 0;
  const resetTimestamp = Math.floor(Date.now() / 1000) + timeUntilReset;

  return {
    dailyStore: dailyStoreItems,
    accessoryStore: accessoryStoreItems,
    nightMarket: nightMarketItems,
    timeUntilReset: resetTimestamp,
    nightMarketReset,
  };
};
