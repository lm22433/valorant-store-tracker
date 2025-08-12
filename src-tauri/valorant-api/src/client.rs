use crate::config::ValorantApiConfig;
use crate::errors::ValorantApiError;
use crate::http::HttpClient;
use crate::models::{EntitlementResponse, PlayerInfoResponse, RiotGeoResponse, StorefrontResponse};

pub struct ValorantApiClient<C: HttpClient> {
    http_client: C,
    config: ValorantApiConfig,
}

impl<C: HttpClient> ValorantApiClient<C> {
    // PvP Endpoints
    pub async fn get_account_xp(&self) {
        unimplemented!()
    }

    pub async fn get_player_loadout(&self) {
        unimplemented!()
    }

    pub async fn get_player_mmr(&self) {
        unimplemented!()
    }

    pub async fn get_match_history(&self) {
        unimplemented!()
    }

    pub async fn get_match_details(&self) {
        unimplemented!()
    }

    pub async fn get_competitive_updates(&self) {
        unimplemented!()
    }

    pub async fn get_leaderboard(&self) {
        unimplemented!()
    }

    // Store Endpoints
    pub async fn get_prices(&self) {
        unimplemented!()
    }

    pub async fn get_storefront(&self) -> Result<StorefrontResponse, ValorantApiError>{
        unimplemented!()
    }

    pub async fn get_wallet(&self) {
        unimplemented!()
    }

    pub async fn get_owned_items(&self) {
        unimplemented!()
    }

    // Authentication Endpoints
    pub async fn get_entitlements(&self, auth_token: &str) -> Result<EntitlementResponse, ValorantApiError> {
        unimplemented!()
    }

    pub async fn get_player_info(&self, auth_token: &str) -> Result<PlayerInfoResponse, ValorantApiError> {
        unimplemented!()
    }

    pub async fn get_riot_geo(&self, auth_token: &str, id_token: &str) -> Result<RiotGeoResponse, ValorantApiError> {
        unimplemented!()
    }
}
