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

// CHATGPT CODE

use serde_json::Value;

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct MatchDetailsResponse {
    pub match_info: MatchInfo,
    pub players: Vec<Player>,
    pub bots: Vec<Value>,
    pub coaches: Vec<Coach>,
    pub teams: Option<Vec<Team>>,
    pub round_results: Option<Vec<RoundResult>>,
    pub kills: Option<Vec<Kill>>,
}

/* ===== Shared Types ===== */

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Location {
    pub x: f64,
    pub y: f64,
}

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct PlayerLocation {
    pub subject: String,
    pub view_radians: f64,
    pub location: Location,
}

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct FinishingDamage {
    pub damage_type: DamageType,
    pub damage_item: String,
    pub is_secondary_fire_mode: bool,
}

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct PlayerEconomy {
    pub loadout_value: i64,
    pub weapon: String,
    pub armor: String,
    pub remaining: i64,
    pub spent: i64,
}

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AbilityEffects {
    pub grenade_effects: Option<Value>,
    pub ability1_effects: Option<Value>,
    pub ability2_effects: Option<Value>,
    pub ultimate_effects: Option<Value>,
}

/* ===== Enums for Fixed Strings ===== */

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "PascalCase")]
pub enum TeamId {
    Blue,
    Red,
    #[serde(rename = "")]
    Empty,
}

#[derive(Debug, Serialize, Deserialize)]
pub enum ProvisioningFlowID {
    Matchmaking,
    CustomGame,
}

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "PascalCase")]
pub enum CompletionState {
    Surrendered,
    Completed,
    VoteDraw,
    #[serde(rename = "")]
    Empty,
}

#[derive(Debug, Serialize, Deserialize)]
pub enum PlatformType {
    #[serde(rename = "pc")]
    PC,
}

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "PascalCase")]
pub enum RoundResultType {
    Eliminated,
    #[serde(rename = "Bomb detonated")]
    BombDetonated,
    #[serde(rename = "Bomb defused")]
    BombDefused,
    Surrendered,
    #[serde(rename = "Round timer expired")]
    RoundTimerExpired,
}

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "PascalCase")]
pub enum RoundCeremony {
    CeremonyDefault,
    CeremonyTeamAce,
    CeremonyFlawless,
    CeremonyCloser,
    CeremonyClutch,
    CeremonyThrifty,
    CeremonyAce,
    #[serde(rename = "")]
    Empty,
}

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "PascalCase")]
pub enum PlantSite {
    A,
    B,
    C,
    #[serde(rename = "")]
    Empty,
}

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "PascalCase")]
pub enum DamageType {
    Weapon,
    Bomb,
    Ability,
    Fall,
    Melee,
    Invalid,
    #[serde(rename = "")]
    Empty,
}

/* ===== Match Info ===== */

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct MatchInfo {
    pub match_id: String,
    pub map_id: String,
    pub game_pod_id: String,
    pub game_loop_zone: String,
    pub game_server_address: String,
    pub game_version: String,
    pub game_length_millis: Option<i64>,
    pub game_start_millis: i64,
    #[serde(rename = "provisioningFlowID")]
    pub provisioning_flow_id: ProvisioningFlowID,
    pub is_completed: bool,
    pub is_early_completion: bool,
    pub custom_game_name: String,
    pub force_post_processing: bool,
    #[serde(rename = "queueID")]
    pub queue_id: String,
    pub game_mode: String,
    pub is_ranked: bool,
    pub is_match_sampled: bool,
    pub season_id: String,
    pub completion_state: CompletionState,
    pub platform_type: PlatformType,
    pub premier_match_info: Value,
    pub party_rr_penalties: Option<HashMap<String, i64>>,
    pub should_match_disable_penalties: bool,
    pub new_map_loss_reduction_modifier: i64,
    pub is_replay_recorded: bool,
}

