import { useCallback, useEffect, useRef, useState } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { PlayerInfoResponse, CurrentMatchResponse, NameServiceResponse } from '../types';
import { ValorantAgent, ValorantAPIMapResponse, ValorantAPIAgentResponse, ValorantMap } from '../history/types';

interface UseLiveDataResult {
	user: PlayerInfoResponse | null;
	match: CurrentMatchResponse | null;
	names: NameServiceResponse | null;
	maps: ValorantMap[];
	agents: ValorantAgent[];
	isLoading: boolean;
	error: String | null;
	refetch: () => void;
}

export const useLiveData = (): UseLiveDataResult => {
	const [user, setUser] = useState<PlayerInfoResponse | null>(null);
    const [match, setMatch] = useState<CurrentMatchResponse | null>(null);
	const [names, setNames] = useState<NameServiceResponse | null>(null);
	const [maps, setMaps] = useState<ValorantMap[]>([]);
	const [agents, setAgents] = useState<ValorantAgent[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<String | null>(null);

	const cachedMaps = useRef<ValorantMap[]>([]);
	const cachedAgents = useRef<ValorantAgent[]>([]);

	const fetchMapData = useCallback(async (): Promise<ValorantMap[]> => {
		if (cachedMaps.current.length) return cachedMaps.current;
		try {
			const response = await fetch('https://valorant-api.com/v1/maps');
			if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
			const data: ValorantAPIMapResponse = await response.json();
			if (data.status === 200) return (data.data.map(map => ({
				uuid: map.uuid,
				assetPath: map.assetPath,
				displayName: map.displayName,
				listViewIcon: map.splash
			})));
			throw new Error(`API returned status ${data.status}`);
		} catch (error) {
			console.error('Failed to fetch map data:', error);
			throw error;
		}
	}, []);

	const fetchAgentData = useCallback(async (): Promise<ValorantAgent[]> => {
		if (cachedAgents.current.length) return cachedAgents.current;
		try {
			const response = await fetch('https://valorant-api.com/v1/agents?isPlayableCharacter=true');
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
			const [userResponse, matchResponse, mapResponse, agentResponse] = await Promise.all([
				invoke<PlayerInfoResponse>('get_account_info_command'),
				invoke<CurrentMatchResponse>('get_current_match'),
				fetchMapData(),
				fetchAgentData()
			]);
			setUser(userResponse);
            setMatch(matchResponse);
			setMaps(mapResponse);
			setAgents(agentResponse);
			cachedMaps.current = mapResponse;
			cachedAgents.current = agentResponse;

			const nameResponse = await invoke<NameServiceResponse>('get_game_name', { puuids: matchResponse.Players.map(p => p.Subject) });
			setNames(nameResponse);
			
		} catch (error) {
			console.error('Failed to fetch match:', error);
			setError(error instanceof Error ? error.message : typeof(error) === 'string' ? error : 'Failed to fetch match');
		} finally {
			setIsLoading(false);
		}
	}, []);

	const fetched = useRef(false);
	useEffect(() => {
		if (fetched.current) return;
		fetched.current = true;
		fetchData();
	}, [fetchData]);

	return { user, match, names, maps, agents, isLoading, error, refetch: fetchData };
};

export default useLiveData;
