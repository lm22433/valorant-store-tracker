import { useCallback, useEffect, useState } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { MatchDetailsResponse, MatchHistoryResponse } from '../types';

interface UseHistoryDataResult {
	history: MatchHistoryResponse | null;
	matches: MatchDetailsResponse[];
	isLoading: boolean;
	error: String | null;
	refetch: () => void;
}

export const useHistoryData = (): UseHistoryDataResult => {
	const [history, setHistory] = useState<MatchHistoryResponse | null>(null);
	const [matches, setMatches] = useState<MatchDetailsResponse[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<String | null>(null);

	const fetchData = useCallback(async () => {
		try {
			setIsLoading(true);
			setError(null);
			const historyResponse = await invoke<MatchHistoryResponse>('get_history_data');
			setHistory(historyResponse);

			if (historyResponse && historyResponse.History.length > 0) {
				const matchDetailsList = await Promise.all(
					historyResponse.History.map(match =>
						invoke<MatchDetailsResponse>('get_match_data', {args: {matchId: match.MatchID}})
					)
				);
				setMatches(matchDetailsList);
			}
		} catch (error) {
			console.error('Failed to fetch match history:', error);
			setError(error instanceof Error ? error.message : typeof(error) === 'string' ? error : 'Failed to fetch match history');
		} finally {
			setIsLoading(false);
		}
	}, []);

	useEffect(() => {
		fetchData();
	}, [fetchData]);

	// const test: MatchDetailsResponse = {
	// 	matchInfo: {
    //     	/** Match ID */
	// 		matchId: "aldnssd",
	// 		/** Map ID */
	// 		mapId: "haven",
	// 		gamePodId: "",
	// 		gameLoopZone: "",
	// 		gameServerAddress: "",
	// 		gameVersion: "",
	// 		gameLengthMillis: null,
	// 		gameStartMillis: 0,
	// 		provisioningFlowID: "Matchmaking",
	// 		isCompleted: true,
	// 		customGameName: "",
	// 		forcePostProcessing: false,
	// 		/** Queue ID */
	// 		queueID: "competitive",
	// 		/** Game Mode */
	// 		gameMode: "",
	// 		isRanked: true,
	// 		isMatchSampled: false,
	// 		/** Season ID */
	// 		seasonId: "",
	// 		completionState: "",
	// 		platformType: "PC",
	// 		premierMatchInfo: {},
	// 		partyRRPenalties: undefined,
	// 		shouldMatchDisablePenalties: false,
	// 	},
    // 	players: [],
	// 	bots: [],
	// 	coaches: [],
	// 	teams: null,
	// 	roundResults: null,
	// 	kills: null,
	// };

	// setMatches(matches.concat([test]));

	return { history, matches, isLoading, error, refetch: fetchData };
};

export default useHistoryData;
