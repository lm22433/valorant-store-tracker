use crate::helpers::{get_account_info, get_active_account, get_entitlements_token, get_client_version};
use valorant_api::models::{MatchDetailsResponse, MatchHistoryResponse};
use valorant_api::client::ValorantApiClient;
use valorant_api::http::reqwest::ReqwestHttpClient;
use tauri::Manager;

#[tauri::command]
pub async fn get_history_data(app: tauri::AppHandle) -> Result<MatchHistoryResponse, String> {
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
    let match_history: MatchHistoryResponse = api
        .get_match_history(
            &account_info.affinity,
            &puuid,
            "0",
            "20",
            "competitive",
            client_platform,
            &client_version,
            &entitlement_token,
            &access_token,
        )
        .await
        .map_err(|e| e.to_string())?;

        print!("here");

    Ok(match_history)
}

#[tauri::command]
pub async fn get_match_data(app: tauri::AppHandle, match_id: &str) -> Result<MatchDetailsResponse, String> {
    let account_info = get_account_info(&app, None).map_err(|e| e.to_string())?;
    let access_token = account_info.access_token.clone();

    let client_platform = "ew0KCSJwbGF0Zm9ybVR5cGUiOiAiUEMiLA0KCSJwbGF0Zm9ybU9TIjogIldpbmRvd3MiLA0KCSJwbGF0Zm9ybU9TVmVyc2lvbiI6ICIxMC4wLjE5MDQyLjEuMjU2LjY0Yml0IiwNCgkicGxhdGZvcm1DaGlwc2V0IjogIlVua25vd24iDQp9";
    let client_version = get_client_version().await?.data.riotClientVersion;

    let entitlement_token = get_entitlements_token(app.clone(), access_token.clone())
        .await
        .map_err(|e| e.to_string())?
        .entitlements_token;

    let api: tauri::State<ValorantApiClient<ReqwestHttpClient>> = app.state();
    let match_details: MatchDetailsResponse = api
        .get_match_details(
            &account_info.affinity,
            match_id,
            client_platform,
            &client_version,
            &entitlement_token,
            &access_token,
        )
        .await
        .map_err(|e| e.to_string())?;

    print!("{}", match_details.match_info.match_id);
    print!("here");

    Ok(match_details)
}