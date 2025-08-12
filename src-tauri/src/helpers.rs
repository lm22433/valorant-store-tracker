use serde::{Deserialize, Serialize};
use tauri::Manager;
use tauri_plugin_store::StoreExt;
use valorant_api::client::ValorantApiClient;
use valorant_api::http::reqwest::ReqwestHttpClient;
use valorant_api::models::{EntitlementResponse, PlayerInfoResponse, RiotGeoResponse};

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct AccountInfo {
	pub access_token: String,
	pub id_token: String,
	pub region: String,
	pub affinity: String,
	pub username: String,
	pub game_name: String,
	pub tag_line: String,
}

pub fn get_active_account(app: &tauri::AppHandle) -> Result<String, String> {
	let store = app.store("credentials.json").map_err(|e| e.to_string())?;
	store
		.get("active_account")
		.and_then(|v| v.as_str().map(String::from))
		.ok_or_else(|| "No active account found".to_string())
}

pub fn get_account_info(app: &tauri::AppHandle, puuid: Option<&str>) -> Result<AccountInfo, String> {
	let store = app.store("credentials.json").map_err(|e| e.to_string())?;
	let accounts: serde_json::Map<String, serde_json::Value> = store
		.get("accounts")
		.and_then(|v| serde_json::from_value(v).ok())
		.ok_or_else(|| "No accounts found".to_string())?;

	let active_account = get_active_account(app)?;
	let puuid = puuid.unwrap_or(&*active_account);
	accounts
		.get(puuid)
		.and_then(|v| serde_json::from_value(v.clone()).ok())
		.ok_or_else(|| format!("No account found for PUUID: {}", puuid))
}

pub async fn get_player_info(app: tauri::AppHandle, access_token: String) -> Result<PlayerInfoResponse, String> {
	let api: tauri::State<ValorantApiClient<ReqwestHttpClient>> = app.state();
	let info = api
		.get_player_info(&access_token)
		.await
		.map_err(|e| e.to_string())?;
	Ok(info)
}

pub async fn get_entitlements_token(app: tauri::AppHandle, access_token: String) -> Result<EntitlementResponse, String> {
	let api: tauri::State<ValorantApiClient<ReqwestHttpClient>> = app.state();
	let token = api
		.get_entitlement(&access_token)
		.await
		.map_err(|e| e.to_string())?;
	Ok(token)
}

pub async fn get_riot_geo(app: tauri::AppHandle, access_token: String, id_token: String) -> Result<RiotGeoResponse, String> {
	let api: tauri::State<ValorantApiClient<ReqwestHttpClient>> = app.state();
	let geo = api
		.get_riot_geo(&access_token, &id_token)
		.await
		.map_err(|e| e.to_string())?;
	Ok(geo)
}

#[derive(Debug, Serialize, Deserialize)]
pub struct ClientVersionResponse {
	pub status: i32,
	pub data: ClientVersionData,
}

#[derive(Debug, Serialize, Deserialize)]
#[allow(non_snake_case)]
pub struct ClientVersionData {
	#[serde(rename = "manifestId")]
	pub manifestId: String,
	pub branch: String,
	pub version: String,
	#[serde(rename = "buildVersion")]
	pub buildVersion: String,
	#[serde(rename = "engineVersion")]
	pub engineVersion: String,
	#[serde(rename = "riotClientVersion")]
	pub riotClientVersion: String,
	#[serde(rename = "riotClientBuild")]
	pub riotClientBuild: String,
	#[serde(rename = "buildDate")]
	pub buildDate: String,
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
