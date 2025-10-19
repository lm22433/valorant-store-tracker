export interface ProcessedLiveData {
  mapUrl: string;
  mode: string;
  players: {
    subject: string;
    teamId: ("Blue" | "Red") | string;
    characterId: string;
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