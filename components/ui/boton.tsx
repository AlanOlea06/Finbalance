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
	/** @deprecated Usa minWidth/maxWidth para un control más flexible */
	size?: number;
	minWidth?: number;
	maxWidth?: number;
	text: string;
	type?: ButtonType;
	align?: ButtonAlign;
	onPress?: () => Promise<void> | void;
	disabled?: boolean;
	icon?: string; // TODO: Implement icon support 
}

export function MyButton({
	size,
	minWidth,
	maxWidth,
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

	// Si se pasa `size`, se respeta como ancho fijo (backward compat).
	// De lo contrario, el botón crece con flex: 1 respetando min/maxWidth.
	const sizeStyle = size !== undefined
		? { width: size }
		: { flex: 1, minWidth, maxWidth };

	return (
		<TouchableOpacity
			accessibilityRole="button"
			accessibilityLabel={text}
			accessibilityState={{ disabled: loading || disabled }}
			accessibilityHint={loading ? 'Loading' : undefined}
			style={[
				styles.button,
				sizeStyle,
				{
					paddingVertical: paddingVertical || 16,
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
						{ alignSelf: alignMap[align], color: isPrimary ? ButtonColors.primaryText : ButtonColors.secondaryText }
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