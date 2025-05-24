import { AuthProvider } from '@/contexts/AuthContext';
import { useColorScheme } from '@/hooks/useColorScheme';
import {
	DarkTheme,
	DefaultTheme,
	ThemeProvider,
} from '@react-navigation/native';
import {
	DefaultOptions,
	QueryClient,
	QueryClientProvider,
} from '@tanstack/react-query';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';

export default function RootLayout() {
	const colorScheme = useColorScheme();
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
				<ThemeProvider
					value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}
				>
					<Stack>
						<Stack.Screen name='(tabs)' options={{ headerShown: false }} />
					</Stack>
					<StatusBar style='auto' />
				</ThemeProvider>
			</AuthProvider>
		</QueryClientProvider>
	);
}
