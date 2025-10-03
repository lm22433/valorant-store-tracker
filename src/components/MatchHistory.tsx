import React, {useCallback} from 'react';
import Matches from './history/Matches';
import useHistoryData from '../hooks/useHistoryData';
import LoadingScreen from './common/LoadingScreen';
import Header from './store/Header';

const History: React.FC<{onHome: () => void}> = ({onHome}: {onHome: () => void}) => {

    const { user, history, isLoading, error, refetch } = useHistoryData();

    const handleRefresh = useCallback(() => {
        refetch();
    }, [refetch]);

    if (isLoading) return <LoadingScreen message="Loading your matches..." />;

    if (error) {
        return (
        <div className="flex min-h-screen items-center justify-center px-6">
            <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-10 text-center shadow-2xl backdrop-blur-2xl">
            <h2 className="text-2xl font-semibold text-white">Something went wrong</h2>
                <p className="mt-3 text-white/70">{error}</p>
            <button onClick={handleRefresh} className="mt-8 inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-[#ff4655] to-[#ff6b35] px-6 py-3 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_10px_30px_rgba(255,70,85,0.3)] focus:outline-none focus:ring-2 focus:ring-[#ff6b35]/60 focus:ring-offset-2 focus:ring-offset-transparent">Try Again</button>
            </div>
        </div>
        );
    }

    return (
        <div className="flex min-h-screen flex-col">
            <Header user={user} onRefresh={handleRefresh} onHome={onHome} />
            <main className="mx-auto flex w-full max-w-[1400px] flex-1 flex-col gap-10 px-4 py-10 sm:px-8">
                <h1 className="text-3xl font-semibold text-white">Match History</h1>
                {history ? <Matches ids={history.History}/> : null}
            </main>
        </div>
    );
}

export default History;