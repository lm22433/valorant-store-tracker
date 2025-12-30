mod auth;
mod store;
mod helpers;
mod history;
mod live;

use crate::auth::*;
use crate::store::*;
use crate::history::*;
use crate::live::*;
use crate::helpers::{get_game_name};
use valorant_api::client::ValorantApiClient;
use valorant_api::http::reqwest::ReqwestHttpClient;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let http_client = ReqwestHttpClient::new().expect("failed to build http client");
    let valorant_api = ValorantApiClient::new(http_client);

    tauri::Builder::default()
        .plugin(tauri_plugin_store::Builder::new().build())
        .plugin(tauri_plugin_opener::init())
        .manage(valorant_api)
        .invoke_handler(tauri::generate_handler![
            initiate_auth_flow,
            is_logged_in,
            get_account_info_command,
            get_game_name,
            get_store_data,
            get_history_data,
            get_match_data,
            get_current_match,
            get_player_mmr,
            get_competitive_updates,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
