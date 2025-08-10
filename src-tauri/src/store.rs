use crate::auth::{get_account_info, get_active_account, get_entitlements_token};
use serde::{Deserialize, Serialize};
use valorant_api::models::StorefrontResponse;

#[tauri::command]
pub async fn get_store_data(app: tauri::AppHandle) -> Result<StorefrontResponse, String> {
    let puuid = get_active_account(&app).map_err(|e| e.to_string())?;
    let account_info = get_account_info(&app, None).map_err(|e| e.to_string())?;
    let access_token = account_info.access_token.clone();

    let client_platform = "ew0KCSJwbGF0Zm9ybVR5cGUiOiAiUEMiLA0KCSJwbGF0Zm9ybU9TIjogIldpbmRvd3MiLA0KCSJwbGF0Zm9ybU9TVmVyc2lvbiI6ICIxMC4wLjE5MDQyLjEuMjU2LjY0Yml0IiwNCgkicGxhdGZvcm1DaGlwc2V0IjogIlVua25vd24iDQp9";
    let client_version = get_client_version().await?.data.riotClientVersion;

    let entitlement_token = get_entitlements_token(access_token.clone())
        .await
        .map_err(|e| e.to_string())?
        .entitlements_token;

    let storefront = get_storefront(
        &account_info.affinity,
        &puuid,
        client_platform,
        &client_version,
        &entitlement_token,
        &access_token,
    )
        .await?;

    Ok(storefront)
}

#[derive(Debug, Serialize, Deserialize)]
pub struct ClientVersionResponse {
    pub status: i32,
    pub data: ClientVersionData,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct ClientVersionData {
    pub manifestId: String,
    pub branch: String,
    pub version: String,
    pub buildVersion: String,
    pub engineVersion: String,
    pub riotClientVersion: String,
    pub riotClientBuild: String,
    pub buildDate: String, // Use String for datetime or chrono::DateTime if you want parsing
}

pub async fn get_client_version() -> Result<ClientVersionResponse, String> {
    let client = reqwest::Client::new();
    let res = client
        .get("https://valorant-api.com/v1/version")
        .send()
        .await
        .map_err(|e| e.to_string())?
        .json::<ClientVersionResponse>()
        .await
        .map_err(|e| e.to_string())?;

    Ok(res)
}

pub async fn get_storefront(
    shard: &str,
    puuid: &str,
    client_platform: &str,
    client_version: &str,
    entitlement_token: &str,
    access_token: &str,
) -> Result<StorefrontResponse, String> {
    let url = format!("https://pd.{}.a.pvp.net/store/v3/storefront/{}", shard, puuid);

    let client = reqwest::Client::new();
    let response = client
        .post(&url)
        .bearer_auth(access_token)
        .header("X-Riot-ClientPlatform", client_platform)
        .header("X-Riot-ClientVersion", client_version)
        .header("X-Riot-Entitlements-JWT", entitlement_token)
        .body("{}")
        .send()
        .await
        .map_err(|e| e.to_string())?;

    if !response.status().is_success() {
        println!("Failed to get storefront: {}", response.status());
        return Err(format!(
            "Failed to get storefront: {}",
            response.status()
        ));
    }

    let json = response.json::<StorefrontResponse>()
        .await.map_err(|e| e.to_string())?;

    Ok(json)
}
