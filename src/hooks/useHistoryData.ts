import { useCallback, useEffect, useState } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { MatchDetailsResponse, MatchHistoryResponse, PlayerInfoResponse } from '../types';

interface UseHistoryDataResult {
	user: PlayerInfoResponse | null;
	matches: MatchDetailsResponse[];
	isLoading: boolean;
	error: string | null;
	refetch: () => void;
}

export const useHistoryData = (): UseHistoryDataResult => {
	const [user, setUser] = useState<PlayerInfoResponse | null>(null);
	const [history, setHistory] = useState<MatchHistoryResponse | null>(null);
	const [matches, setMatches] = useState<MatchDetailsResponse[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const fetchData = useCallback(async () => {
		try {
			setIsLoading(true);
			setError(null);
			const [userInfo, historyResponse] = await Promise.all([
				invoke<PlayerInfoResponse>('get_account_info_command'),
				invoke<MatchHistoryResponse>('get_history_data'),
			]);
			setUser(userInfo);
			setHistory(historyResponse);
		} catch (error) {
			console.error('Failed to fetch match history:', error);
			setError(error instanceof Error ? error.message : 'Failed to fetch match history');
		} finally {
			// if (history && history?.History.length > 0) {
			// 	try {
			// 		for (const match of history.History) {
			// 			let matchDetailsResponse = await invoke<MatchDetailsResponse>('get_match_data', {match_id: match.MatchID});
			// 			setMatches(matches.concat([matchDetailsResponse]));
			// 		};
			// 	} catch (error) {
			// 		console.error('Failed to fetch match:', error);
			// 		setError(error instanceof Error ? error.message : 'Failed to fetch match');
			// 	} finally {
			// 		setIsLoading(false);
			// 	}
			// } else {
				setIsLoading(false);
			// }
		}
	}, []);

	useEffect(() => {
		fetchData();
	}, [fetchData]);

	const test: MatchDetailsResponse = {
		matchInfo: {
        	/** Match ID */
			matchId: "aldnssd",
			/** Map ID */
			mapId: "haven",
			gamePodId: "",
			gameLoopZone: "",
			gameServerAddress: "",
			gameVersion: "",
			gameLengthMillis: null,
			gameStartMillis: 0,
			provisioningFlowID: "Matchmaking",
			isCompleted: true,
			customGameName: "",
			forcePostProcessing: false,
			/** Queue ID */
			queueID: "competitive",
			/** Game Mode */
			gameMode: "",
			isRanked: true,
			isMatchSampled: false,
			/** Season ID */
			seasonId: "",
			completionState: "",
			platformType: "PC",
			premierMatchInfo: {},
			partyRRPenalties: undefined,
			shouldMatchDisablePenalties: false,
		},
    	players: [],
		bots: [],
		coaches: [],
		teams: null,
		roundResults: null,
		kills: null,
	};

	// setMatches(matches.concat([test]));

	return { user, matches, isLoading, error, refetch: fetchData };
};

export default useHistoryData;
