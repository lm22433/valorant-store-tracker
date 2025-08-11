use crate::http::HttpClient;

pub struct ValorantApiConfig {

}

impl ValorantApiConfig {
    pub fn new() -> Self {
        Self { 

        }
    }
}

pub struct ValorantApiClient<C: HttpClient> {
    http_client: C,
    config: ValorantApiConfig,
}

impl<C: HttpClient> ValorantApiClient<C> {
    // PvP Endpoints
    pub async fn get_account_xp(&self) {

    }

    pub async fn get_player_loadout(&self) {

    }

    pub async fn get_player_mmr(&self) {

    }

    pub async fn get_match_history(&self) {

    }

    pub async fn get_match_details(&self) {

    }

    pub async fn get_competitive_updates(&self) {

    }

    pub async fn get_leaderboard(&self) {

    }

    // Store Endpoints
    pub async fn get_prices(&self) {

    }

    pub async fn get_storefront(&self) {

    }

    pub async fn get_wallet(&self) {

    }

    pub async fn get_owned_items(&self) {

    }

    // Authentication Endpoints
    pub async fn get_entitlements(&self) {

    }

    pub async fn get_player_info(&self) {

    }

    pub async fn get_riot_geo(&self) {

    }
}
