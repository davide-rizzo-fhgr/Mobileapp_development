import { Pressable, StyleSheet, Text, View } from "react-native";

import { colors } from "../constants/colors";

type NoticeProps = {
  error: string | null;
  loading: boolean;
  canUndo: boolean;
  onRetry: () => void;
  onUndo: () => void;
};

// Zeigt einen Ladefehler mit erneutem Versuch und den Hinweis zum Rückgängigmachen.
export default function Notice({ error, loading, canUndo, onRetry, onUndo }: NoticeProps) {
  return (
    <>
      {error !== null && (
        <View style={styles.notice}>
          <Text style={styles.error}>{error}</Text>
          <Pressable accessibilityRole="button" onPress={onRetry}>
            <Text style={styles.action}>{loading ? "Lädt …" : "Erneut versuchen"}</Text>
          </Pressable>
        </View>
      )}
      {canUndo && (
        <Pressable accessibilityRole="button" onPress={onUndo} style={styles.notice}>
          <Text style={styles.action}>Lebensmittel aufgebraucht · Rückgängig</Text>
        </Pressable>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  notice: {
    backgroundColor: colors.light,
    padding: 12,
    borderRadius: 8,
    gap: 6,
  },
  error: {
    color: colors.error,
  },
  action: {
    color: colors.dark,
    fontSize: 14,
    fontWeight: "600",
  },
});
