import { useAuthorizeSpotify, useWendyPlaylist } from '@/api/spotify';
import CustomButton from '@/components/button';
import { Colors } from '@/constants/Colors';
import { Linking, StyleSheet, Text, View } from 'react-native';

export default function Index() {
	const colors = Colors;
	const requestSpotifyAuthorization = useAuthorizeSpotify({});
	const requestWendyPlaylist = useWendyPlaylist({});
	const onAuthorizeSpotify = () => {
		requestSpotifyAuthorization.mutate(undefined, {
			onSuccess: async (data) => {
				await data.json().then((response: any) => {
					const auth_url = response.auth_url;
					Linking.openURL(auth_url);
				});
			},
		});
	};

	const onWendyPlaylist = () => {
		requestWendyPlaylist.mutate(undefined, {
			onSuccess: async (data) => {
				await data.json().then((response: any) => {
					console.log('onWendyPlaylistResponse: ', response);
				});
			},
		});
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
			<CustomButton title='Test Spotify' onPress={onAuthorizeSpotify} />
			<CustomButton title='Test Playlist' onPress={onWendyPlaylist} />
		</View>
	);
}
