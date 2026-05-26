import React, { useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity } from 'react-native';

const ButtonColors = {
	primary: '#0C9488',
	secondary: '#ffffff',
	primaryText: '#fff',
	secondaryText: '#0000009f',
}

type ButtonType = 'primary' | 'secondary';
type ButtonAlign = 'left' | 'center' | 'right';

type Props = {
	paddingVertical?: number;
	size: number;
	text: string;
	type?: ButtonType;
	align?: ButtonAlign;
	onPress?: () => Promise<void> | void;
	disabled?: boolean;
}

export function MyButton({
	size,
	text,
	type = 'primary',
	align = 'left',
	onPress,
	disabled = false,
	paddingVertical
}: Props) {
	const [loading, setLoading] = useState(false);

	const handlePress = async () => {
		if (!onPress || loading || disabled) return;

		setLoading(true);
		try {
			await onPress();
		} catch (error) {
			console.error('Button action failed:', error);
			// TODO: Show error toast/alert to user
		} finally {
			setLoading(false);
		}
	};

	const alignMap: Record<ButtonAlign, 'flex-start' | 'center' | 'flex-end'> = {
		left: 'flex-start',
		center: 'center',
		right: 'flex-end',
	};

	const isPrimary = type === 'primary';

	return (
		<TouchableOpacity
			accessibilityRole="button"
			accessibilityLabel={text}
			accessibilityState={{ disabled: loading || disabled }}
			accessibilityHint={loading ? 'Loading' : undefined}
			style={[
				styles.button,
				{
					paddingVertical: paddingVertical || 16,
					width: size,
					borderRadius: 8,
					alignSelf: alignMap[align],
					backgroundColor: isPrimary ? ButtonColors.primary : ButtonColors.secondary,
				}
			]}
			onPress={handlePress}
			disabled={loading || disabled}
		>
			{loading ? (
				<ActivityIndicator
					color={isPrimary ? ButtonColors.primaryText : ButtonColors.secondaryText}
				/>
			) : (
				<Text
					style={[
						styles.buttonText,
						{ color: isPrimary ? ButtonColors.primaryText : ButtonColors.secondaryText }
					]}
					adjustsFontSizeToFit
					minimumFontScale={0.7}
					numberOfLines={1}
				>
					{text}
				</Text>
			)}
		</TouchableOpacity>
	);
}

const styles = StyleSheet.create({
	button: {
		paddingHorizontal: 16,
		justifyContent: 'center',
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 3
		},
		shadowOpacity: 0.30,
		shadowRadius: 7,
	},
	buttonText: {
		fontSize: 16,
		fontWeight: '500',
	},
});