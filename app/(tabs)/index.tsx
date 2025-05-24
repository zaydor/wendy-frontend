import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Link } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

export default function Index() {
	const theme = useColorScheme() ?? 'light';
	const colors = Colors[theme];
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
			<Link href='/profile' style={styles.button}>
				Go to Profile screen
			</Link>
		</View>
	);
}
