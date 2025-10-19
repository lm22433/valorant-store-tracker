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

export enum MatchResult {
    WIN,
    LOSS,
    DRAW,
}

// Allow importing enum members directly (e.g., import { WIN } from './types')
export const WIN = MatchResult.WIN;
export const LOSS = MatchResult.LOSS;
export const DRAW = MatchResult.DRAW;

export interface ProcessedHistoryData {
    result: MatchResult;
    mapUrl: string;
    gameLengthMillis: number | null;
    gameStartMillis: number;
    queueID: string;
    players: PlayerInfo[];
    teams: TeamInfo[];
}