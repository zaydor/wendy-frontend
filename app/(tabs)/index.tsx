import { Playlist, PlaylistProps } from '@/api/models/playlist';
import { ErrorResponse } from '@/api/models/responses';
import {
	useAllWendy,
	useAuthorizeSpotify,
	useWendyPlaylist,
} from '@/api/spotify';
import CustomButton from '@/components/button';
import { Colors } from '@/constants/Colors';
import { Linking, StyleSheet, Text, View } from 'react-native';

export default function Index() {
	const colors = Colors;
	const requestSpotifyAuthorization = useAuthorizeSpotify({
		onSuccess: (auth_url) => {
			Linking.openURL(auth_url);
		},
		onError: (error) => {
			console.error('Spotify Authorization Error:', error);
		},
	});
	const requestWendyPlaylist = useWendyPlaylist({
		onSuccess: (playlist: PlaylistProps) => {
			console.log('Wendy Playlist:', playlist);
		},
		onError: (error: ErrorResponse) => {
			console.error('Wendy Playlist Error:', error);
		},
	});

	const requestAllWendyPlaylist = useAllWendy({
		onSuccess: (wendy: Playlist) => {
			console.log('All Wendy Playlist:', wendy);
		},
		onError: (error: ErrorResponse) => {
			console.error('All Wendy Playlist Error:', error);
		},
	});
	const onAuthorizeSpotify = () => {
		requestSpotifyAuthorization.mutate();
	};

	const onWendyPlaylist = () => {
		requestWendyPlaylist.mutate();
	};

	const onAllWendy = () => {
		requestAllWendyPlaylist.mutate(undefined);
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
	return (
		<View style={styles.container}>
			<Text style={styles.text}>Home Screen</Text>
			<CustomButton title='Test Spotify Auth' onPress={onAuthorizeSpotify} />
			<CustomButton title='Test Playlist' onPress={onAllWendy} />
		</View>
	);
}