/* ===== Players ===== */

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Player {
    pub subject: String,
    pub game_name: String,
    pub tag_line: String,
    pub platform_info: PlatformInfo,
    pub team_id: String, // Not strict enum because TypeScript allowed string
    pub party_id: String,
    pub character_id: String,
    pub stats: Option<PlayerStats>,
    pub round_damage: Option<Vec<RoundDamage>>,
    pub competitive_tier: i64,
    pub is_observer: bool,
    pub player_card: String,
    pub player_title: String,
    pub preferred_level_border: Option<String>,
    pub account_level: i64,
    pub session_playtime_minutes: Option<i64>,
    pub xp_modifications: Option<Vec<XpModification>>,
    pub behavior_factors: Option<BehaviorFactors>,
    pub new_player_experience_details: Option<NewPlayerExperienceDetails>,
}

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct PlatformInfo {
    pub platform_type: PlatformType,
    #[serde(rename = "platformOS")]
    pub platform_os: String,
    #[serde(rename = "platformOSVersion")]
    pub platform_os_version: String,
    pub platform_chipset: String,
}

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct PlayerStats {
    pub score: i64,
    pub rounds_played: i64,
    pub kills: i64,
    pub deaths: i64,
    pub assists: i64,
    pub playtime_millis: i64,
    pub ability_casts: Option<AbilityCasts>,
}

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AbilityCasts {
    pub grenade_casts: i64,
    pub ability1_casts: i64,
    pub ability2_casts: i64,
    pub ultimate_casts: i64,
}

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct RoundDamage {
    pub round: i64,
    pub receiver: String,
    pub damage: i64,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct XpModification {
    #[serde(rename = "Value")]
    pub value: f64,
    #[serde(rename = "ID")]
    pub id: String,
    #[serde(rename = "IncludeInV2")]
    pub include_in_v2: bool,
    #[serde(rename = "Type")]
    pub xp_type: i64,
}

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct BehaviorFactors {
    pub afk_rounds: f64,
    pub collisions: Option<f64>,
    pub comms_rating_recovery: f64,
    pub damage_participation_outgoing: f64,
    pub friendly_fire_incoming: Option<f64>,
    pub friendly_fire_outgoing: Option<f64>,
    pub mouse_movement: Option<f64>,
    pub stayed_in_spawn_rounds: Option<f64>,
}

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct NewPlayerExperienceDetails {
    pub basic_movement: TimeMetrics,
    pub basic_gun_skill: TimeMetrics,
    pub adaptive_bots: AdaptiveBots,
    pub ability: TimeMetrics,
    pub bomb_plant: TimeMetrics,
    pub defend_bomb_site: DefendBombSite,
    pub setting_status: SettingStatus,
    pub version_string: String,
}

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct TimeMetrics {
    pub idle_time_millis: i64,
    pub objective_complete_time_millis: i64,
}

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AdaptiveBots {
    pub adaptive_bot_average_duration_millis_all_attempts: i64,
    pub adaptive_bot_average_duration_millis_first_attempt: i64,
    pub kill_details_first_attempt: Option<Value>,
    pub idle_time_millis: i64,
    pub objective_complete_time_millis: i64,
}

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct DefendBombSite {
    pub success: bool,
    pub idle_time_millis: i64,
    pub objective_complete_time_millis: i64,
}

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct SettingStatus {
    pub is_mouse_sensitivity_default: bool,
    pub is_crosshair_default: bool,
}

/* ===== Coaches / Teams ===== */

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Coach {
    pub subject: String,
    pub team_id: TeamId,
}

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Team {
    pub team_id: String,
    pub won: bool,
    pub rounds_played: i64,
    pub rounds_won: i64,
    pub num_points: i64,
}

/* ===== Rounds ===== */

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct RoundResult {
    pub round_num: i64,
    pub round_result: RoundResultType,
    pub round_ceremony: RoundCeremony,
    pub winning_team: String,
    pub bomb_planter: Option<String>,
    pub bomb_defuser: Option<String>,
    pub plant_round_time: Option<i64>,
    pub plant_player_locations: Option<Vec<PlayerLocation>>,
    pub plant_location: Location,
    pub plant_site: PlantSite,
    pub defuse_round_time: Option<i64>,
    pub defuse_player_locations: Option<Vec<PlayerLocation>>,
    pub defuse_location: Location,
    pub player_stats: Vec<RoundPlayerStats>,
    pub round_result_code: String,
    pub player_economies: Option<Vec<PlayerEconomy>>,
    pub player_scores: Option<Vec<PlayerScore>>,
}

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct RoundPlayerStats {
    pub subject: String,
    pub kills: Vec<KillEvent>,
    pub damage: Vec<DamageEvent>,
    pub score: i64,
    pub economy: PlayerEconomy,
    pub ability: AbilityEffects,
    pub was_afk: bool,
    pub was_penalized: bool,
    pub stayed_in_spawn: bool,
}

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct KillEvent {
    pub game_time: i64,
    pub round_time: i64,
    pub killer: String,
    pub victim: String,
    pub victim_location: Location,
    pub assistants: Vec<String>,
    pub player_locations: Vec<PlayerLocation>,
    pub finishing_damage: FinishingDamage,
}

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct DamageEvent {
    pub receiver: String,
    pub damage: i64,
    pub legshots: i64,
    pub bodyshots: i64,
    pub headshots: i64,
}

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct PlayerScore {
    pub subject: String,
    pub score: i64,
}

/* ===== Kills ===== */

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Kill {
    pub game_time: i64,
    pub round_time: i64,
    pub killer: String,
    pub victim: String,
    pub victim_location: Location,
    pub assistants: Vec<String>,
    pub player_locations: Vec<PlayerLocation>,
    pub finishing_damage: FinishingDamage,
    pub round: i64,
}
