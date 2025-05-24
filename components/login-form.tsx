import { useLogin } from '@/api/auth';
import { AuthContext } from '@/contexts/AuthContext';
import { useContext, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { View } from 'react-native';
import { Button, HelperText, TextInput } from 'react-native-paper';

type LoginFormProps = {
	onSuccess: () => void;
	email: string;
	password: string;
};

export const LoginForm = ({ onSuccess }: LoginFormProps) => {
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

	return (
		<>
			<View>
				<Controller
					control={control}
					name='email'
					render={({ field: { onChange, value }, fieldState: { error } }) => (
						<>
							<TextInput
								placeholder='Email'
								onChangeText={onChange}
								value={value}
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
								secureTextEntry={hidePassword}
								onChangeText={onChange}
								onSubmitEditing={handleSubmit(onSubmit)}
								value={value}
								autoCapitalize='none'
								mode='outlined'
								returnKeyType='send'
								right={
									<TextInput.Icon
										icon={hidePassword ? 'eye-outline' : 'eye-off-outline'}
										onPress={onPressHidePassword}
									/>
								}
							/>
							{error && <HelperText type='error'>{error?.message}</HelperText>}
						</>
					)}
					rules={{
						required: 'Password is required',
					}}
				/>
			</View>
			<Button mode='contained' onPress={handleSubmit(onSubmit)}>
				Sign In
			</Button>
		</>
	);
};
