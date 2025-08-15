import { useCallback, useEffect, useRef, useState } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { PlayerInfoResponse, MatchDetailsResponse, MatchHistoryResponse } from '../types';
import { ValorantAPIAgentResponse, ValorantAPIMapResponse, ValorantMap, ValorantAgent } from '../history/types';

interface UseHistoryDataResult {
	user: PlayerInfoResponse | null;
	matches: MatchDetailsResponse[];
	maps: ValorantMap[];
	agents: ValorantAgent[];
	isLoading: boolean;
	error: String | null;
	refetch: () => void;
}

export const useHistoryData = (queueId: string): UseHistoryDataResult => {
	const [user, setUser] = useState<PlayerInfoResponse | null>(null);
	const [matches, setMatches] = useState<MatchDetailsResponse[]>([]);
	const [maps, setMaps] = useState<ValorantMap[]>([]);
	const [agents, setAgents] = useState<ValorantAgent[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<String | null>(null);

	const fetchMapData = useCallback(async (): Promise<ValorantMap[]> => {
		if (maps.length) return maps;
		try {
			const response = await fetch('https://valorant-api.com/v1/maps');
			if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
			const data: ValorantAPIMapResponse = await response.json();
			if (data.status === 200) return (data.data.map(map => ({
				displayName: map.displayName,
				listViewIcon: map.listViewIcon
			})));
			throw new Error(`API returned status ${data.status}`);
		} catch (error) {
			console.error('Failed to fetch map data:', error);
			throw error;
		}
	}, []);

	const fetchAgentData = useCallback(async (): Promise<ValorantAgent[]> => {
		if (agents.length) return agents;
		try {
			const response = await fetch('https://valorant-api.com/v1/agents');
			if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
			const data: ValorantAPIAgentResponse = await response.json();
			if (data.status === 200) return (data.data.map(agent => ({
				uuid: agent.uuid,
				displayName: agent.displayName,
				displayIcon: agent.displayIcon
			})));
			throw new Error(`API returned status ${data.status}`);
		} catch (error) {
			console.error('Failed to fetch agent data:', error);
			throw error;
		}
	}, []);

	const fetchData = useCallback(async () => {
		try {
			setIsLoading(true);
			setError(null);
			const [userResponse, historyResponse, mapResponse, agentResponse] = await Promise.all([
				invoke<PlayerInfoResponse>('get_account_info_command'),
				invoke<MatchHistoryResponse>('get_history_data', {args: {queueId: queueId}}),
				fetchMapData(),
				fetchAgentData()
			]);
			setUser(userResponse);
			setMaps(mapResponse);
			setAgents(agentResponse);

			const matchDetailsList = await Promise.all(
				historyResponse.History.map(match =>
					invoke<MatchDetailsResponse>('get_match_data', {args: {matchId: match.MatchID}})
				)
			);
			setMatches(matchDetailsList);
		} catch (error) {
			console.error('Failed to fetch match history:', error);
			setError(error instanceof Error ? error.message : typeof(error) === 'string' ? error : 'Failed to fetch match history');
		} finally {
			setIsLoading(false);
		}
	}, [queueId]);

	const fetched = useRef(false);
	useEffect(() => {
		if (fetched.current) return;
		fetched.current = true;
		fetchData();
	}, [fetchData]);

	return { user, matches, maps, agents, isLoading, error, refetch: fetchData };
};

export default useHistoryData;
