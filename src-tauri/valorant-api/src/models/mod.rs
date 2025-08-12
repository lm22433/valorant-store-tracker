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