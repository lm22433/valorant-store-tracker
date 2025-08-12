use crate::helpers::{get_account_info, get_active_account, get_entitlements_token, get_client_version};
use valorant_api::models::StorefrontResponse;
use valorant_api::client::ValorantApiClient;
use valorant_api::http::reqwest::ReqwestHttpClient;
use tauri::Manager;

#[tauri::command]
pub async fn get_store_data(app: tauri::AppHandle) -> Result<StorefrontResponse, String> {
    let puuid = get_active_account(&app).map_err(|e| e.to_string())?;
    let account_info = get_account_info(&app, None).map_err(|e| e.to_string())?;
    let access_token = account_info.access_token.clone();

    let client_platform = "ew0KCSJwbGF0Zm9ybVR5cGUiOiAiUEMiLA0KCSJwbGF0Zm9ybU9TIjogIldpbmRvd3MiLA0KCSJwbGF0Zm9ybU9TVmVyc2lvbiI6ICIxMC4wLjE5MDQyLjEuMjU2LjY0Yml0IiwNCgkicGxhdGZvcm1DaGlwc2V0IjogIlVua25vd24iDQp9";
    let client_version = get_client_version().await?.data.riotClientVersion;

    let entitlement_token = get_entitlements_token(app.clone(), access_token.clone())
        .await
        .map_err(|e| e.to_string())?
        .entitlements_token;

    let api: tauri::State<ValorantApiClient<ReqwestHttpClient>> = app.state();
    let storefront = api
        .get_storefront(
            &account_info.affinity,
            &puuid,
            client_platform,
            &client_version,
            &entitlement_token,
            &access_token,
        )
        .await
        .map_err(|e| e.to_string())?;

    Ok(storefront)
}
