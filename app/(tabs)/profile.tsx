import { LoginForm } from '@/components/login-form';
import { Colors } from '@/constants/Colors';
import { AuthContext } from '@/contexts/AuthContext';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useContext } from '@/hooks/useContext';
import { Button, StyleSheet, Text, View } from 'react-native';

export default function ProfileScreen() {
	const { currentUser, loginUser, logoutUser } = useContext(AuthContext);
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
			{!currentUser ? (
				<LoginForm onSuccess={() => {}} email={''} password={''} />
			) : (
				<>
					<Button title='Logout' onPress={logoutUser} />
					<Text style={styles.text}>Hi, {currentUser.name}</Text>
				</>
			)}
		</View>
	);
}
