export type PlayerInfoResponse = {
    country: string;
    sub: string;
    email_verified: boolean;
    player_plocale?: unknown | null;
    country_at: number | null;
    pw: {
        cng_at: number;
        reset: boolean;
        must_reset: boolean;
    };
    phone_number_verified: boolean;
    account_verified: boolean;
    ppid?: unknown | null;
    federated_identity_providers: string[];
    player_locale: string | null;
    acct: {
        type: number;
        state: string;
        adm: boolean;
        game_name: string;
        tag_line: string;
        created_at: number;
    };
    age: number;
    jti: string;
    username: string;
    affinity: {
        [x: string]: string;
    };
};

export interface StorefrontResponse {
  FeaturedBundle: FeaturedBundle;
  SkinsPanelLayout: SkinsPanelLayout;
  UpgradeCurrencyStore: UpgradeCurrencyStore;
  AccessoryStore: AccessoryStore;
  PluginStores: PluginStore[];
}

export interface AccessoryStore {
  AccessoryStoreOffers: AccessoryStoreOffer[];
  AccessoryStoreRemainingDurationInSeconds?: number;
  StorefrontID: string;
}

export interface AccessoryStoreOffer {
  Offer: Offer;
  ContractID: string;
}

export interface Bundle {
  ID: string;
  DataAssetID: string;
  CurrencyID: string;
  Items: Item[];
  ItemOffers: ItemOffer[];
  TotalBaseCost: TotalBaseCost;
  TotalDiscountedCost: TotalDiscountedCost;
  TotalDiscountPercent?: number;
  DurationRemainingInSeconds?: number;
  WholesaleOnly?: boolean;
  IsGiftable?: number;
}

export interface Cost {
  "85ad13f7-3d1b-5128-9eb2-7cd8ee0b5741"?: number; // Valorant Points
  "85ca954a-41f2-ce94-9b45-8ca3dd39a00d"?: number; // Kingdom Credits
}

export interface DiscountedCost {
  "85ad13f7-3d1b-5128-9eb2-7cd8ee0b5741"?: number; // Valorant Points
}

export interface FeaturedBundle {
  Bundle: Bundle;
  Bundles: Bundle[];
  BundleRemainingDurationInSeconds?: number;
}

export interface Item {
  Item: ItemData;
  BasePrice?: number;
  CurrencyID: string;
  DiscountPercent?: number;
  DiscountedPrice?: number;
  IsPromoItem?: boolean;
}

export interface ItemData {
  ItemTypeID: string;
  ItemID: string;
  Amount?: number;
}

export interface ItemOffer {
  BundleItemOfferID: string;
  Offer: Offer;
  DiscountPercent?: number;
  DiscountedCost: DiscountedCost;
}

export interface Offer {
  OfferID: string;
  IsDirectPurchase?: boolean;
  StartDate?: string; // ISO 8601 date string
  Cost: Cost;
  Rewards: Reward[];
}

export interface PluginOffers {
  StoreOffers: StoreOffer[];
  RemainingDurationInSeconds?: number;
}

export interface PluginStore {
  PluginID: string;
  PluginOffers: PluginOffers;
}

export interface PurchaseInformation {
  DataAssetID: string;
  OfferID: string;
  OfferType?: number;
  StartDate?: string; // ISO 8601 date string
  PrimaryCurrencyID: string;
  Cost: Cost;
  DiscountedCost: DiscountedCost;
  DiscountedPercentage?: number;
  Rewards: any[]; // Generic objects
  AdditionalContext: any[]; // Generic objects
  WholesaleOnly?: boolean;
  IsGiftable?: number;
}

export interface Reward {
  ItemTypeID: string;
  ItemID: string;
  Quantity?: number;
}

export interface SingleItemStoreOffer {
  OfferID: string;
  IsDirectPurchase?: boolean;
  StartDate: string; // ISO 8601 date string
  Cost: Cost;
  Rewards: Reward[];
}

export interface SkinsPanelLayout {
  SingleItemOffers: string[];
  SingleItemStoreOffers: SingleItemStoreOffer[];
  SingleItemOffersRemainingDurationInSeconds?: number;
}

export interface StoreOffer {
  PurchaseInformation: PurchaseInformation;
  SubOffers: SubOffer[];
}

export interface SubOffer {
  PurchaseInformation: PurchaseInformation;
}

export interface TotalBaseCost {
  "85ad13f7-3d1b-5128-9eb2-7cd8ee0b5741"?: number; // Valorant Points
}

export interface TotalDiscountedCost {
  "85ad13f7-3d1b-5128-9eb2-7cd8ee0b5741"?: number; // Valorant Points
}

export interface UpgradeCurrencyOffer {
  OfferID: string;
  StorefrontItemID: string;
  Offer: Offer;
  DiscountedPercent?: number;
}

export interface UpgradeCurrencyStore {
  UpgradeCurrencyOffers: UpgradeCurrencyOffer[];
}

// Type guards for runtime type checking (optional but recommended)
export const isStorefrontResponse = (obj: any): obj is StorefrontResponse => {
  return obj && 
    typeof obj === 'object' &&
    'FeaturedBundle' in obj &&
    'SkinsPanelLayout' in obj &&
    'UpgradeCurrencyStore' in obj &&
    'AccessoryStore' in obj &&
    'PluginStores' in obj;
};

export const isCost = (obj: any): obj is Cost => {
  return obj && typeof obj === 'object';
};

export const isOffer = (obj: any): obj is Offer => {
  return obj &&
    typeof obj === 'object' &&
    typeof obj.OfferID === 'string' &&
    'Cost' in obj &&
    Array.isArray(obj.Rewards);
};

// Utility types for common patterns
export type CurrencyType = keyof Cost;
export type ValorantPointsId = "85ad13f7-3d1b-5128-9eb2-7cd8ee0b5741";
export type KingdomCreditsId = "85ca954a-41f2-ce94-9b45-8ca3dd39a00d";

// Constants for currency IDs
export const CURRENCY_IDS = {
  VALORANT_POINTS: "85ad13f7-3d1b-5128-9eb2-7cd8ee0b5741" as const,
  KINGDOM_CREDITS: "85ca954a-41f2-ce94-9b45-8ca3dd39a00d" as const,
} as const;