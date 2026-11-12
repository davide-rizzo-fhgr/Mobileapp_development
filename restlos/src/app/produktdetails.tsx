import { router, useLocalSearchParams } from "expo-router";
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Action, colors, ProductImage } from "../components/UI";
import { useProducts } from "../storage/useProducts";
import { expiryLabel } from "../types/Product";

export default function DetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { products, loading, error, retry } = useProducts();
  const product = products.find(item => item.id === id);
  if (loading) return <SafeAreaView style={styles.page}><ActivityIndicator color={colors.primary} /></SafeAreaView>;
  if (error) return <SafeAreaView style={styles.page}><View style={styles.content}><Text>{error}</Text><Action label="Erneut versuchen" onPress={retry} /></View></SafeAreaView>;
  if (!product) return <SafeAreaView style={styles.page}><View style={styles.content}><Text>Dieses Lebensmittel wurde nicht gefunden.</Text><Action label="Zum Vorrat" onPress={() => router.replace("/vorrat")} /></View></SafeAreaView>;
  return <SafeAreaView style={styles.page}><View style={styles.content}>
    <Pressable accessibilityRole="button" accessibilityLabel="Zurück" onPress={() => router.replace("/vorrat")}><Text style={styles.back}>‹</Text></Pressable>
    <ProductImage product={product} large />
    <View><Text style={styles.heading}>{product.name}</Text><Text style={styles.muted}>{product.quantity} {product.unit}</Text></View>
    <View style={styles.meta}><Text>Lagerort: {product.place}</Text><Text style={styles.warning}>{expiryLabel(product.expiryDate)}</Text></View>
    <View style={styles.spacer} />
    <Action label="Bearbeiten" secondary onPress={() => router.replace({ pathname: "/erfassen", params: { id: product.id } })} />
  </View></SafeAreaView>;
}
const styles = StyleSheet.create({ page: { flex: 1, backgroundColor: colors.background }, content: { flex: 1, paddingHorizontal: 20, paddingTop: 12, paddingBottom: 16, gap: 16 }, back: { fontSize: 32, color: colors.text, lineHeight: 32 }, heading: { fontSize: 24, fontWeight: "600", color: colors.text }, muted: { color: colors.muted, fontSize: 16, marginTop: 4 }, meta: { padding: 16, backgroundColor: "white", borderWidth: 1, borderColor: colors.border, borderRadius: 12, gap: 8 }, warning: { color: colors.warning }, spacer: { flex: 1 } });
