import React from 'react';
import type { StyleProp, TextStyle, ViewStyle } from 'react-native';
import {
	GestureResponderEvent,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';

type ButtonPreset = 'default' | 'text' | 'outline' | 'raised' | 'icon';

type CustomButtonProps = {
	title?: string;
	onPress?: (event: GestureResponderEvent) => void;
	style?: StyleProp<ViewStyle>;
	textStyle?: StyleProp<TextStyle>;
	preset?: ButtonPreset;
	icon?: React.ReactNode;
};

const presetStyles = StyleSheet.create({
	default: {
		backgroundColor: '#007BFF',
		borderWidth: 0,
		elevation: 0,
	},
	text: {
		backgroundColor: 'transparent',
		borderWidth: 0,
		elevation: 0,
	},
	outline: {
		backgroundColor: 'transparent',
		borderWidth: 2,
		borderColor: '#007BFF',
		elevation: 0,
	},
	raised: {
		backgroundColor: '#007BFF',
		borderWidth: 0,
		elevation: 4,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.2,
		shadowRadius: 2,
	},
	icon: {
		backgroundColor: 'transparent',
		borderWidth: 0,
		elevation: 0,
		paddingVertical: 8,
		paddingHorizontal: 8,
	},
	iconOnlyText: {
		marginLeft: 8,
	},
});

const CustomButton: React.FC<CustomButtonProps> = ({
	title,
	onPress,
	style,
	textStyle,
	preset = 'default',
	icon,
}) => {
	const isIconOnly = preset === 'icon' && !title;

	return (
		<TouchableOpacity
			style={[
				styles.button,
				presetStyles[preset],
				isIconOnly && { paddingHorizontal: 12, paddingVertical: 12 },
				style,
			]}
			onPress={onPress}
			activeOpacity={0.8}
		>
			<View
				style={{
					flexDirection: 'row',
					alignItems: 'center',
					justifyContent: 'center',
				}}
			>
				{icon}
				{title ? (
					<Text
						style={[
							styles.buttonText,
							preset === 'text' && { color: '#007BFF', fontWeight: 'normal' },
							preset === 'outline' && { color: '#007BFF' },
							preset === 'icon' && icon ? presetStyles.iconOnlyText : undefined,
							textStyle,
						]}
					>
						{title}
					</Text>
				) : null}
			</View>
		</TouchableOpacity>
	);
};

const styles = StyleSheet.create({
	button: {
		paddingVertical: 12,
		paddingHorizontal: 24,
		borderRadius: 8,
		alignItems: 'center',
		justifyContent: 'center',
		flexDirection: 'row',
	},
	buttonText: {
		color: '#FFFFFF',
		fontSize: 16,
		fontWeight: 'bold',
		textAlign: 'center',
	},
});

export default CustomButton;
