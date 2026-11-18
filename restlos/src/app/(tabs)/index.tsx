import { router } from "expo-router";
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import ActionButton from "../../components/ActionButton";
import ErrorView from "../../components/ErrorView";
import ProductCard from "../../components/ProductCard";
import UndoBanner from "../../components/UndoBanner";
import { colors } from "../../constants/colors";
import { useProducts } from "../../context/ProductContext";
import { daysUntil } from "../../utils/date";

export default function OverviewScreen() {
  const { products, loadingState, errorMessage, retry } = useProducts();

  // Abgeleiteter Wert: wird bei jedem Render berechnet und nicht im State gespeichert.
  const urgentProducts = products
    .filter((product) => daysUntil(product.expiryDate) <= 7)
    .sort((a, b) => a.expiryDate.localeCompare(b.expiryDate));

  function handleOpen(id: string) {
    router.push({ pathname: "/produktdetails", params: { id } });
  }

  return (
    <SafeAreaView style={styles.page} edges={["top", "left", "right"]}>
      <View style={styles.content}>
        <Text style={styles.brand}>◕ Restlos</Text>
        <Text style={styles.body}>Gutes Essen. Weniger vergessen.</Text>
        <Text style={styles.subtitle}>Dein Vorrat im Blick.</Text>
        <Text style={styles.heading}>Bald aufbrauchen</Text>

        {loadingState === "loading" && (
          <ActivityIndicator color={colors.primary} style={styles.center} />
        )}
        {loadingState === "error" && (
          <ErrorView
            message={errorMessage ?? "Unbekannter Fehler"}
            actionLabel="Erneut versuchen"
            onAction={retry}
          />
        )}
        {loadingState === "ready" && (
          <ScrollView style={styles.center} contentContainerStyle={styles.cards}>
            {urgentProducts.length === 0 && (
              <Text style={styles.empty}>Aktuell läuft nichts bald ab.</Text>
            )}
            {urgentProducts.map((product) => (
              <View key={product.id} style={styles.card}>
                <ProductCard product={product} onPress={handleOpen} card />
              </View>
            ))}
          </ScrollView>
        )}

        <UndoBanner />
        <ActionButton label="Lebensmittel erfassen" onPress={() => router.push("/erfassen")} />
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
    paddingTop: 20,
    paddingBottom: 16,
    gap: 16,
  },
  brand: {
    color: colors.dark,
    fontSize: 18,
    fontWeight: "600",
  },
  body: {
    fontSize: 16,
    color: colors.text,
  },
  subtitle: {
    fontSize: 14,
    color: colors.muted,
  },
  heading: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
  },
  center: {
    flex: 1,
  },
  cards: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  card: {
    width: "48%",
  },
  empty: {
    color: colors.muted,
    paddingVertical: 24,
    textAlign: "center",
    width: "100%",
  },
});
