import { useAuthorizeSpotify, useWendy } from '@/api/spotify';
import CustomButton from '@/components/button';
import { Colors } from '@/constants/Colors';
import { AuthContext } from '@/contexts/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useQueryClient } from '@tanstack/react-query';
import { useContext } from 'react';
import { Linking, StyleSheet, Text, View } from 'react-native';

export default function Index() {
	const { currentUser } = useContext(AuthContext);
	const colors = Colors;
	const queryClient = useQueryClient();

	const requestSpotifyAuthorization = useAuthorizeSpotify({
		onSuccess: (auth_url) => {
			Linking.openURL(auth_url);
		},
		onError: (error) => {
			console.error('Spotify Authorization Error:', error);
		},
	});

	const onAuthorizeSpotify = () => {
		requestSpotifyAuthorization.mutate();
	};

	const { data: wendyPlaylist, isLoading, isFetching } = useWendy();

	const clearCache = async () => {
		console.log('Clearing cache...');
		await queryClient.invalidateQueries({ queryKey: ['wendyPlaylist'] });
		await AsyncStorage.removeItem('wendy-playlist-cache');
		console.log('Cache cleared');
	};

	const checkCacheStatus = async () => {
		console.log('Checking cache status...');
		const cacheData = await AsyncStorage.getItem('wendy-playlist-cache');
		console.log('Cache data exists:', !!cacheData);
		if (cacheData) {
			console.log(
				'Cache size:',
				JSON.stringify(cacheData).length,
				'characters'
			);
		}
	};

	const styles = StyleSheet.create({
		container: {
			flex: 1,
			backgroundColor: colors.background,
			alignItems: 'center',
			justifyContent: 'center',
		},
		text: {
			color: colors.text,
		},
		button: {
			fontSize: 20,
			textDecorationLine: 'underline',
			color: colors.text,
		},
	});

	if (currentUser) {
		console.log('Wendy Playlist:', wendyPlaylist);
		console.log(
			'Query status - isLoading:',
			isLoading,
			'isFetching:',
			isFetching
		);
	}

	return (
		<View style={styles.container}>
			<Text style={styles.text}>Home Screen</Text>
			<CustomButton title='Test Spotify Auth' onPress={onAuthorizeSpotify} />

			{currentUser && (
				<View style={{ marginTop: 20, gap: 10 }}>
					<CustomButton title='Clear Cache' onPress={clearCache} />
					<CustomButton title='Check Cache Status' onPress={checkCacheStatus} />
				</View>
			)}
		</View>
	);
}
