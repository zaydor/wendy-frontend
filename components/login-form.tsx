import { useLogin } from '@/api/auth';
import CustomButton from '@/components/button';
import Card from '@/components/card';
import { Colors } from '@/constants/Colors';
import { AuthContext } from '@/contexts/AuthContext';
import { useContext, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { HelperText } from 'react-native-paper';

type LoginFormProps = {
	onSuccess: () => void;
	email: string;
	password: string;
};

export const LoginForm = ({ onSuccess }: LoginFormProps) => {
	const colors = Colors;
	const { control, handleSubmit } = useForm<LoginFormProps>();
	const [hidePassword, setHidePassword] = useState(true);
	const { currentUser, loginUser, logoutUser } = useContext(AuthContext);

	const login = useLogin({
		onSuccess,
	});

	const onPressHidePassword = () => setHidePassword(!hidePassword);

	const onSubmit = (values: any) => {
		const result = login.mutate(
			{
				email: values.email,
				password: values.password,
			},
			{
				onSuccess: (data) => {
					if (data.status === 200) {
						console.log('Login success:', data);
						(async () => {
							const user = (await data.json()).user;
							loginUser(user);
						})();
					} else {
						console.log('Login failed:', data);
					}
				},
				onError: (error) => {
					console.log('Login error:', error);
				},
			}
		);
	};

	const styles = StyleSheet.create({
		textInput: {
			backgroundColor: colors.backgroundRaised,
			borderRadius: 6,
			padding: 16,
			marginBottom: 10,
			borderWidth: 1,
			borderColor: colors.white,
			color: colors.text,
		},
		card: {
			backgroundColor: colors.transparent,
			width: '90%',
			maxWidth: 400,
		},
		header: {
			fontSize: 48,
			fontWeight: 'bold',
			marginBottom: 10,
			color: colors.primary,
		},
		button: {
			color: colors.white,
			backgroundColor: colors.primary,
		},
		textButton: {
			color: colors.primary,
		},
	});

	return (
		<>
			<Card colors={colors} style={styles.card}>
				<Text style={styles.header}>Login</Text>
				<View style={{ marginBottom: 10 }}>
					<Controller
						control={control}
						name='email'
						render={({ field: { onChange, value }, fieldState: { error } }) => (
							<>
								<TextInput
									placeholder='Email'
									placeholderTextColor={colors.white}
									onChangeText={onChange}
									value={value}
									style={styles.textInput}
								/>
								{error && <HelperText type='error'>{error.message}</HelperText>}
							</>
						)}
						rules={{
							required: 'Email is required',
						}}
					/>
				</View>
				<View>
					<Controller
						control={control}
						name='password'
						render={({ field: { onChange, value }, fieldState: { error } }) => (
							<>
								<TextInput
									placeholder='Password'
									placeholderTextColor={colors.white}
									secureTextEntry={hidePassword}
									onChangeText={onChange}
									onSubmitEditing={handleSubmit(onSubmit)}
									value={value}
									autoCapitalize='none'
									returnKeyType='send'
									style={styles.textInput}
									// right={
									// 	<TextInput.Icon
									// 		icon={hidePassword ? 'eye-outline' : 'eye-off-outline'}
									// 		onPress={onPressHidePassword}
									// 	/>
									// }
								/>
								{error && (
									<HelperText type='error'>{error?.message}</HelperText>
								)}
							</>
						)}
						rules={{
							required: 'Password is required',
						}}
					/>
				</View>
				<CustomButton title='Log In' preset='default' style={styles.button} />
			</Card>
			<View
				style={{
					position: 'absolute',
					bottom: 45,
					left: 0,
					right: 0,
					flexDirection: 'row',
					alignItems: 'center',
					justifyContent: 'center',
				}}
			>
				<Text style={{ color: colors.white, fontSize: 16 }}>
					New To Wendy Companion?
				</Text>
				<CustomButton
					title='Sign Up'
					preset='text'
					textStyle={styles.textButton}
				/>
			</View>
		</>
	);
};
