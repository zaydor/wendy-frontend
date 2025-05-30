import { useUser } from '@/api/auth';
import { ErrorResponse, StandardResponse } from '@/api/models/responses';
import { useSpotifyCallback } from '@/api/spotify';
import { AuthContext } from '@/contexts/AuthContext';
import { useRouter } from 'expo-router';
import { useContext, useEffect } from 'react';
import { Text, View } from 'react-native';

export default function CallbackScreen() {
	const router = useRouter();
	const { loginUser } = useContext(AuthContext);

	const callback = useSpotifyCallback({
		onSuccess: (data: StandardResponse) => {
			if (data.status === 200) {
				console.log(data.message);
				refetchUser();
			}
		},
		onError: (error: ErrorResponse) => {
			console.error('Callback error:', error);
		},
	});

	const { data: user, refetch: refetchUser } = useUser();

	useEffect(() => {
		const url = new URL(window.location.href);
		const code = url.searchParams.get('code');
		if (code && !callback.isPending && !callback.isSuccess) {
			callback.mutate(code);
		}
	}, [callback]);

	useEffect(() => {
		if (user) {
			loginUser(user);
			router.replace('/');
		}
	}, [user, loginUser, router]);

	return (
		<View>
			<Text>Welcome to callback</Text>
		</View>
	);
}
