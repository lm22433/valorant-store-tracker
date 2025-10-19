import { useQuery } from "@tanstack/react-query";
import { ValorantAgent, ValorantAPIAgentResponse, ValorantAPIMapResponse, ValorantMap } from "../types/assetTypes";

const fetchMapData = async (): Promise<ValorantMap[]> => {
    try {
        const response = await fetch('https://valorant-api.com/v1/maps');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data: ValorantAPIMapResponse = await response.json();
        if (data.status !== 200) throw new Error(`API returned status ${data.status}`);
        return data.data.map(map => ((<ValorantMap>{
            url: map.mapUrl,
            displayName: map.displayName,
            splash: map.splash
        })));
    } catch (error) {
        console.error('Failed to fetch map data:', error);
        throw error;
    }
};

const fetchAgentData = async (): Promise<ValorantAgent[]> => {
    try {
        const response = await fetch('https://valorant-api.com/v1/agents?isPlayableCharacter=true');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data: ValorantAPIAgentResponse = await response.json();
        if (data.status !== 200) throw new Error(`API returned status ${data.status}`);
        return data.data.map(agent => (<ValorantAgent>{
            uuid: agent.uuid,
            displayName: agent.displayName,
            displayIcon: agent.displayIcon
        }));
    } catch (error) {
        console.error('Failed to fetch agent data:', error);
        throw error;
    }
};

// React Query-powered assets hook (parameterless)
const useAssets = () => {
    const mapsQuery = useQuery<ValorantMap[]>({
        queryKey: ["assets", "maps"],
        queryFn: fetchMapData,
        staleTime: 24 * 60 * 60 * 1000,
        gcTime: 7 * 24 * 60 * 60 * 1000,
    });

    const agentsQuery = useQuery<ValorantAgent[]>({
        queryKey: ["assets", "agents"],
        queryFn: fetchAgentData,
        staleTime: 24 * 60 * 60 * 1000,
        gcTime: 7 * 24 * 60 * 60 * 1000,
    });

    return {
        maps: mapsQuery.data ?? [],
        agents: agentsQuery.data ?? [],
        isLoading: mapsQuery.isLoading || agentsQuery.isLoading,
        error: (mapsQuery.error || agentsQuery.error) ? ((mapsQuery.error || agentsQuery.error) instanceof Error ? (mapsQuery.error || agentsQuery.error as any).message : 'Failed to fetch assets') : null,
        refetch: () => { void Promise.all([mapsQuery.refetch(), agentsQuery.refetch()]); }
    };
};

export default useAssets;