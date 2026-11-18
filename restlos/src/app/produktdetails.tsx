import { router, useLocalSearchParams } from "expo-router";
import { ActivityIndicator, Alert, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ActionButton from "../components/ActionButton";
import ProductImage from "../components/ProductImage";
import { colors } from "../constants/colors";
import { useProducts } from "../storage/useProducts";
import { expiryLabel } from "../utils/date";

export default function DetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { products, remove, loading, error, retry } = useProducts();
  const product = products.find((item) => item.id === id);
  if (loading)
    return (
      <SafeAreaView style={styles.page}>
        <ActivityIndicator color={colors.primary} />
      </SafeAreaView>
    );
  if (error)
    return (
      <SafeAreaView style={styles.page}>
        <View style={styles.content}>
          <Text>{error}</Text>
          <ActionButton label="Erneut versuchen" onPress={retry} />
        </View>
      </SafeAreaView>
    );
  if (!product)
    return (
      <SafeAreaView style={styles.page}>
        <View style={styles.content}>
          <Text>Dieses Lebensmittel wurde nicht gefunden.</Text>
          <ActionButton label="Zum Vorrat" onPress={() => router.replace("/vorrat")} />
        </View>
      </SafeAreaView>
    );
  const item = product;
  async function removeProduct(allowUndo: boolean) {
    if (await remove(item.id, allowUndo)) router.replace("/vorrat");
    else Alert.alert("Fehler", "Das Lebensmittel konnte nicht gespeichert werden.");
  }
  function confirmDelete() {
    Alert.alert("Lebensmittel löschen?", `Möchtest du ${item.name} wirklich löschen?`, [
      { text: "Abbrechen", style: "cancel" },
      { text: "Löschen", style: "destructive", onPress: () => void removeProduct(false) },
    ]);
  }
  return (
    <SafeAreaView style={styles.page}>
      <View style={styles.content}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Zurück"
          onPress={() => router.replace("/vorrat")}
        >
          <Text style={styles.back}>‹</Text>
        </Pressable>
        <ProductImage product={item} large />
        <View>
          <Text style={styles.heading}>{item.name}</Text>
          <Text style={styles.muted}>
            {item.quantity} {item.unit}
          </Text>
        </View>
        <View style={styles.meta}>
          <Text>Lagerort: {item.place}</Text>
          <Text style={styles.warning}>{expiryLabel(item.expiryDate)}</Text>
        </View>
        <View style={styles.spacer} />
        <ActionButton label="Aufgebraucht" onPress={() => void removeProduct(true)} />
        <ActionButton
          label="Bearbeiten"
          secondary
          onPress={() => router.replace({ pathname: "/erfassen", params: { id: item.id } })}
        />
        <Pressable onPress={confirmDelete} style={styles.delete}>
          <Text style={styles.deleteText}>Löschen</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16,
    gap: 16,
  },
  back: {
    fontSize: 32,
    color: colors.text,
    lineHeight: 32,
  },
  heading: {
    fontSize: 24,
    fontWeight: "600",
    color: colors.text,
  },
  muted: {
    color: colors.muted,
    fontSize: 16,
    marginTop: 4,
  },
  meta: {
    padding: 16,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    gap: 8,
  },
  warning: {
    color: colors.warning,
  },
  spacer: {
    flex: 1,
  },
  delete: {
    padding: 12,
    alignSelf: "flex-start",
  },
  deleteText: {
    color: colors.muted,
    fontSize: 16,
    fontWeight: "600",
  },
});
