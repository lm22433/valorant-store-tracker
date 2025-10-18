import { useCallback, useEffect, useState } from "react";
import { MatchDetailsResponse } from "../types/responseTypes";
import { invoke } from "@tauri-apps/api/core";

const useMatchDetails = (matchId: string): MatchDetailsResponse => {
    const [matchDetails, setMatchDetails] = useState<MatchDetailsResponse | null>(null);

    const fetchMatch = useCallback(async () => {
        setMatchDetails(await invoke<MatchDetailsResponse>('get_match_data', {args: {matchId: matchId}}));
    }, [matchId]);

    useEffect(() => {
        fetchMatch();
    }, [fetchMatch]);

    return matchDetails!;
}

export default useMatchDetails;