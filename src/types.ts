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

// Wallet types (mirror Rust model serialization keys)
export interface WalletResponse {
  Balances: BalancesInternal;
  CurrencyLimits: CurrencyLimits;
}

export interface BalancesInternal {
  // Valorant Points
  "85ad13f7-3d1b-5128-9eb2-7cd8ee0b5741"?: number;
  // Kingdom Credits
  "85ca954a-41f2-ce94-9b45-8ca3dd39a00d"?: number;
  // Radianite Points
  "e59aa87c-4cbf-517a-5983-6e81511be9b7"?: number;
  // Free Agents (contracts)
  "f08d4ae3-939c-4576-ab26-09ce1f23bb37"?: number;
}

export interface CurrencyLimits {
  // Kingdom Credits limits
  "85ca954a-41f2-ce94-9b45-8ca3dd39a00d"?: CreditLimits;
  // Valorant Points limits
  "85ad13f7-3d1b-5128-9eb2-7cd8ee0b5741"?: CreditLimits;
  // Radianite limits
  "e59aa87c-4cbf-517a-5983-6e81511be9b7"?: CreditLimits;
  // Free Agents limits
  "f08d4ae3-939c-4576-ab26-09ce1f23bb37"?: CreditLimits;
}

export interface CreditLimits {
  Limits?: Limits;
}

export interface Limits {
  // Single limit entry keyed by GUID in the API
  "bdf142e6-72fa-5f47-8983-8a68e902abb5"?: Limit;
}

