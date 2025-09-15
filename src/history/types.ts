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
    displayName: string;
    listViewIcon: string;
}

export interface ValorantAgent {
    uuid: string;
    displayName: string;
    displayIcon: string;
}

export interface PlayerInfo {
    /** Player UUID */
    subject: string;
    gameName: string;
    tagLine: string;
    teamId: ("Blue" | "Red") | string;
    /** Party ID */
    partyId: string;
    /** Character ID */
    characterId: string;
    stats: {
        score: number;
        roundsPlayed: number;
        kills: number;
        deaths: number;
        assists: number;
        playtimeMillis: number;
        abilityCasts?: ({
            grenadeCasts: number;
            ability1Casts: number;
            ability2Casts: number;
            ultimateCasts: number;
        } | null) | undefined;
    } | null;
    roundDamage: {
        round: number;
        /** Player UUID */
        receiver: string;
        damage: number;
    }[] | null;
    competitiveTier: number;
    accountLevel: number;
}

export interface TeamInfo {
    teamId: ("Blue" | "Red") | string;
    won: boolean;
    roundsPlayed: number;
    roundsWon: number;
    numPoints: number;
}

export interface MatchInfo {
    playerIndex: number;
    agentName: string;
    agentIconUrl: string;
    mapName: string;
    mapIconUrl: string;
    gameLengthMillis: number | null;
    gameStartMillis: number;
    queueID: string;
}

export interface ProcessedMatchData {
    matchInfo: MatchInfo;
    playerInfo: PlayerInfo[];
    teamInfo: TeamInfo[];
}