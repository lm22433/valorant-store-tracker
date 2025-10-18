import { useCallback, useState, useEffect } from "react";
import { ValorantAgent, ValorantAPIAgentResponse, ValorantAPIMapResponse, ValorantMap } from "../types/assetTypes";

const useAssets = (cachedMaps: React.MutableRefObject<ValorantMap[]>, cachedAgents: React.MutableRefObject<ValorantAgent[]>) => {
    const [maps, setMaps] = useState<ValorantMap[]>(cachedMaps.current);
    const [agents, setAgents] = useState<ValorantAgent[]>(cachedAgents.current);

    const fetchMapData = useCallback(async () => {
        if (cachedMaps.current.length) return cachedMaps.current;
        try {
            const response = await fetch('https://valorant-api.com/v1/maps');
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const data: ValorantAPIMapResponse = await response.json();
            if (data.status !== 200) throw new Error(`API returned status ${data.status}`);
            setMaps(data.data.map(map => ({
                uuid: map.uuid,
                assetPath: map.assetPath,
                displayName: map.displayName,
                listViewIcon: map.splash
            })));
        } catch (error) {
            console.error('Failed to fetch map data:', error);
            throw error;
        }
    }, []);

    const fetchAgentData = useCallback(async () => {
        if (cachedAgents.current.length) return cachedAgents.current;
        try {
            const response = await fetch('https://valorant-api.com/v1/agents?isPlayableCharacter=true');
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const data: ValorantAPIAgentResponse = await response.json();
            if (data.status !== 200) throw new Error(`API returned status ${data.status}`);
            setAgents(data.data.map(agent => ({
                uuid: agent.uuid,
                displayName: agent.displayName,
                displayIcon: agent.displayIcon
            })));
        } catch (error) {
            console.error('Failed to fetch agent data:', error);
            throw error;
        }
    }, []);

    useEffect(() => {
        fetchMapData();
        fetchAgentData();
    }, [fetchMapData, fetchAgentData]);

    return { maps, agents };
};

export default useAssets;