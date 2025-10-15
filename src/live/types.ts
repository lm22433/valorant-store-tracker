import { ValorantAgent, ValorantMap } from "../history/types";

export interface ProcessedLiveData {
  map: ValorantMap | null;
  mode: string;
  players: {
    subject: string;
    teamId: ("Blue" | "Red") | string;
    agent: ValorantAgent | null;
    playerIdentity: {
      /** Player UUID */
      subject: string;
      /** Card ID */
      playerCardId: string;
      /** Title ID */
      playerTitleId: string;
      accountLevel: number;
      /** Preferred Level Border ID */
      preferredLevelBorderId: string | "";
      incognito: boolean;
      hideAccountLevel: boolean;
    };
    seasonalBadgeInfo: {
      /** Season ID */
      seasonId: string | "";
      numberOfWins: number;
      winsByTier: null;
      rank: number;
      leaderboardRank: number;
    };
    isCoach: boolean;
    isAssociated: boolean;
  }[];
}