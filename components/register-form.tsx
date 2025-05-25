import { useRegister } from '@/api/auth';
import { Colors } from '@/constants/Colors';
import { AuthContext } from '@/contexts/AuthContext';
import { useContext } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { StyleSheet, Text, View } from 'react-native';
import { z } from 'zod';
import CustomButton from './button';
import Card from './card';
import CustomTextInput from './text-input';

type RegisterFormProps = {
	onSuccess: () => void;
	email: string;
	name: string;
	password: string;
	confirmPassword: string;
	onEmailChange: (email: string) => void;
	onNameChange: (name: string) => void;
	onPasswordChange: (password: string) => void;
	onConfirmPasswordChange: (password: string) => void;
};

export const RegisterForm = ({
	onSuccess,
	email,
	name,
	password,
	confirmPassword,
	onEmailChange,
	onNameChange,
	onPasswordChange,
	onConfirmPasswordChange,
}: RegisterFormProps) => {
	const colors = Colors;
	const { control, handleSubmit } = useForm<RegisterFormProps>({
		mode: 'onBlur',
	});
	const { currentUser, loginUser, logoutUser } = useContext(AuthContext);

	const register = useRegister({
		onSuccess,
	});

	const onSubmit = (values: any) => {
		register.mutate(
			{
				email: values.email,
				name: values.name,
				password: values.password,
				confirm: values.confirmPassword,
			},
			{
				onSuccess: (data) => {
					if (data.status === 200) {
						console.log('Register success:', data);
						(async () => {
							const user = (await data.json()).user;
							loginUser(user);
							onEmailChange('');
							onNameChange('');
							onPasswordChange('');
							onConfirmPasswordChange('');
						})();
					} else {
						console.log('Register failed:', data);
					}
				},
				onError: (error) => {
					console.log('Register error:', error);
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
			marginVertical: 6,
		},
		textButton: {
			color: colors.primary,
		},
	});

	return (
		<>
			<Card colors={colors} style={styles.card}>
				<Text style={styles.header}>Register</Text>
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
									returnKeyType='next'
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
						name='name'
						rules={{
							required: 'Name is required',
						}}
						render={({
							field: { onChange, onBlur, value },
							fieldState: { error },
						}) => (
							<>
								<CustomTextInput
									placeholder='Name'
									onChangeText={(text) => {
										onChange(text);
										onNameChange(text);
									}}
									onBlur={onBlur}
									returnKeyType='next'
									value={name}
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
									returnKeyType='next'
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
				<View>
					<Controller
						control={control}
						name='confirmPassword'
						render={({
							field: { onChange, onBlur, value },
							fieldState: { error },
						}) => (
							<>
								<CustomTextInput
									placeholder='Confirm Password'
									secureTextEntry={true}
									onChangeText={(text) => {
										onChange(text);
										onConfirmPasswordChange(text);
									}}
									onSubmitEditing={handleSubmit(onSubmit)}
									value={confirmPassword}
									autoCapitalize='none'
									returnKeyType='send'
									variant='outline'
									onBlur={onBlur}
									error={error ? error.message : undefined}
								/>
							</>
						)}
						rules={{
							required: 'Confirm Password is required',
							validate: (value) => {
								const passwordSchema = z
									.string()
									.min(6, 'Password must be at least 6 characters')
									.max(100, 'Password is too long');
								const result = passwordSchema.safeParse(value);
								if (!result.success) {
									return result.error.errors[0].message;
								}
								if (value !== password) {
									return 'Passwords do not match';
								}
								return true;
							},
						}}
					/>
				</View>
				<CustomButton
					title='Create an Account'
					preset='default'
					style={styles.button}
					onPress={handleSubmit(onSubmit)}
				/>
			</Card>
		</>
	);
};
