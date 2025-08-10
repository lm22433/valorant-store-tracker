import { StorefrontResponse } from '../types';

export interface ValorantSkin {
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

export interface ValorantAPIResponse {
  status: number;
  data: ValorantSkin[];
}

export interface ProcessedStoreItem {
  uuid: string;
  displayName: string;
  displayIcon: string;
  cost: number;
  category: string;
  skinData?: ValorantSkin;
}

export interface ProcessedStoreData {
  dailyStore: ProcessedStoreItem[];
  nightMarket: ProcessedStoreItem[];
  timeUntilReset: number; // epoch seconds
}

export type { StorefrontResponse };
