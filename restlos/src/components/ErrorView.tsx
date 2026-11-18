import { StyleSheet, Text, View } from "react-native";

import { colors } from "../constants/colors";
import ActionButton from "./ActionButton";

type ErrorViewProps = {
  message: string;
  actionLabel: string;
  onAction: () => void;
};

// Für Ladefehler ("Erneut versuchen") und nicht gefundene Produkte.
export default function ErrorView({ message, actionLabel, onAction }: ErrorViewProps) {
  return (
    <View style={styles.center}>
      <Text style={styles.message}>{message}</Text>
      <ActionButton label={actionLabel} onPress={onAction} />
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    gap: 16,
  },
  message: {
    color: colors.text,
    fontSize: 16,
    textAlign: "center",
  },
});
