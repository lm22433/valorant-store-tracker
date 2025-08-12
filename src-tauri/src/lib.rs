mod auth;
mod store;
mod history;

use crate::auth::*;
use crate::store::*;
use crate::history::*;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_store::Builder::new().build())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            initiate_auth_flow,
            is_logged_in,
            get_account_info_command,
            get_store_data,
            get_history_data,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
