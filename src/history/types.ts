export interface ValorantAPIResponse {
  status: number;
  data: ValorantMap[];
}

export interface ValorantMap {
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
    player: string;
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