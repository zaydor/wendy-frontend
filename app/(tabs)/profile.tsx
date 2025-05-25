import { useLogout } from '@/api/auth';
import CustomButton from '@/components/button';
import { LoginForm } from '@/components/login-form';
import { RegisterForm } from '@/components/register-form';
import { Colors } from '@/constants/Colors';
import { AuthContext } from '@/contexts/AuthContext';
import { useContext } from '@/hooks/useContext';
import { useState } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';

export default function ProfileScreen() {
	const { currentUser, loginUser, logoutUser } = useContext(AuthContext);
	const [showLogin, setShowLogin] = useState(true);
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

	const [email, setEmail] = useState('');
	const [username, setName] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');

	const logout = useLogout({});
	const onLogout = () => {
		logout.mutate(undefined, {
			onSuccess: () => {
				logoutUser();
			},
		});
	};

	return (
		<View style={styles.container}>
			{!currentUser ? (
				<>
					{showLogin ? (
						<LoginForm
							onSuccess={() => {}}
							email={email}
							password={password}
							onEmailChange={setEmail}
							onPasswordChange={setPassword}
						/>
					) : (
						<RegisterForm
							onSuccess={() => {}}
							email={email}
							name={username}
							password={password}
							confirmPassword={confirmPassword}
							onEmailChange={setEmail}
							onNameChange={setName}
							onPasswordChange={setPassword}
							onConfirmPasswordChange={setConfirmPassword}
						/>
					)}
					<View
						style={{
							position: 'absolute',
							left: 0,
							right: 0,
							bottom: 0,
							paddingBottom: 32,
							paddingTop: 16,
							flexDirection: 'row',
							alignItems: 'center',
							justifyContent: 'center',
							backgroundColor: 'transparent',
						}}
					>
						<Text style={{ color: colors.white, fontSize: 16 }}>
							{showLogin
								? 'New To Wendy Companion?'
								: 'Already have an account?'}
						</Text>
						<CustomButton
							title={showLogin ? 'Sign Up' : 'Login'}
							preset='text'
							textStyle={{ color: colors.primary }}
							onPress={() => setShowLogin(!showLogin)}
						/>
					</View>
				</>
			) : (
				<>
					<Button title='Logout' onPress={onLogout} />
					<Text style={styles.text}>Hi, {currentUser.name}</Text>
				</>
			)}
		</View>
	);
}
