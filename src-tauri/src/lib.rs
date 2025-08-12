mod auth;
mod store;
mod helpers;

use crate::auth::*;
use crate::store::*;
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
            get_store_data,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