export interface Limit {
  amount?: number;
  limitType?: string;
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
export type RadianiteId = "e59aa87c-4cbf-517a-5983-6e81511be9b7";
export type FreeAgentsId = "f08d4ae3-939c-4576-ab26-09ce1f23bb37";

// Constants for currency IDs
export const CURRENCY_IDS = {
  VALORANT_POINTS: "85ad13f7-3d1b-5128-9eb2-7cd8ee0b5741" as const,
  KINGDOM_CREDITS: "85ca954a-41f2-ce94-9b45-8ca3dd39a00d" as const,
  RADIANITE: "e59aa87c-4cbf-517a-5983-6e81511be9b7" as const,
  FREE_AGENTS: "f08d4ae3-939c-4576-ab26-09ce1f23bb37" as const,
} as const;


export type MatchHistoryResponse = {
  /** Player UUID */
  Subject: string;
  BeginIndex: number;
  EndIndex: number;
  Total: number;
  History: MatchID[];
};

export type MatchID = {
  MatchID: string;
  /** Milliseconds since epoch */
  GameStartTime: number;
  /** Queue ID */
  QueueID: string;
}

export type MatchDetailsResponse = {
    matchInfo: {
        /** Match ID */
        matchId: string;
        /** Map ID */
        mapId: string;
        gamePodId: string;
        gameLoopZone: string;
        gameServerAddress: string;
        gameVersion: string;
        gameLengthMillis: number | null;
        gameStartMillis: number;
        provisioningFlowID: "Matchmaking" | "CustomGame";
        isCompleted: boolean;
        customGameName: string;
        forcePostProcessing: boolean;
        /** Queue ID */
        queueID: string;
        /** Game Mode */
        gameMode: string;
        isRanked: boolean;
        isMatchSampled: boolean;
        /** Season ID */
        seasonId: string;
        completionState: "Surrendered" | "Completed" | "VoteDraw" | "";
        platformType: "PC";
        premierMatchInfo: {};
        partyRRPenalties?: {
            [x: string]: number;
        } | undefined;
        shouldMatchDisablePenalties: boolean;
    };
    players: {
        /** Player UUID */
        subject: string;
        gameName: string;
        tagLine: string;
        platformInfo: {
            platformType: "PC";
            platformOS: "Windows";
            platformOSVersion: string;
            platformChipset: "Unknown";
        };
        teamId: ("Blue" | "Red") | string;
        /** Party ID */
        partyId: string;
        /** Character ID */
        characterId: string;
        stats: {
            score: number;
            roundsPlayed: number;
            kills: number;
            deaths: number;
            assists: number;
            playtimeMillis: number;
            abilityCasts?: ({
                grenadeCasts: number;
                ability1Casts: number;
                ability2Casts: number;
                ultimateCasts: number;
            } | null) | undefined;
        } | null;
        roundDamage: {
            round: number;
            /** Player UUID */
            receiver: string;
            damage: number;
        }[] | null;
        competitiveTier: number;
        isObserver: boolean;
        /** Card ID */
        playerCard: string;
        /** Title ID */
        playerTitle: string;
        /** Preferred Level Border ID */
        preferredLevelBorder?: (string | "") | undefined;
        accountLevel: number;
        sessionPlaytimeMinutes?: (number | null) | undefined;
        xpModifications?: {
            /** XP multiplier */
            Value: number;
            /** XP Modification ID */
            ID: string;
        }[] | undefined;
        behaviorFactors?: {
            afkRounds: number;
            /** Float value of unknown significance. Possibly used to quantify how much the player was in the way of their teammates? */
            collisions?: number | undefined;
            commsRatingRecovery: number;
            damageParticipationOutgoing: number;
            friendlyFireIncoming?: number | undefined;
            friendlyFireOutgoing?: number | undefined;
            mouseMovement?: number | undefined;
            stayedInSpawnRounds?: number | undefined;
        } | undefined;
        newPlayerExperienceDetails?: {
            basicMovement: {
                idleTimeMillis: 0;
                objectiveCompleteTimeMillis: 0;
            };
            basicGunSkill: {
                idleTimeMillis: 0;
                objectiveCompleteTimeMillis: 0;
            };
            adaptiveBots: {
                adaptiveBotAverageDurationMillisAllAttempts: 0;
                adaptiveBotAverageDurationMillisFirstAttempt: 0;
                killDetailsFirstAttempt: null;
                idleTimeMillis: 0;
                objectiveCompleteTimeMillis: 0;
            };
            ability: {
                idleTimeMillis: 0;
                objectiveCompleteTimeMillis: 0;
            };
            bombPlant: {
                idleTimeMillis: 0;
                objectiveCompleteTimeMillis: 0;
            };
            defendBombSite: {
                success: false;
                idleTimeMillis: 0;
                objectiveCompleteTimeMillis: 0;
            };
            settingStatus: {
                isMouseSensitivityDefault: boolean;
                isCrosshairDefault: boolean;
            };
            versionString: "";
        } | undefined;
    }[];
    bots: unknown[];
    coaches: {
        /** Player UUID */
        subject: string;
        teamId: "Blue" | "Red";
    }[];
    teams: {
        teamId: ("Blue" | "Red") | string;
        won: boolean;
        roundsPlayed: number;
        roundsWon: number;
        numPoints: number;
    }[] | null;
    roundResults: {
        roundNum: number;
        roundResult: "Eliminated" | "Bomb detonated" | "Bomb defused" | "Surrendered" | "Round timer expired";
        roundCeremony: "CeremonyDefault" | "CeremonyTeamAce" | "CeremonyFlawless" | "CeremonyCloser" | "CeremonyClutch" | "CeremonyThrifty" | "CeremonyAce" | "";
        winningTeam: ("Blue" | "Red") | string;
        /** Player UUID */
        bombPlanter?: string | undefined;
        bombDefuser?: (("Blue" | "Red") | string) | undefined;
        /** Time in milliseconds since the start of the round when the bomb was planted. 0 if not planted */
        plantRoundTime?: number | undefined;
        plantPlayerLocations: {
            /** Player UUID */
            subject: string;
            viewRadians: number;
            location: {
                x: number;
                y: number;
            };
        }[] | null;
        plantLocation: {
            x: number;
            y: number;
        };
        plantSite: "A" | "B" | "C" | "";
        /** Time in milliseconds since the start of the round when the bomb was defused. 0 if not defused */
        defuseRoundTime?: number | undefined;
        defusePlayerLocations: {
            /** Player UUID */
            subject: string;
            viewRadians: number;
            location: {
                x: number;
                y: number;
            };
        }[] | null;
        defuseLocation: {
            x: number;
            y: number;
        };
        playerStats: {
            /** Player UUID */
            subject: string;
            kills: {
                /** Time in milliseconds since the start of the game */
                gameTime: number;
                /** Time in milliseconds since the start of the round */
                roundTime: number;
                /** Player UUID */
                killer: string;
                /** Player UUID */
                victim: string;
                victimLocation: {
                    x: number;
                    y: number;
                };
                assistants: string[];
                playerLocations: {
                    /** Player UUID */
                    subject: string;
                    viewRadians: number;
                    location: {
                        x: number;
                        y: number;
                    };
                }[];
                finishingDamage: {
                    damageType: "Weapon" | "Bomb" | "Ability" | "Fall" | "Melee" | "Invalid" | "";
                    /** Item ID of the weapon used to kill the player. Empty string if the player was killed by the spike, fall damage, or melee. */
                    damageItem: (string | ("Ultimate" | "Ability1" | "Ability2" | "GrenadeAbility" | "Primary")) | "";
                    isSecondaryFireMode: boolean;
                };
            }[];
            damage: {
                /** Player UUID */
                receiver: string;
                damage: number;
                legshots: number;
                bodyshots: number;
                headshots: number;
            }[];
            score: number;
            economy: {
                loadoutValue: number;
                /** Item ID */
                weapon: string | "";
                /** Armor ID */
                armor: string | "";
                remaining: number;
                spent: number;
            };
            ability: {
                grenadeEffects: null;
                ability1Effects: null;
                ability2Effects: null;
                ultimateEffects: null;
            };
            wasAfk: boolean;
            wasPenalized: boolean;
            stayedInSpawn: boolean;
        }[];
        /** Empty string if the timer expired */
        roundResultCode: "Elimination" | "Detonate" | "Defuse" | "Surrendered" | "";
        playerEconomies: {
            /** Player UUID */
            subject: string;
            loadoutValue: number;
            /** Item ID */
            weapon: string | "";
            /** Armor ID */
            armor: string | "";
            remaining: number;
            spent: number;
        }[] | null;
        playerScores: {
            /** Player UUID */
            subject: string;
            score: number;
        }[] | null;
    }[] | null;
    kills: {
        /** Time in milliseconds since the start of the game */
        gameTime: number;
        /** Time in milliseconds since the start of the round */
        roundTime: number;
        /** Player UUID */
        killer: string;
        /** Player UUID */
        victim: string;
        victimLocation: {
            x: number;
            y: number;
        };
        assistants: string[];
        playerLocations: {
            /** Player UUID */
            subject: string;
            viewRadians: number;
            location: {
                x: number;
                y: number;
            };
        }[];
        finishingDamage: {
            damageType: "Weapon" | "Bomb" | "Ability" | "Fall" | "Melee" | "Invalid" | "";
            /** Item ID of the weapon used to kill the player. Empty string if the player was killed by the spike, fall damage, or melee. */
            damageItem: (string | ("Ultimate" | "Ability1" | "Ability2" | "GrenadeAbility" | "Primary")) | "";
            isSecondaryFireMode: boolean;
        };
        round: number;
    }[] | null;
};