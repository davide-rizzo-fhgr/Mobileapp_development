import { router, Stack, useLocalSearchParams } from "expo-router";
import { ActivityIndicator, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import ErrorView from "../components/ErrorView";
import ProductForm from "../components/ProductForm";
import { colors } from "../constants/colors";
import { useProducts } from "../context/ProductContext";
import type { Product } from "../types/Product";

// Ohne id wird ein neues Lebensmittel erfasst, mit id ein bestehendes bearbeitet.
export default function FormScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { products, loadingState, errorMessage, retry, saveProduct } = useProducts();

  const existing = products.find((item) => item.id === id);

  async function handleSave(product: Product): Promise<boolean> {
    const ok = await saveProduct(product);
    if (!ok) {
      return false;
    }

    if (existing) {
      // Bearbeiten: zurück zu den Details, die bereits im Stack liegen.
      router.back();
    } else {
      // Neu: Das Formular wird durch die Details ersetzt. "Zurück" führt dann zum Tab.
      router.replace({ pathname: "/produktdetails", params: { id: product.id } });
    }
    return true;
  }

  if (loadingState === "loading") {
    return (
      <SafeAreaView style={styles.page}>
        <ActivityIndicator color={colors.primary} style={styles.center} />
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

  if (id !== undefined && existing === undefined) {
    return (
      <SafeAreaView style={styles.page}>
        <ErrorView
          message="Dieses Lebensmittel existiert nicht (mehr)."
          actionLabel="Zurück"
          onAction={() => router.back()}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.page} edges={["bottom", "left", "right"]}>
      <Stack.Screen options={{ title: existing ? "Bearbeiten" : "Lebensmittel erfassen" }} />
      <ProductForm existing={existing} onSave={handleSave} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: colors.background,
  },
  center: {
    flex: 1,
  },
});
