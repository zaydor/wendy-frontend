import { useLogin } from '@/api/auth';
import { ErrorResponse } from '@/api/models/responses';
import { UserProps } from '@/api/models/user';
import CustomButton from '@/components/button';
import Card from '@/components/card';
import CustomTextInput from '@/components/text-input';
import { Colors } from '@/constants/Colors';
import { AuthContext } from '@/contexts/AuthContext';
import { useContext } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { StyleSheet, Text, View } from 'react-native';
import { z } from 'zod';

type LoginFormProps = {
	onSuccess: () => void;
	email: string;
	password: string;
	onEmailChange: (email: string) => void;
	onPasswordChange: (password: string) => void;
};

export const LoginForm = ({
	onSuccess,
	email,
	password,
	onEmailChange,
	onPasswordChange,
}: LoginFormProps) => {
	const colors = Colors;
	const { control, handleSubmit } = useForm<LoginFormProps>({
		mode: 'onBlur',
	});
	const { loginUser } = useContext(AuthContext);

	const login = useLogin({
		onError: (error: ErrorResponse) => {
			console.error('Login error:', error);
		},
		onSuccess: (user: UserProps) => {
			console.log('User logged in successfully:', user);
			loginUser(user);
		},
	});

	const onSubmit = (values: any) => {
		login.mutate({
			email: values.email,
			password: values.password,
		});
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
			marginVertical: 6,
		},
		textButton: {
			color: colors.primary,
		},
	});

	return (
		<>
			<Card colors={colors} style={styles.card}>
				<Text style={styles.header}>Login</Text>
				<View>
					<Controller
						control={control}
						name='email'
						rules={{
							required: 'Email is required',
							validate: (value) => {
								const emailSchema = z.string().email('Invalid email address');
								const result = emailSchema.safeParse(value);
								return result.success ? true : result.error.errors[0].message;
							},
						}}
						render={({
							field: { onChange, onBlur, value },
							fieldState: { error },
						}) => (
							<>
								<CustomTextInput
									placeholder='Email'
									onChangeText={(text) => {
										onChange(text);
										onEmailChange(text);
									}}
									onBlur={onBlur}
									value={email}
									variant='outline'
									error={error ? error.message : undefined}
								/>
							</>
						)}
					/>
				</View>
				<View>
					<Controller
						control={control}
						name='password'
						render={({
							field: { onChange, onBlur, value },
							fieldState: { error },
						}) => (
							<>
								<CustomTextInput
									placeholder='Password'
									secureTextEntry={true}
									onChangeText={(text) => {
										onChange(text);
										onPasswordChange(text);
									}}
									onSubmitEditing={handleSubmit(onSubmit)}
									value={password}
									autoCapitalize='none'
									returnKeyType='send'
									variant='outline'
									onBlur={onBlur}
									error={error ? error.message : undefined}
								/>
							</>
						)}
						rules={{
							required: 'Password is required',
							validate: (value) => {
								const passwordSchema = z
									.string()
									.min(6, 'Password must be at least 6 characters')
									.max(100, 'Password is too long');
								const result = passwordSchema.safeParse(value);
								return result.success ? true : result.error.errors[0].message;
							},
						}}
					/>
				</View>
				<CustomButton
					title='Log In'
					preset='default'
					style={styles.button}
					onPress={handleSubmit(onSubmit)}
				/>
			</Card>
		</>
	);
};
