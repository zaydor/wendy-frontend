import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { StyleSheet, Text, View } from 'react-native';

export default function ProfileScreen() {
	const theme = useColorScheme() ?? 'light';
	const colors = Colors[theme];
	const styles = StyleSheet.create({
		container: {
			flex: 1,
			backgroundColor: colors.background,
			justifyContent: 'center',
			alignItems: 'center',
		},
		text: {
			color: colors.text,
		},
	});

	return (
		<View style={styles.container}>
			<Text style={styles.text}>Profile screen</Text>
		</View>
	);
}
