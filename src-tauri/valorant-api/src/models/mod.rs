use serde::{Deserialize, Serialize};
use std::collections::HashMap;

#[derive(Debug, Serialize, Deserialize)]
pub struct EntitlementResponse {
    pub entitlements_token: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct PlayerInfoResponse {
    pub country: String,
    pub sub: String,
    pub email_verified: bool,
    #[serde(default)]
    pub player_plocale: Option<serde_json::Value>,
    #[serde(default)]
    pub country_at: Option<u64>,
    pub pw: PwInfo,
    pub phone_number_verified: bool,
    #[serde(default)]
    pub linked_identity_details: Option<serde_json::Value>,
    #[serde(default)]
    pub preferred_username: Option<String>,
    pub account_verified: bool,
    #[serde(default)]
    pub ppid: Option<serde_json::Value>,
    #[serde(default)]
    pub federated_identity_details: Option<serde_json::Value>,
    pub player_locale: Option<String>,
    #[serde(default)]
    pub email_set: Option<bool>,
    pub acct: AccountInfo,
    pub age: u32,
    pub jti: String,
    #[serde(default)]
    pub username: String,
    pub affinity: HashMap<String, String>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct PwInfo {
    pub cng_at: u64,
    pub reset: bool,
    pub must_reset: bool,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct AccountInfo {
    pub r#type: u32,
    pub state: String,
    pub adm: bool,
    pub game_name: String,
    pub tag_line: String,
    pub created_at: u64,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct RiotGeoBody {
    pub id_token: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct RiotGeoResponse {
    token: String,
    pub affinities: RiotGeoAffinities,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct RiotGeoAffinities {
    pbe: String,
    pub live: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct PlayerLoadoutResponse {
    pub subject: String,
    pub version: u32,
    pub guns: Vec<GunInfo>,
    pub sprays: Vec<SprayInfo>,
    pub identity: IdentityInfo,
    pub incognito: bool,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct GunInfo {
    pub id: String,
    pub charm_instance_id: Option<String>,
    pub charm_id: Option<String>,
    pub charm_level_id: Option<String>,
    pub skin_id: String,
    pub skin_level_id: String,
    pub chroma_id: String,
    pub attachments: Vec<serde_json::Value>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct SprayInfo {
    pub equip_slot_id: String,
    pub spray_id: String,
    pub spray_level_id: Option<String>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct IdentityInfo {
    pub player_card_id: String,
    pub player_title_id: String,
    pub account_level: u32,
    pub preferred_level_border_id: String,
    pub hide_account_level: bool,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct StorefrontResponse {
    #[serde(rename = "FeaturedBundle")]
    pub featured_bundle: FeaturedBundle,
    #[serde(rename = "SkinsPanelLayout")]
    pub skins_panel_layout: SkinsPanelLayout,
    #[serde(rename = "UpgradeCurrencyStore")]
    pub upgrade_currency_store: UpgradeCurrencyStore,
    #[serde(rename = "AccessoryStore")]
    pub accessory_store: AccessoryStore,
    #[serde(rename = "PluginStores")]
    pub plugin_stores: Vec<PluginStore>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct AccessoryStore {
    #[serde(rename = "AccessoryStoreOffers")]
    pub accessory_store_offers: Vec<AccessoryStoreOffer>,
    #[serde(rename = "AccessoryStoreRemainingDurationInSeconds")]
    pub accessory_store_remaining_duration_in_seconds: Option<i64>,
    #[serde(rename = "StorefrontID")]
    pub storefront_id: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct AccessoryStoreOffer {
    #[serde(rename = "Offer")]
    pub offer: Offer,
    #[serde(rename = "ContractID")]
    pub contract_id: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Bundle {
    #[serde(rename = "ID")]
    pub id: String,
    #[serde(rename = "DataAssetID")]
    pub data_asset_id: String,
    #[serde(rename = "CurrencyID")]
    pub currency_id: String,
    #[serde(rename = "Items")]
    pub items: Vec<Item>,
    #[serde(rename = "ItemOffers")]
    pub item_offers: Vec<ItemOffer>,
    #[serde(rename = "TotalBaseCost")]
    pub total_base_cost: TotalBaseCost,
    #[serde(rename = "TotalDiscountedCost")]
    pub total_discounted_cost: TotalDiscountedCost,
    #[serde(rename = "TotalDiscountPercent")]
    pub total_discount_percent: Option<f64>,
    #[serde(rename = "DurationRemainingInSeconds")]
    pub duration_remaining_in_seconds: Option<i64>,
    #[serde(rename = "WholesaleOnly")]
    pub wholesale_only: Option<bool>,
    #[serde(rename = "IsGiftable")]
    pub is_giftable: Option<i64>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Cost {
    #[serde(rename = "85ad13f7-3d1b-5128-9eb2-7cd8ee0b5741")]
    pub valorant_points: Option<i64>,
    #[serde(rename = "85ca954a-41f2-ce94-9b45-8ca3dd39a00d")]
    pub kingdom_credits: Option<i64>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct DiscountedCost {
    #[serde(rename = "85ad13f7-3d1b-5128-9eb2-7cd8ee0b5741")]
    pub valorant_points: Option<i64>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct FeaturedBundle {
    #[serde(rename = "Bundle")]
    pub bundle: Bundle,
    #[serde(rename = "Bundles")]
    pub bundles: Vec<Bundle>,
    #[serde(rename = "BundleRemainingDurationInSeconds")]
    pub bundle_remaining_duration_in_seconds: Option<i64>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Item {
    #[serde(rename = "Item")]
    pub item_data: ItemData,
    #[serde(rename = "BasePrice")]
    pub base_price: Option<i64>,
    #[serde(rename = "CurrencyID")]
    pub currency_id: String,
    #[serde(rename = "DiscountPercent")]
    pub discount_percent: Option<f64>,
    #[serde(rename = "DiscountedPrice")]
    pub discounted_price: Option<i64>,
    #[serde(rename = "IsPromoItem")]
    pub is_promo_item: Option<bool>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct ItemData {
    #[serde(rename = "ItemTypeID")]
    pub item_type_id: String,
    #[serde(rename = "ItemID")]
    pub item_id: String,
    #[serde(rename = "Amount")]
    pub amount: Option<i64>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct ItemOffer {
    #[serde(rename = "BundleItemOfferID")]
    pub bundle_item_offer_id: String,
    #[serde(rename = "Offer")]
    pub offer: Offer,
    #[serde(rename = "DiscountPercent")]
    pub discount_percent: Option<f64>,
    #[serde(rename = "DiscountedCost")]
    pub discounted_cost: DiscountedCost,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Offer {
    #[serde(rename = "OfferID")]
    pub offer_id: String,
    #[serde(rename = "IsDirectPurchase")]
    pub is_direct_purchase: Option<bool>,
    #[serde(rename = "StartDate")]
    pub start_date: Option<String>, // Using String for DateTime - you might want chrono::DateTime<Utc>
    #[serde(rename = "Cost")]
    pub cost: Cost,
    #[serde(rename = "Rewards")]
    pub rewards: Vec<Reward>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct PluginOffers {
    #[serde(rename = "StoreOffers")]
    pub store_offers: Vec<StoreOffer>,
    #[serde(rename = "RemainingDurationInSeconds")]
    pub remaining_duration_in_seconds: Option<i64>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct PluginStore {
    #[serde(rename = "PluginID")]
    pub plugin_id: String,
    #[serde(rename = "PluginOffers")]
    pub plugin_offers: PluginOffers,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct PurchaseInformation {
    #[serde(rename = "DataAssetID")]
    pub data_asset_id: String,
    #[serde(rename = "OfferID")]
    pub offer_id: String,
    #[serde(rename = "OfferType")]
    pub offer_type: Option<i64>,
    #[serde(rename = "StartDate")]
    pub start_date: Option<String>, // Using String for DateTime
    #[serde(rename = "PrimaryCurrencyID")]
    pub primary_currency_id: String,
    #[serde(rename = "Cost")]
    pub cost: Cost,
    #[serde(rename = "DiscountedCost")]
    pub discounted_cost: DiscountedCost,
    #[serde(rename = "DiscountedPercentage")]
    pub discounted_percentage: Option<i64>,
    #[serde(rename = "Rewards")]
    pub rewards: Vec<serde_json::Value>, // Using Value for generic objects
    #[serde(rename = "AdditionalContext")]
    pub additional_context: Vec<serde_json::Value>,
    #[serde(rename = "WholesaleOnly")]
    pub wholesale_only: Option<bool>,
    #[serde(rename = "IsGiftable")]
    pub is_giftable: Option<i64>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Reward {
    #[serde(rename = "ItemTypeID")]
    pub item_type_id: String,
    #[serde(rename = "ItemID")]
    pub item_id: String,
    #[serde(rename = "Quantity")]
    pub quantity: Option<i64>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct SingleItemStoreOffer {
    #[serde(rename = "OfferID")]
    pub offer_id: String,
    #[serde(rename = "IsDirectPurchase")]
    pub is_direct_purchase: Option<bool>,
    #[serde(rename = "StartDate")]
    pub start_date: String,
    #[serde(rename = "Cost")]
    pub cost: Cost,
    #[serde(rename = "Rewards")]
    pub rewards: Vec<Reward>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct SkinsPanelLayout {
    #[serde(rename = "SingleItemOffers")]
    pub single_item_offers: Vec<String>,
    #[serde(rename = "SingleItemStoreOffers")]
    pub single_item_store_offers: Vec<SingleItemStoreOffer>,
    #[serde(rename = "SingleItemOffersRemainingDurationInSeconds")]
    pub single_item_offers_remaining_duration_in_seconds: Option<i64>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct StoreOffer {
    #[serde(rename = "PurchaseInformation")]
    pub purchase_information: PurchaseInformation,
    #[serde(rename = "SubOffers")]
    pub sub_offers: Vec<SubOffer>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct SubOffer {
    #[serde(rename = "PurchaseInformation")]
    pub purchase_information: PurchaseInformation,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct TotalBaseCost {
    #[serde(rename = "85ad13f7-3d1b-5128-9eb2-7cd8ee0b5741")]
    pub valorant_points: Option<i64>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct TotalDiscountedCost {
    #[serde(rename = "85ad13f7-3d1b-5128-9eb2-7cd8ee0b5741")]
    pub valorant_points: Option<i64>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct UpgradeCurrencyOffer {
    #[serde(rename = "OfferID")]
    pub offer_id: String,
    #[serde(rename = "StorefrontItemID")]
    pub storefront_item_id: String,
    #[serde(rename = "Offer")]
    pub offer: Offer,
    #[serde(rename = "DiscountedPercent")]
    pub discounted_percent: Option<f64>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct UpgradeCurrencyStore {
    #[serde(rename = "UpgradeCurrencyOffers")]
    pub upgrade_currency_offers: Vec<UpgradeCurrencyOffer>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct MatchHistoryResponse {
    /** Player UUID */
    #[serde(rename = "Subject")]
    pub subject: String,
    #[serde(rename = "BeginIndex")]
    pub begin_index: i64,
    #[serde(rename = "EndIndex")]
    pub end_index: i64,
    #[serde(rename = "Total")]
    pub total: i64,
    #[serde(rename = "History")]
    pub history: Vec<MatchID>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct MatchID {
    /** Match ID */
    #[serde(rename = "MatchID")]
    pub match_id: String,
    /** Milliseconds since epoch */
    #[serde(rename = "GameStartTime")]
    pub game_start_time: i64,
    /** Queue ID */
    #[serde(rename = "QueueID")]
    pub queue_id: String,
}

/*
#[derive(Debug, Serialize, Deserialize)]
pub struct MatchDetailsResponse {
    pub match_info: {
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
}
*/

#[derive(Debug, Serialize, Deserialize)]
pub struct WalletResponse {
    #[serde(rename = "Balances")]
    pub balances: BalancesInternal,

    #[serde(rename = "CurrencyLimits")]
    pub currency_limits: CurrencyLimits,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct BalancesInternal {
    #[serde(rename = "85ad13f7-3d1b-5128-9eb2-7cd8ee0b5741")]
    pub valorant_points: Option<i64>,

    #[serde(rename = "85ca954a-41f2-ce94-9b45-8ca3dd39a00d")]
    pub kingdom_credits: Option<i64>,

    #[serde(rename = "e59aa87c-4cbf-517a-5983-6e81511be9b7")]
    pub radianite: Option<i64>,

    #[serde(rename = "f08d4ae3-939c-4576-ab26-09ce1f23bb37")]
    pub free_agents: Option<i64>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct CurrencyLimits {
    #[serde(rename = "85ca954a-41f2-ce94-9b45-8ca3dd39a00d")]
    pub kingdom_credits_limits: Option<CreditLimits>,

    #[serde(rename = "85ad13f7-3d1b-5128-9eb2-7cd8ee0b5741")]
    pub valorant_points_limits: Option<CreditLimits>,

    #[serde(rename = "e59aa87c-4cbf-517a-5983-6e81511be9b7")]
    pub radianite_limits: Option<CreditLimits>,

    #[serde(rename = "f08d4ae3-939c-4576-ab26-09ce1f23bb37")]
    pub free_agents_limits: Option<CreditLimits>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct CreditLimits {
    #[serde(rename = "Limits")]
    pub limits: Option<Limits>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Limits {
    #[serde(rename = "bdf142e6-72fa-5f47-8983-8a68e902abb5")]
    pub limit: Option<Limit>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Limit {
    #[serde(rename = "amount")]
    pub amount: Option<i32>,

    #[serde(rename = "limitType")]
    pub limit_type: Option<String>,
}