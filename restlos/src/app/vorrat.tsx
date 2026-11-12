import { router } from "expo-router";
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Action, BottomNav, colors, Notice, ProductCard } from "../components/UI";
import { useProducts } from "../storage/useProducts";

// Eine einfache Liste. Suche und Filter kommen in Commit 5 dazu.
export default function PantryScreen() {
  const { products, loading, error, retry } = useProducts();
  return (
    <SafeAreaView style={styles.page}>
      <View style={styles.content}>
        <Text style={styles.heading}>Dein Vorrat</Text>
        <Text style={styles.count}>{products.length} Produkte</Text>
        {loading ? (
          <ActivityIndicator color={colors.primary} style={{ flex: 1 }} />
        ) : (
          <FlatList
            data={products}
            keyExtractor={(product) => product.id}
            contentContainerStyle={styles.list}
            renderItem={({ item }) => <ProductCard product={item} />}
            ListEmptyComponent={<Text style={styles.empty}>Dein Vorrat wartet auf das erste Lebensmittel.</Text>}
          />
        )}
        <Notice error={error} loading={loading} retry={retry} />
        <Action label="Lebensmittel erfassen" onPress={() => router.replace("/erfassen")} />
        <BottomNav active="pantry" />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.background },
  content: { flex: 1, paddingHorizontal: 20, paddingTop: 20, paddingBottom: 16, gap: 16 },
  heading: { fontSize: 24, fontWeight: "600", color: colors.text },
  count: { color: colors.muted, fontSize: 14 },
  list: { gap: 8, paddingBottom: 16 },
  empty: { textAlign: "center", paddingVertical: 32, color: colors.muted },
});
