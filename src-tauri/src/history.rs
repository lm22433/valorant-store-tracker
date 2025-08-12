use crate::auth::{get_account_info, get_active_account, get_entitlements_token, get_client_version};
use valorant_api::models::MatchHistoryResponse;

#[tauri::command]
pub async fn get_history_data(app: tauri::AppHandle) -> Result<MatchHistoryResponse, String> {
    let puuid = get_active_account(&app).map_err(|e| e.to_string())?;
    let account_info = get_account_info(&app, None).map_err(|e| e.to_string())?;
    let access_token = account_info.access_token.clone();

    let client_platform = "ew0KCSJwbGF0Zm9ybVR5cGUiOiAiUEMiLA0KCSJwbGF0Zm9ybU9TIjogIldpbmRvd3MiLA0KCSJwbGF0Zm9ybU9TVmVyc2lvbiI6ICIxMC4wLjE5MDQyLjEuMjU2LjY0Yml0IiwNCgkicGxhdGZvcm1DaGlwc2V0IjogIlVua25vd24iDQp9";
    let client_version = get_client_version().await?.data.riotClientVersion;

    let entitlement_token = get_entitlements_token(access_token.clone())
        .await
        .map_err(|e| e.to_string())?
        .entitlements_token;

    let match_history: MatchHistoryResponse = get_match_history(
        &account_info.affinity,
        &puuid,
        "0",
        "20",
        "competitive",
        client_platform,
        &client_version,
        &entitlement_token,
        &access_token,
    ).await?;

    Ok(match_history)
}

pub async fn get_match_history(
    shard: &str,
    puuid: &str,
    start_index: &str,
    end_index: &str,
    queue: &str,
    client_platform: &str,
    client_version: &str,
    entitlement_token: &str,
    access_token: &str,
) -> Result<MatchHistoryResponse, String> {
    let url = format!("https://pd.{}.a.pvp.net/match-history/v1/history/{}?startIndex={}&endIndex={}&queue={}", shard, puuid, start_index, end_index, queue);

    let client = reqwest::Client::new();
    let response = client
        .get(&url)
        .bearer_auth(access_token)
        .header("X-Riot-ClientPlatform", client_platform)
        .header("X-Riot-ClientVersion", client_version)
        .header("X-Riot-Entitlements-JWT", entitlement_token)
        .body("{}")
        .send()
        .await
        .map_err(|e| e.to_string())?;

    if !response.status().is_success() {
        println!("Failed to get match history: {}", response.status());
        return Err(format!(
            "Failed to get match history: {}",
            response.status()
        ));
    }

    let response_text = response.text().await.map_err(|e| e.to_string())?;

    print!("{}", response_text);

    let json = serde_json::from_str::<MatchHistoryResponse>(&response_text).map_err(|e| e.to_string())?;

    //let json = response.json::<MatchHistoryResponse>()
    //    .await.map_err(|e| e.to_string())?;

    Ok(json)
}