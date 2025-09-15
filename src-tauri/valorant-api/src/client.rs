use crate::endpoints::{match_history_url, match_details_url, storefront_url, ENTITLEMENT_URL, PLAYER_INFO_URL, RIOT_GEO_PAS};
use crate::errors::ValorantApiError;
use crate::http::HttpClient;
use crate::models::{EntitlementResponse, PlayerInfoResponse, RiotGeoBody, RiotGeoResponse, StorefrontResponse, MatchHistoryResponse, MatchDetailsResponse};

pub struct ValorantApiClient<C: HttpClient> {
    http_client: C,
}

impl<C: HttpClient> ValorantApiClient<C> {
    pub fn new(http_client: C) -> Self {
        Self { http_client }
    }
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

    pub async fn get_match_history(
        &self,
        shard: &str,
        puuid: &str,
        start_index: &str,
        end_index: &str,
        queue: &str,
        client_platform: &str,
        client_version: &str,
        entitlement_token: &str,
        auth_token: &str,
    ) -> Result<MatchHistoryResponse, ValorantApiError> {
        let url = match_history_url(shard, puuid, start_index, end_index, queue);

        let resp = self.http_client
            .get(&url)
            .bearer_auth(auth_token)
            .header("X-Riot-ClientPlatform", client_platform)
            .header("X-Riot-ClientVersion", client_version)
            .header("X-Riot-Entitlements-JWT", entitlement_token)
            .json(&serde_json::json!({}))
            .send()
            .await?;

        let body = resp.json::<MatchHistoryResponse>()?;
        Ok(body)
    }

    pub async fn get_match_details(
        &self,
        shard: &str,
        match_id: &str,
        client_platform: &str,
        client_version: &str,
        entitlement_token: &str,
        auth_token: &str,
    ) -> Result<MatchDetailsResponse, ValorantApiError> {
        let url = match_details_url(shard, match_id);

        let resp = self.http_client
            .get(&url)
            .bearer_auth(auth_token)
            .header("X-Riot-ClientPlatform", client_platform)
            .header("X-Riot-ClientVersion", client_version)
            .header("X-Riot-Entitlements-JWT", entitlement_token)
            .json(&serde_json::json!({}))
            .send()
            .await?;

        let body = resp.json::<MatchDetailsResponse>()?;
        Ok(body)
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

    pub async fn get_storefront(
        &self,
        shard: &str,
        puuid: &str,
        client_platform: &str,
        client_version: &str,
        entitlement_token: &str,
        auth_token: &str,
    ) -> Result<StorefrontResponse, ValorantApiError> {
        let url = storefront_url(shard, puuid);

        let resp = self.http_client
            .post(url)
            .bearer_auth(auth_token)
            .header("X-Riot-ClientPlatform", client_platform)
            .header("X-Riot-ClientVersion", client_version)
            .header("X-Riot-Entitlements-JWT", entitlement_token)
            .json(&serde_json::json!({}))
            .send()
            .await?;
        let body = resp.json::<StorefrontResponse>()?;
        Ok(body)
    }

    pub async fn get_wallet(&self) {
        unimplemented!()
    }

    pub async fn get_owned_items(&self) {
        unimplemented!()
    }

    // Authentication Endpoints
    pub async fn get_entitlement(
        &self,
        auth_token: &str,
    ) -> Result<EntitlementResponse, ValorantApiError> {
        let resp = self.http_client
            .post(ENTITLEMENT_URL)
            .bearer_auth(auth_token)
            .content_type("application/json")
            .send()
            .await?;
        let body = resp.json::<EntitlementResponse>()?;
        Ok(body)
    }

    pub async fn get_player_info(
        &self,
        auth_token: &str,
    ) -> Result<PlayerInfoResponse, ValorantApiError> {
        let resp = self.http_client
            .get(PLAYER_INFO_URL)
            .bearer_auth(auth_token)
            .send()
            .await?;
        let body = resp.json::<PlayerInfoResponse>()?;
        Ok(body)
    }

    pub async fn get_riot_geo(
        &self,
        auth_token: &str,
        id_token: &str,
    ) -> Result<RiotGeoResponse, ValorantApiError> {
        let resp = self.http_client
            .put(RIOT_GEO_PAS)
            .bearer_auth(auth_token)
            .json(&RiotGeoBody { id_token: id_token.to_string() })
            .send()
            .await?;
        let body = resp.json::<RiotGeoResponse>()?;
        Ok(body)
    }
}

impl<C: HttpClient> ValorantApiClient<C> {}
