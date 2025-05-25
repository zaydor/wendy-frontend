import { LoginForm } from '@/components/login-form';
import { Colors } from '@/constants/Colors';
import { AuthContext } from '@/contexts/AuthContext';
import { useContext } from '@/hooks/useContext';
import { Button, StyleSheet, Text, View } from 'react-native';

export default function ProfileScreen() {
	const { currentUser, loginUser, logoutUser } = useContext(AuthContext);
	const colors = Colors;
	const styles = StyleSheet.create({
		container: {
			flex: 1,
			backgroundColor: colors.background,
			alignItems: 'center',
		},
		text: {
			color: colors.text,
		},
	});

	return (
		<View style={styles.container}>
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
