use std::collections::HashMap;
use tauri::{Emitter, Manager, Url};
use tauri_plugin_store::StoreExt;
use valorant_api::models::PlayerInfoResponse;
use valorant_api::client::ValorantApiClient;
use valorant_api::http::reqwest::ReqwestHttpClient;
use crate::helpers::{AccountInfo, get_player_info, get_riot_geo, get_account_info};

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
                                    get_player_info(app.clone(), access_token.clone()).await.unwrap();
                                let puuid = player_info.sub.clone();

                                // Get region + affinity
                                let geo = get_riot_geo(app.clone(), access_token.clone(), id_token.clone())
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

#[tauri::command]
pub async fn is_logged_in(app: tauri::AppHandle) -> Result<bool, String> {
    let token = get_account_info(&app, None).map_err(|e| e)?.access_token;

    if token.is_empty() {
        return Ok(false);
    }

    let api: tauri::State<ValorantApiClient<ReqwestHttpClient>> = app.state();
    match api.get_player_info(&token).await {
        Ok(_) => Ok(true),
        Err(_) => Ok(false),
    }
}

#[tauri::command]
pub async fn get_account_info_command(app: tauri::AppHandle) -> Result<PlayerInfoResponse, String> {
    let account_info = get_account_info(&app, None)
        .map_err(|e| e.to_string())?;

    get_player_info(app, account_info.access_token).await
}
