import { TouchableOpacity, StyleSheet, ViewStyle, TextStyle, Text } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';

export type ThemedButtonProps = {
  title: string;
  onPress: () => void;
  style?: ViewStyle;
  textStyle?: TextStyle;
  lightColor?: string;
  darkColor?: string;
};

export function ThemedButton({
  title,
  onPress,
  style,
  textStyle,
  lightColor,
  darkColor,
}: ThemedButtonProps) {
  const backgroundColor = useThemeColor({ light: '#0a7ea4', dark: 'white' }, 'tint');
  const textColor = useThemeColor({ light: 'white', dark: 'black' }, 'text');

  return (
    <TouchableOpacity
      style={[
        styles.button,
        { backgroundColor },
        style
      ]}
      onPress={onPress}
    >
      <Text style={[styles.text, { color: textColor }, textStyle]}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 5,
  },
  text: {
    fontWeight: 'bold',
    fontSize: 16,
  },
});
