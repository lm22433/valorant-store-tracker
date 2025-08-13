pub const ENTITLEMENT_URL: &str = "https://entitlements.auth.riotgames.com/api/token/v1";
pub const PLAYER_INFO_URL: &str = "https://auth.riotgames.com/userinfo";
pub const RIOT_GEO_PAS: &str = "https://riot-geo.pas.si.riotgames.com/pas/v1/product/valorant";

#[inline]
pub fn storefront_url(shard: &str, puuid: &str) -> String {
	format!(
		"https://pd.{}.a.pvp.net/store/v3/storefront/{}",
		shard, puuid
	)
}

pub fn wallet_url(shard: &str, puuid: &str) -> String {
	format!(
		"https://pd.{}.a.pvp.net/store/v1/wallet/{}",
		shard, puuid
	)
}

#[inline]
pub fn match_history_url(shard: &str, puuid: &str, start_index: &str, end_index: &str, queue: &str) -> String {
	format!(
		"https://pd.{}.a.pvp.net/match-history/v1/history/{}?startIndex={}&endIndex={}&queue={}",
		shard, puuid, start_index, end_index, queue
	)
}