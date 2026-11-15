import { useState } from "react";
import { router } from "expo-router";
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Action, BottomNav, colors, Notice, ProductCard } from "../components/UI";
import { useProducts } from "../storage/useProducts";

type Filter = "Alle" | "Kühlschrank" | "Tiefkühler" | "Vorratsschrank";
const filters: Filter[] = ["Alle", "Kühlschrank", "Tiefkühler", "Vorratsschrank"];
export default function PantryScreen() {
  const { products, loading, error, retry } = useProducts();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<Filter>("Alle");
  const visible = products.filter(p => p.name.toLowerCase().includes(search.trim().toLowerCase()) && (filter === "Alle" || p.place === filter));
  return <SafeAreaView style={styles.page}><View style={styles.content}>
    <Text style={styles.heading}>Dein Vorrat</Text><Text style={styles.muted}>{products.length} {products.length === 1 ? "Produkt" : "Produkte"}</Text>
    <TextInput style={styles.input} value={search} onChangeText={setSearch} placeholder="Lebensmittel suchen …" placeholderTextColor={colors.muted} accessibilityLabel="Lebensmittel suchen" />
    <View style={styles.filters}>{filters.map(value => <Pressable key={value} onPress={() => setFilter(value)} style={[styles.chip, filter === value && styles.active]}><Text style={filter === value ? styles.activeText : styles.muted}>{value}</Text></Pressable>)}</View>
    {loading ? <ActivityIndicator color={colors.primary} style={{ flex: 1 }} /> : <FlatList data={visible} keyExtractor={item => item.id} contentContainerStyle={{ gap: 8, paddingBottom: 16 }} renderItem={({ item }) => <ProductCard product={item} />} ListEmptyComponent={<Text style={styles.empty}>{products.length === 0 ? "Dein Vorrat wartet auf das erste Lebensmittel." : "Keine Lebensmittel gefunden."}</Text>} />}
    <Notice error={error} loading={loading} retry={retry} /><Action label="Lebensmittel erfassen" onPress={() => router.replace("/erfassen")} /><BottomNav active="pantry" />
  </View></SafeAreaView>;
}
const styles = StyleSheet.create({ page: { flex: 1, backgroundColor: colors.background }, content: { flex: 1, paddingHorizontal: 20, paddingTop: 20, paddingBottom: 16, gap: 16 }, heading: { fontSize: 24, fontWeight: "600", color: colors.text }, muted: { color: colors.muted, fontSize: 14 }, input: { backgroundColor: "white", borderColor: colors.border, borderWidth: 1, borderRadius: 8, paddingHorizontal: 16, minHeight: 46, fontSize: 16 }, filters: { flexDirection: "row", flexWrap: "wrap", gap: 8 }, chip: { borderColor: colors.border, borderWidth: 1, backgroundColor: "white", paddingHorizontal: 16, paddingVertical: 8, borderRadius: 999 }, active: { backgroundColor: colors.primary, borderColor: colors.primary }, activeText: { color: "white", fontSize: 14 }, empty: { textAlign: "center", paddingVertical: 32, color: colors.muted } });
