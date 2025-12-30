export interface ValorantRank {
    tier: number;
    tierName: string;
    division: string;
    divisionName: string;
    color: string;
    backgroundColor: string;
    smallIcon: string;
    largeIcon: string;
    rankTriangleDownIcon: string;
    rankTriangleUpIcon: string;
}[]

export interface ValorantAPIRankResponse {
    status: number;
    data: {
        uuid: string;
        assetObjectName: string;
        tiers: {
            tier: number;
            tierName: string;
            division: string;
            divisionName: string;
            color: string;
            backgroundColor: string;
            smallIcon: string;
            largeIcon: string;
            rankTriangleDownIcon: string;
            rankTriangleUpIcon: string;
        }[];
    }[];
    assetPath: string;
}

export interface ValorantAPIMapResponse {
  status: number;
  data: {
    uuid: string;
    displayName: string;
    narrativeDescription: string;
    tacticalDescription: string;
    coordinates: string;
    displayIcon: string;
    listViewIcon: string;
    listViewIconTall: string;
    splash: string;
    stylizedBackgroundImage: string;
    premierBackgroundImage: string;
    assetPath: string;
    mapUrl: string;
    xMultiplier: number;
    yMultiplier: number;
    xScalarToAdd: number;
    yScalarToAdd: number;
    callouts: {
        regionName: string;
        superRegionName: string;
        location: {
            x: number;
            y: number;
        }
    }
  }[]
}

export interface ValorantAPIAgentResponse {
    status: number;
    data: {
        uuid: string;
        displayName: string;
        description: string;
        developerName: string;
        releaseDate: Date;
        characterTags: string[];
        displayIcon: string;
        displayIconSmall: string;
        bustPortrait: string;
        fullPortrait: string;
        fullPortraitV2: string;
        killfeedPortrait: string;
        background: string;
        backgroundGradientColors: string[];
        assetPath: string;
        isFullPortraitRightFacing: boolean;
        isPlayableCharacter: boolean;
        isAvailableForTest: boolean;
        isBaseContent: boolean;
        role: {
            uuid: string;
            displayName: string;
            description: string;
            displayIcon: string;
            assetPath: string;
        }
        recruitmentData: {
            counterId: string;
            milestoneId: string;
            milestoneThreshold: number;
            useLevelVpCostOverride: boolean;
            levelVpCostOverride: number;
            startDate: Date;
            endDate: Date;
        }
        abilities: {
            slot: string;
            displayName: string;
            description: string;
            displayIcon: string;
        }[]
        voiceLine: {
            minDuration: number;
            maxDuration: number;
            mediaList: {
                id: number;
                wwise: string;
                wave: string;
            }[]
        }
    }[]
}

export interface ValorantMap {
    url: string;
    displayName: string;
    splash: string;
}

export interface ValorantAgent {
    uuid: string;
    displayName: string;
    displayIcon: string;
}