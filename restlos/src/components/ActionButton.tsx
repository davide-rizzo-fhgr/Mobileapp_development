import { Pressable, StyleSheet, Text } from "react-native";

import { colors } from "../constants/colors";

type ActionButtonProps = {
  label: string;
  onPress: () => void;
  secondary?: boolean;
  disabled?: boolean;
};

export default function ActionButton({ label, onPress, secondary, disabled }: ActionButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={[styles.button, secondary && styles.secondary, disabled && styles.disabled]}
    >
      <Text style={[styles.buttonText, secondary && styles.secondaryText]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 44,
    backgroundColor: colors.primary,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    padding: 12,
  },
  secondary: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  disabled: {
    opacity: 0.4,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.surface,
  },
  secondaryText: {
    color: colors.dark,
  },
});
