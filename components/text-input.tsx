import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
	StyleSheet,
	Text,
	TextInput,
	TextInputProps,
	TouchableOpacity,
	View,
} from 'react-native';

interface CustomTextInputProps extends TextInputProps {
	error?: string;
	secureTextEntry?: boolean;
	variant?: 'default' | 'outline';
}

const CustomTextInput: React.FC<CustomTextInputProps> = ({
	error,
	secureTextEntry,
	style,
	variant = 'default',
	...props
}) => {
	const [showPassword, setShowPassword] = useState(false);

	const isPassword = !!secureTextEntry;

	const getInputWrapperStyle = () => {
		switch (variant) {
			case 'outline':
				return [
					styles.inputWrapper,
					styles.inputOutline,
					error && styles.inputError,
				];
			default:
				return [styles.inputWrapper, error && styles.inputError];
		}
	};

	const getTextInputStyle = () => {
		switch (variant) {
			case 'outline':
				return [styles.input, styles.inputOutline, style];
			default:
				return [styles.input, style];
		}
	};

	return (
		<View style={styles.container}>
			<View style={getInputWrapperStyle()}>
				<TextInput
					style={getTextInputStyle()}
					secureTextEntry={isPassword && !showPassword}
					{...props}
					placeholderTextColor={'#aaa'}
				/>
				{isPassword && (
					<TouchableOpacity
						style={styles.toggleButton}
						onPress={() => setShowPassword((prev) => !prev)}
						accessibilityLabel={
							showPassword ? 'Hide password' : 'Show password'
						}
					>
						<Text style={styles.toggleButtonText}>
							<Ionicons
								name={showPassword ? 'eye-off-outline' : 'eye-outline'}
								size={20}
								color='#fff'
							/>
						</Text>
					</TouchableOpacity>
				)}
			</View>
			<View style={styles.errorContainer}>
				{error ? <Text style={styles.errorText}>{error}</Text> : null}
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		width: '100%',
		marginVertical: 6,
	},
	errorContainer: {
		minHeight: 12,
		maxHeight: 12,
		justifyContent: 'flex-start',
	},
	inputWrapper: {
		flexDirection: 'row',
		alignItems: 'center',
		borderWidth: 1,
		borderColor: '#ccc',
		borderRadius: 6,
		paddingHorizontal: 8,
		backgroundColor: '#fff',
	},
	inputOutline: {
		backgroundColor: 'transparent',
		color: '#fff',
	},
	input: {
		flex: 1,
		height: 44,
		fontSize: 16,
	},
	toggleButton: {
		paddingHorizontal: 8,
		paddingVertical: 4,
	},
	toggleButtonText: {
		color: '#fff',
		fontWeight: '500',
		fontSize: 14,
	},
	errorText: {
		color: '#d32f2f',
		fontSize: 12,
	},
	inputError: {
		borderColor: '#d32f2f',
	},
});

export default CustomTextInput;
