import { AuthProvider } from '@/contexts/AuthContext';
import {
	DefaultOptions,
	QueryClient,
	QueryClientProvider,
} from '@tanstack/react-query';
import { EventType, addEventListener } from 'expo-linking';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';

export default function RootLayout() {
	const queryConfig = {
		queries: {
			refetchOnWindowFocus: false,
			retry: false,
			staleTime: 1000 * 60 * 5, // 5 minutes
		},
	} satisfies DefaultOptions;
	const [queryClient] = useState(
		() => new QueryClient({ defaultOptions: queryConfig })
	);

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
