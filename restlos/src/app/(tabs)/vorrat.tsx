import { router } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, FlatList, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import ActionButton from "../../components/ActionButton";
import ChipGroup from "../../components/ChipGroup";
import ErrorView from "../../components/ErrorView";
import ProductCard from "../../components/ProductCard";
import UndoBanner from "../../components/UndoBanner";
import { colors } from "../../constants/colors";
import { useProducts } from "../../context/ProductContext";
import type { Product } from "../../types/Product";

type Filter = "Alle" | "Kühlschrank" | "Tiefkühler" | "Vorratsschrank";

const FILTERS: Filter[] = ["Alle", "Kühlschrank", "Tiefkühler", "Vorratsschrank"];

export default function PantryScreen() {
  const { products, loadingState, errorMessage, retry } = useProducts();

  // Suche und Filter sind UI-State dieses Screens und bleiben darum lokal.
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<Filter>("Alle");

  const searchText = search.trim().toLowerCase();
  const visibleProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchText) &&
      (filter === "Alle" || product.place === filter),
  );

  function handleOpen(id: string) {
    router.push({ pathname: "/produktdetails", params: { id } });
  }

  return (
    <SafeAreaView style={styles.page} edges={["top", "left", "right"]}>
      <View style={styles.content}>
        <Text style={styles.heading}>Dein Vorrat</Text>
        <Text style={styles.muted}>
          {products.length} {products.length === 1 ? "Produkt" : "Produkte"}
        </Text>
        <TextInput
          style={styles.input}
          value={search}
          onChangeText={setSearch}
          placeholder="Lebensmittel suchen …"
          placeholderTextColor={colors.muted}
          accessibilityLabel="Lebensmittel suchen"
          returnKeyType="search"
        />
        <ChipGroup options={FILTERS} selected={filter} onSelect={setFilter} />

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
          <FlatList<Product>
            style={styles.center}
            data={visibleProducts}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.list}
            keyboardShouldPersistTaps="handled"
            renderItem={({ item }) => <ProductCard product={item} onPress={handleOpen} />}
            ListEmptyComponent={
              <Text style={styles.empty}>
                {products.length === 0
                  ? "Dein Vorrat wartet auf das erste Lebensmittel."
                  : "Keine Lebensmittel gefunden."}
              </Text>
            }
          />
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
  heading: {
    fontSize: 24,
    fontWeight: "600",
    color: colors.text,
  },
  muted: {
    color: colors.muted,
    fontSize: 14,
  },
  input: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    minHeight: 46,
    fontSize: 16,
    color: colors.text,
  },
  center: {
    flex: 1,
  },
  list: {
    gap: 8,
    paddingBottom: 16,
  },
  empty: {
    textAlign: "center",
    paddingVertical: 32,
    color: colors.muted,
  },
});
