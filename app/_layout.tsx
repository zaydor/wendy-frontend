import { localStoragePersistor } from '@/api/spotify';
import { AuthProvider } from '@/contexts/AuthContext';
import {
	DefaultOptions,
	QueryClient,
	QueryClientProvider,
} from '@tanstack/react-query';
import { persistQueryClient } from '@tanstack/react-query-persist-client';
import { EventType, addEventListener } from 'expo-linking';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';

export default function RootLayout() {
	const [isRestoringCache, setIsRestoringCache] = useState(true);

	const queryConfig = {
		queries: {
			refetchOnWindowFocus: false,
			retry: false,
			staleTime: 1000 * 60 * 5, // 5 minutes (this will be overridden by individual queries)
		},
	} satisfies DefaultOptions;

	const [queryClient] = useState(() => {
		const client = new QueryClient({ defaultOptions: queryConfig });

		const [, restorePromise] = persistQueryClient({
			queryClient: client,
			persister: localStoragePersistor,
			maxAge: 1000 * 60 * 60, // 1 hour
		});

		restorePromise
			.then(() => {
				console.log('Query client persistence setup complete');
				setIsRestoringCache(false);
			})
			.catch((error: any) => {
				console.error('Query client persistence setup failed:', error);
				setIsRestoringCache(false);
			});

		return client;
	});

	useEffect(() => {
		const handleDeepLink = (event: EventType) => {
			const url = event.url;
			console.log('Received deep link:', url);
		};

		const subscription = addEventListener('url', handleDeepLink);

		return () => {
			subscription.remove();
		};
	}, []);

	// Don't render the app until cache is restored
	if (isRestoringCache) {
		console.log('Waiting for cache to restore...');
		return null;
	}

	return (
		<QueryClientProvider client={queryClient}>
			<AuthProvider>
				<Stack>
					<Stack.Screen name='(tabs)' options={{ headerShown: false }} />
				</Stack>
				<StatusBar style='light' />
			</AuthProvider>
		</QueryClientProvider>
	);
}
