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
    mapName: string;
    gameLengthMillis: number | null;
    gameStartMillis: number;
    queueID: string;
}

export interface ProcessedHistoryData {
    matchInfo: MatchInfo;
    playerInfo: PlayerInfo[];
    teamInfo: TeamInfo[];
}