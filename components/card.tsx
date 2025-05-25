import {
	Dimensions,
	StyleProp,
	StyleSheet,
	View,
	ViewStyle,
} from 'react-native';

import { ReactNode } from 'react';

type CardProps = {
	children: ReactNode;
	colors: any;
	style?: StyleProp<ViewStyle>;
};

const Card = ({ children, colors, style }: CardProps) => {
	const { height } = Dimensions.get('window');
	const styles = StyleSheet.create({
		card: {
			backgroundColor: colors.primary,
			borderRadius: 8,
			padding: 16,
			margin: 8,
		},
	});

	return <View style={[styles.card, style]}>{children}</View>;
};

export default Card;
