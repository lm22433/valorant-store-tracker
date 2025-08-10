import { useEffect, useState } from 'react';

export const useTimer = (endTimeInSeconds: number): string => {
	const [timeRemaining, setTimeRemaining] = useState<string>("00:00:00");

	useEffect(() => {
		if (!endTimeInSeconds) {
			setTimeRemaining("00:00:00");
			return;
		}

		const updateTimer = () => {
			const now = Math.floor(Date.now() / 1000);
			const remaining = endTimeInSeconds - now;

			if (remaining <= 0) {
				setTimeRemaining("00:00:00");
				return;
			}

			const hours = Math.floor(remaining / 3600);
			const minutes = Math.floor((remaining % 3600) / 60);
			const seconds = remaining % 60;

			setTimeRemaining(
				`${hours.toString().padStart(2, '0')}:${minutes
					.toString()
					.padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
			);
		};

		updateTimer();
		const interval = setInterval(updateTimer, 1000);
		return () => clearInterval(interval);
	}, [endTimeInSeconds]);

	return timeRemaining;
};

export default useTimer;
