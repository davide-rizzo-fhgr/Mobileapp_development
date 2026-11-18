import { Alert, Pressable, StyleSheet, Text } from "react-native";

import { colors } from "../constants/colors";
import { useProducts } from "../context/ProductContext";

// Erscheint auf Übersicht und Vorrat, solange ein aufgebrauchtes Produkt wiederherstellbar ist.
export default function UndoBanner() {
  const { lastConsumed, undoConsume } = useProducts();

  async function handleUndo() {
    const ok = await undoConsume();
    if (!ok) {
      Alert.alert("Fehler", "Das Lebensmittel konnte nicht wiederhergestellt werden.");
    }
  }

  if (lastConsumed === null) {
    return null;
  }

  return (
    <Pressable accessibilityRole="button" onPress={handleUndo} style={styles.banner}>
      <Text style={styles.text}>{lastConsumed.name} aufgebraucht</Text>
      <Text style={styles.action}>Rückgängig</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.light,
    padding: 12,
    borderRadius: 8,
    gap: 12,
  },
  text: {
    flex: 1,
    color: colors.text,
    fontSize: 14,
  },
  action: {
    color: colors.dark,
    fontSize: 14,
    fontWeight: "600",
  },
});
