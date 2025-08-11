use std::collections::HashMap;
use serde::{Deserialize, Serialize};
use tauri::{Emitter, Manager, Url};
use tauri_plugin_store::StoreExt;
use valorant_api::models::{EntitlementResponse, PlayerInfoResponse, RiotGeoBody, RiotGeoResponse};

#[derive(Debug, Serialize, Deserialize)]
pub struct AccountInfo {
    pub access_token: String,
    pub id_token: String,
    pub region: String,
    pub affinity: String,
    pub username: String,
    pub game_name: String,
    pub tag_line: String,
}

#[tauri::command]
pub async fn initiate_auth_flow(app: tauri::AppHandle) {
    let auth_url = Url::parse("https://auth.riotgames.com/authorize?redirect_uri=https%3A%2F%2Fplayvalorant.com%2Fopt_in&client_id=play-valorant-web-prod&response_type=token%20id_token&nonce=1&scope=account%20openid").unwrap();
    let window_label = "riot-api-auth";

    tauri::WebviewWindowBuilder::new(&app, window_label, tauri::WebviewUrl::External(auth_url))
        .center()
        .on_navigation({
            let app = app.clone();
            move |url| {
                if url.as_str().starts_with("https://playvalorant.com/")
                    && url.as_str().contains("access_token")
                {
                    if let Some(fragment) = url.fragment() {
                        let fragment_params = extract_fragment_params(fragment);
                        if let (Some(access_token), Some(id_token)) = (
                            fragment_params.get("access_token").cloned(),
                            fragment_params.get("id_token").cloned(),
                        ) {
                            let app = app.clone();
                            tauri::async_runtime::spawn(async move {
                                let store = app.store("credentials.json").unwrap();

                                // Get player info
                                let player_info =
                                    get_player_info(access_token.clone()).await.unwrap();
                                let puuid = player_info.sub.clone();

                                // Get region + affinity
                                let geo = get_riot_geo(access_token.clone(), id_token.clone())
                                    .await
                                    .unwrap();

                                // Load accounts object or create new
                                let mut accounts = store
                                    .get("accounts")
                                    .and_then(|v| serde_json::from_value(v).ok())
                                    .unwrap_or(serde_json::Map::new());

                                let account_info = AccountInfo {
                                    access_token: access_token.clone(),
                                    id_token: id_token.clone(),
                                    region: geo.affinities.live.clone(),
                                    affinity: geo.affinities.live.clone(),
                                    username: player_info.username.clone(),
                                    game_name: player_info.acct.game_name.clone(),
                                    tag_line: player_info.acct.tag_line.clone(),
                                };

                                // Insert/update account data
                                accounts.insert(
                                    puuid.clone(),
                                    serde_json::to_value(&account_info).unwrap()
                                );

                                store.set("accounts", accounts);
                                store.set("active_account", puuid);

                                app.emit("logged-in", ()).unwrap();
                                if let Some(window) = app.get_webview_window("riot-api-auth") {
                                    window.close().unwrap();
                                }
                            });
                        }
                    }
                }
                true
            }
        })
        .title("Login to Riot")
        .build()
        .unwrap();
}

fn extract_fragment_params(fragment: &str) -> HashMap<String, String> {
    fragment
        .split('&')
        .filter_map(|kv| {
            let mut split = kv.splitn(2, '=');
            Some((split.next()?.to_string(), split.next()?.to_string()))
        })
        .collect()
}

pub fn get_active_account(app: &tauri::AppHandle) -> Result<String, String> {
    let store = app.store("credentials.json").map_err(|e| e.to_string())?;
    store.get("active_account")
        .and_then(|v| v.as_str().map(String::from))
        .ok_or_else(|| "No active account found".to_string())
}

pub fn get_account_info(
    app: &tauri::AppHandle,
    puuid: Option<&str>,
) -> Result<AccountInfo, String> {
    let store = app.store("credentials.json").map_err(|e| e.to_string())?;
    let accounts: serde_json::Map<String, serde_json::Value> = store
        .get("accounts")
        .and_then(|v| serde_json::from_value(v).ok())
        .ok_or_else(|| "No accounts found".to_string())?;

    let active_account = get_active_account(app)?;
    let puuid = puuid.unwrap_or(&*active_account);
    accounts.get(puuid)
        .and_then(|v| serde_json::from_value(v.clone()).ok())
        .ok_or_else(|| format!("No account found for PUUID: {}", puuid))
}

#[tauri::command]
pub async fn is_logged_in(app: tauri::AppHandle) -> Result<bool, String> {
    let token = get_account_info(&app, None).map_err(|e| e)?.access_token;

    if token.is_empty() {
        return Ok(false);
    }

    let client = reqwest::Client::new();
    let response = client
        .get("https://auth.riotgames.com/userinfo")
        .bearer_auth(&token)
        .send()
        .await
        .map_err(|e| e.to_string())?;

    if !response.status().is_success() {
        return Ok(false);
    }

    Ok(true)
}

#[tauri::command]
pub async fn get_account_info_command(app: tauri::AppHandle) -> Result<PlayerInfoResponse, String> {
    let account_info = get_account_info(&app, None)
        .map_err(|e| e.to_string())?;

    get_player_info(account_info.access_token).await
}

pub async fn get_player_info(access_token: String) -> Result<PlayerInfoResponse, String> {
    let client = reqwest::Client::new();
    let response = client
        .get("https://auth.riotgames.com/userinfo")
        .bearer_auth(access_token)
        .send()
        .await
        .map_err(|e| e.to_string())?;

    if !response.status().is_success() {
        return Err(format!("Failed to get player info: {}", response.status()));
    }

    let json = response
        .json::<PlayerInfoResponse>()
        .await
        .map_err(|e| e.to_string())?;

    Ok(json)
}

pub async fn get_entitlements_token(access_token: String) -> Result<EntitlementResponse, String> {
    let client = reqwest::Client::new();
    let response = client
        .post("https://entitlements.auth.riotgames.com/api/token/v1")
        .header(reqwest::header::CONTENT_TYPE, "application/json")
        .bearer_auth(access_token)
        .send()
        .await
        .map_err(|e| e.to_string())?;

    if !response.status().is_success() {
        return Err(format!(
            "Failed to get entitlements token: {}",
            response.status()
        ));
    }

    let json = response
        .json::<EntitlementResponse>()
        .await
        .map_err(|e| e.to_string())?;
    Ok(json)
}

pub async fn get_riot_geo(
    access_token: String,
    id_token: String,
) -> Result<RiotGeoResponse, String> {
    let client = reqwest::Client::new();
    let response = client
        .put("https://riot-geo.pas.si.riotgames.com/pas/v1/product/valorant")
        .bearer_auth(access_token)
        .json(&RiotGeoBody { id_token })
        .send()
        .await
        .map_err(|e| e.to_string())?;

    if !response.status().is_success() {
        return Err(format!("Failed to get Riot Geo: {}", response.status()));
    }

    let json = response
        .json::<RiotGeoResponse>()
        .await
        .map_err(|e| e.to_string())?;
    Ok(json)
}
