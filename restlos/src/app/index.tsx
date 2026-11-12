import { router } from "expo-router";
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Action, BottomNav, colors, Notice, ProductCard } from "../components/UI";
import { useProducts } from "../storage/useProducts";
import { daysUntil } from "../types/Product";

export default function OverviewScreen() {
  const { products, loading, error, retry } = useProducts();
  const urgent = products.filter(p => daysUntil(p.expiryDate) <= 7).sort((a, b) => a.expiryDate.localeCompare(b.expiryDate));
  return <SafeAreaView style={styles.page}><View style={styles.content}>
    <Text style={styles.brand}>◕  Restlos</Text>
    <Text style={styles.body}>Gutes Essen. Weniger vergessen.</Text>
    <Text style={styles.subtitle}>Dein Vorrat im Blick.</Text>
    <Text style={styles.heading}>Bald aufbrauchen</Text>
    <ScrollView contentContainerStyle={styles.cards}>
      {loading ? <ActivityIndicator color={colors.primary} /> : urgent.length === 0 ? <Text style={styles.empty}>Aktuell läuft nichts bald ab.</Text> : urgent.map(p => <View key={p.id} style={styles.card}><ProductCard product={p} card /></View>)}
    </ScrollView>
    <Notice error={error} loading={loading} retry={retry} />
    <Action label="Lebensmittel erfassen" onPress={() => router.replace("/erfassen")} />
    <BottomNav active="overview" />
  </View></SafeAreaView>;
}
const styles = StyleSheet.create({ page: { flex: 1, backgroundColor: colors.background }, content: { flex: 1, paddingHorizontal: 20, paddingTop: 20, paddingBottom: 16, gap: 16 }, brand: { color: colors.dark, fontSize: 18, fontWeight: "600" }, body: { fontSize: 16, color: colors.text }, subtitle: { fontSize: 14, color: colors.muted }, heading: { fontSize: 18, fontWeight: "600", color: colors.text }, cards: { flexDirection: "row", flexWrap: "wrap", gap: 12 }, card: { width: "48%" }, empty: { color: colors.muted, paddingVertical: 24, textAlign: "center", width: "100%" } });
