import { AuthProvider } from '@/contexts/AuthContext';
import {
	DefaultOptions,
	QueryClient,
	QueryClientProvider,
} from '@tanstack/react-query';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';

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
