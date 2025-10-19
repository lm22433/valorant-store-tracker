import { StorefrontResponse } from '../types';

export interface ValorantAPIResponse<T = unknown> {
  status: number;
  data: T;
}

export interface ValorantBuddy {
  uuid: string;
  displayName: string;
  isHiddenIfNotOwned: boolean;
  themeUuid: string;
  displayIcon: string;
  assetPath: string;
  levels: {
    uuid: string;
    charmLevel: number;
    hideIfNotOwned: boolean;
    displayName: string;
    displayIcon: string;
    assetPath: string;
  }[];
}

export type ValorantAPIBuddiesResponse = ValorantAPIResponse<ValorantBuddy[]>;

export interface ValorantPlayerCard {
  uuid: string;
  displayName: string;
  isHiddenIfNotOwned: boolean;
  themeUuid: string;
  displayIcon: string;
  smallArt: string;
  wideArt: string;
  largeArt: string
  assetPath: string;
}

export type ValorantAPIPlayerCardsResponse = ValorantAPIResponse<ValorantPlayerCard[]>;

export interface ValorantPlayerTitle {
  uuid: string;
  displayName: string;
  titleText: string;
  isHiddenIfNotOwned: boolean;
  assetPath: string;
}

export type ValorantAPIPlayerTitlesResponse = ValorantAPIResponse<ValorantPlayerTitle[]>;

export interface ValorantSpray {
  uuid: string;
  displayName: string;
  category: string;
  themeUuid: string;
  isNullSpray: boolean;
  hideIfNotOwned: boolean;
  displayIcon: string;
  fullIcon: string;
  fullTransparentIcon: string;
  animationPng: string;
  animationGif: string;
  assetPath: string;
  levels: {
    uuid: string;
    sprayLevel: number;
    displayName: string;
    displayIcon: string;
    assetPath: string;
  }[];
}

export type ValorantAPISpraysResponse = ValorantAPIResponse<ValorantSpray[]>;

export interface ValorantWeaponSkin {
  uuid: string;
  displayName: string;
  themeUuid: string;
  contentTierUuid: string;
  displayIcon: string;
  wallpaper: string;
  assetPath: string;
  chromas: {
    uuid: string;
    displayName: string;
    displayIcon: string;
    fullRender: string;
    swatch: string;
    streamedVideo: string;
    assetPath: string;
  }[];
  levels: {
    uuid: string;
    displayName: string;
    levelItem: string;
    displayIcon: string;
    streamedVideo: string;
    assetPath: string;
  }[];
}

export type ValorantAPIWeaponsSkinsResponse = ValorantAPIResponse<ValorantWeaponSkin[]>;

export interface ProcessedStoreItem {
  uuid: string;
  displayName: string;
  displayIcon: string;
  cost: number;
  category: string;
  // Currency label to display (e.g., 'VP' or 'KC')
  currencyLabel?: string;
  skinData?: ValorantWeaponSkin;
  // Night Market / discount fields
  originalCost?: number;
  discountPercent?: number; // integer percent without % sign
}

export interface ProcessedStoreData {
  dailyStore: ProcessedStoreItem[];
  accessoryStore: ProcessedStoreItem[];
  nightMarket: ProcessedStoreItem[];
  timeUntilReset: number; // epoch seconds
  nightMarketReset?: number; // epoch seconds
}

export type { StorefrontResponse };
