use crate::helpers::{get_account_info, get_active_account, get_entitlements_token, get_client_version};
use serde::Deserialize;
use valorant_api::models::{MatchDetailsResponse, MatchHistoryResponse, PlayerMMRResponse};
use valorant_api::models::CompetitiveUpdatesResponse;
use valorant_api::client::ValorantApiClient;
use valorant_api::http::reqwest::ReqwestHttpClient;
use tauri::Manager;

#[derive(Deserialize)]
pub struct GetHistoryDataArgs {
    #[serde(rename = "queueId")]
    queue_id: String,
    count: u8,
}

#[tauri::command]
pub async fn get_history_data(app: tauri::AppHandle, args: GetHistoryDataArgs) -> Result<MatchHistoryResponse, String> {
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
            &args.count.to_string(),
            &args.queue_id,
            client_platform,
            &client_version,
            &entitlement_token,
            &access_token,

        )
        .await
        .map_err(|e| e.to_string())?;

    Ok(match_history)
}

#[derive(Deserialize)]
pub struct GetMatchDataArgs {
    #[serde(rename = "matchId")]
    match_id: String,
}

#[tauri::command]
pub async fn get_match_data(app: tauri::AppHandle, args: GetMatchDataArgs) -> Result<MatchDetailsResponse, String> {
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
            &args.match_id,
            client_platform,
            &client_version,
            &entitlement_token,
            &access_token,
        )
        .await
        .map_err(|e| e.to_string())?;

    Ok(match_details)
}

#[derive(Deserialize)]
pub struct GetMmrArgs {
    puuid: Option<String>,
}

#[tauri::command]
pub async fn get_player_mmr(app: tauri::AppHandle, args: GetMmrArgs) -> Result<PlayerMMRResponse, String> {
    let puuid = match args.puuid {
        Some(p) => p,
        None => get_active_account(&app).map_err(|e| e.to_string())?,
    };
    let account_info = get_account_info(&app, None).map_err(|e| e.to_string())?;
    let access_token = account_info.access_token.clone();

    let client_platform = "ew0KCSJwbGF0Zm9ybVR5cGUiOiAiUEMiLA0KCSJwbGF0Zm9ybU9TIjogIldpbmRvd3MiLA0KCSJwbGF0Zm9ybU9TVmVyc2lvbiI6ICIxMC4wLjE5MDQyLjEuMjU2LjY0Yml0IiwNCgkicGxhdGZvcm1DaGlwc2V0IjogIlVua25vd24iDQp9";
    let client_version = get_client_version().await?.data.riotClientVersion;

    let entitlement_token = get_entitlements_token(app.clone(), access_token.clone())
        .await
        .map_err(|e| e.to_string())?
        .entitlements_token;

    let api: tauri::State<ValorantApiClient<ReqwestHttpClient>> = app.state();
    let mmr: PlayerMMRResponse = api
        .get_mmr(
            &account_info.affinity,
            &puuid,
            client_platform,
            &client_version,
            &entitlement_token,
            &access_token,
        )
        .await
        .map_err(|e| e.to_string())?;

    Ok(mmr)
}

#[derive(Deserialize)]
pub struct GetCompetitiveUpdatesArgs {
    puuid: Option<String>,
    #[serde(rename = "startIndex")]
    start_index: Option<u32>,
    #[serde(rename = "endIndex")]
    end_index: Option<u32>,
    queue: Option<String>,
}

#[tauri::command]
pub async fn get_competitive_updates(app: tauri::AppHandle, args: GetCompetitiveUpdatesArgs) -> Result<CompetitiveUpdatesResponse, String> {
    let puuid = match args.puuid {
        Some(p) => p,
        None => get_active_account(&app).map_err(|e| e.to_string())?,
    };
    let account_info = get_account_info(&app, None).map_err(|e| e.to_string())?;
    let access_token = account_info.access_token.clone();

    let client_platform = "ew0KCSJwbGF0Zm9ybVR5cGUiOiAiUEMiLA0KCSJwbGF0Zm9ybU9TIjogIldpbmRvd3MiLA0KCSJwbGF0Zm9ybU9TVmVyc2lvbiI6ICIxMC4wLjE5MDQyLjEuMjU2LjY0Yml0IiwNCgkicGxhdGZvcm1DaGlwc2V0IjogIlVua25vd24iDQp9";
    let client_version = get_client_version().await?.data.riotClientVersion;

    let entitlement_token = get_entitlements_token(app.clone(), access_token.clone())
        .await
        .map_err(|e| e.to_string())?
        .entitlements_token;

    let start_index = args.start_index.unwrap_or(0).to_string();
    let end_index = args.end_index.unwrap_or(10).to_string();
    let queue = args.queue.unwrap_or_else(|| "".to_string());

    let api: tauri::State<ValorantApiClient<ReqwestHttpClient>> = app.state();
    let updates: CompetitiveUpdatesResponse = api
        .get_competitive_updates(
            &account_info.affinity,
            &puuid,
            &start_index,
            &end_index,
            &queue,
            client_platform,
            &client_version,
            &entitlement_token,
            &access_token,
        )
        .await
        .map_err(|e| e.to_string())?;

    Ok(updates)
}