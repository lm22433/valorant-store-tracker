import { useQuery } from "@tanstack/react-query";
import { ValorantAgent, ValorantAPIAgentResponse, ValorantAPIMapResponse, ValorantAPIRankResponse, ValorantMap, ValorantRank } from "../types/assetTypes";

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

const fetchRankData = async (): Promise<ValorantRank[]> => {
    try {
        const response = await fetch('https://valorant-api.com/v1/competitivetiers');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data: ValorantAPIRankResponse = await response.json();
        if (data.status !== 200) throw new Error(`API returned status ${data.status}`);
        let ranks = [] as ValorantRank[];
        data.data.forEach(rank => {
            ranks = ranks.concat(rank.tiers as ValorantRank[]);
        });
        return ranks;
    } catch (error) {
        console.error('Failed to fetch rank data:', error);
        throw error;
    }
}


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

    const ranksQuery = useQuery<ValorantRank[]>({
        queryKey: ["assets", "ranks"],
        queryFn: fetchRankData,
        staleTime: 24 * 60 * 60 * 1000,
        gcTime: 7 * 24 * 60 * 60 * 1000,
    });

    return {
        maps: mapsQuery.data ?? [],
        agents: agentsQuery.data ?? [],
        ranks: ranksQuery.data ?? [],
        isLoading: mapsQuery.isLoading || agentsQuery.isLoading || ranksQuery.isLoading,
        error: (mapsQuery.error || agentsQuery.error || ranksQuery.error) ? ((mapsQuery.error || agentsQuery.error || ranksQuery.error) instanceof Error ? (mapsQuery.error || agentsQuery.error || ranksQuery.error as any).message : 'Failed to fetch assets') : null,
        refetch: () => { void Promise.all([mapsQuery.refetch(), agentsQuery.refetch(), ranksQuery.refetch()]); }
    };
};

export default useAssets;