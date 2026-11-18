import { router, useLocalSearchParams } from "expo-router";
import { ActivityIndicator, Alert, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import ActionButton from "../components/ActionButton";
import ErrorView from "../components/ErrorView";
import ProductImage from "../components/ProductImage";
import { colors } from "../constants/colors";
import { useProducts } from "../context/ProductContext";
import { expiryLabel } from "../utils/date";

export default function DetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { products, loadingState, errorMessage, retry, consumeProduct, deleteProduct } =
    useProducts();

  const product = products.find((item) => item.id === id);

  async function handleConsume() {
    const ok = await consumeProduct(id);
    if (ok) {
      router.replace("/vorrat");
    } else {
      Alert.alert("Fehler", "Die Änderung konnte nicht gespeichert werden.");
    }
  }

  async function handleDelete() {
    const ok = await deleteProduct(id);
    if (ok) {
      router.replace("/vorrat");
    } else {
      Alert.alert("Fehler", "Das Lebensmittel konnte nicht gelöscht werden.");
    }
  }

  function confirmDelete(name: string) {
    Alert.alert("Lebensmittel löschen?", `Möchtest du ${name} wirklich löschen?`, [
      { text: "Abbrechen", style: "cancel" },
      { text: "Löschen", style: "destructive", onPress: handleDelete },
    ]);
  }

  if (loadingState === "loading") {
    return (
      <SafeAreaView style={styles.page}>
        <ActivityIndicator color={colors.primary} style={styles.spacer} />
      </SafeAreaView>
    );
  }

  if (loadingState === "error") {
    return (
      <SafeAreaView style={styles.page}>
        <ErrorView
          message={errorMessage ?? "Unbekannter Fehler"}
          actionLabel="Erneut versuchen"
          onAction={retry}
        />
      </SafeAreaView>
    );
  }

  if (product === undefined) {
    return (
      <SafeAreaView style={styles.page}>
        <ErrorView
          message="Dieses Lebensmittel existiert nicht (mehr)."
          actionLabel="Zum Vorrat"
          onAction={() => router.replace("/vorrat")}
        />
      </SafeAreaView>
    );
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
        <ProductImage product={product} large />
        <View>
          <Text style={styles.heading}>{product.name}</Text>
          <Text style={styles.muted}>
            {product.quantity} {product.unit}
          </Text>
        </View>
        <View style={styles.meta}>
          <Text style={styles.metaText}>Lagerort: {product.place}</Text>
          <Text style={styles.metaText}>Kategorie: {product.category}</Text>
          <Text style={styles.warning}>{expiryLabel(product.expiryDate)}</Text>
        </View>
        <View style={styles.spacer} />
        <ActionButton label="Aufgebraucht" onPress={handleConsume} />
        <ActionButton
          label="Bearbeiten"
          secondary
          onPress={() => router.replace({ pathname: "/erfassen", params: { id: product.id } })}
        />
        <Pressable
          accessibilityRole="button"
          onPress={() => confirmDelete(product.name)}
          style={styles.delete}
        >
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
  metaText: {
    color: colors.text,
    fontSize: 14,
  },
  warning: {
    color: colors.warning,
    fontSize: 14,
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
