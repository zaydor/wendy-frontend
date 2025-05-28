import { api } from '@/api/api-client'; // adjust path as needed
import { REDIRECT_URI } from '@/constants/env';
import { AuthContext } from '@/contexts/AuthContext';
import { useRouter } from 'expo-router';
import { useContext, useEffect } from 'react';
import { Text, View } from 'react-native';

export default function CallbackScreen() {
	const router = useRouter();
	const { currentUser, loginUser, logoutUser } = useContext(AuthContext);

	useEffect(() => {
		const passCallbackCode = async () => {
			try {
				const url = new URL(window.location.href);
				const code = url.searchParams.get('code');

				if (!code) {
					console.log('No code parameter found in URL');
					return;
				}
				const params = {
					code: code,
					redirect_uri: REDIRECT_URI,
				};
				const res = (await api.get<Response>(`/callback`, { params })) as any;

				if (res.status === '200') {
					console.log('passCallbackCode was successful!');
				}
			} catch (e) {
				console.log('passCallbackCode error: ', e);
			}
		};

		const checkAuth = async () => {
			try {
				passCallbackCode();

				const res = (await (await api.get<Response>('/me')).json()) as any;
				console.log('res.user: ', res.user);

				if ((res as any).status !== 401) {
					loginUser(res.user);
					router.replace('/');
				}
			} catch (e) {
				console.log('checkAuth error: ', e);
			}
		};
		checkAuth();
	}, [loginUser, router]);

	return (
		<View>
			<Text>Welcome to callback</Text>
		</View>
	);
}
