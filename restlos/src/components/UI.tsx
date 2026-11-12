import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import type { Product } from "../types/Product";
import { daysUntil, expiryLabel } from "../types/Product";

export const colors = { background: "#fbf8f2", primary: "#3e7152", dark: "#284d38", text: "#232621", muted: "#686d62", border: "#c9c8bf", light: "#e5f0e9", warning: "#c9833c" };

export function Action({ label, onPress, secondary, disabled }: { label: string; onPress: () => void; secondary?: boolean; disabled?: boolean }) {
  return <Pressable accessibilityRole="button" disabled={disabled} onPress={onPress} style={[styles.button, secondary && styles.secondary, disabled && styles.disabled]}><Text style={[styles.buttonText, secondary && styles.secondaryText]}>{label}</Text></Pressable>;
}

export function BottomNav({ active }: { active: "overview" | "pantry" }) {
  return <View style={styles.nav}>
    <Pressable accessibilityRole="button" onPress={() => router.replace("/")} style={styles.navItem}><View style={[styles.dot, active === "overview" && styles.activeDot]} /><Text style={active === "overview" ? styles.activeText : styles.muted}>Übersicht</Text></Pressable>
    <Pressable accessibilityRole="button" onPress={() => router.replace("/vorrat")} style={styles.navItem}><View style={[styles.dot, active === "pantry" && styles.activeDot]} /><Text style={active === "pantry" ? styles.activeText : styles.muted}>Vorrat</Text></Pressable>
  </View>;
}

type NoticeProps = {
  error: string | null;
  loading: boolean;
  retry: () => void;
};

export function Notice({ error, retry, loading }: NoticeProps) {
  if (!error) return null;
  return <View style={styles.notice}><Text style={styles.error}>{error}</Text><Text onPress={retry} style={styles.activeText}>{loading ? "Lädt …" : "Erneut versuchen"}</Text></View>;
}

export function ProductCard({ product, card }: { product: Product; card?: boolean }) {
  return <Pressable accessibilityRole="button" onPress={() => router.replace({ pathname: "/produktdetails", params: { id: product.id } })} style={[styles.product, card && styles.card]}>
    <ProductImage product={product} />
    <View style={styles.productText}><Text style={styles.productName}>{product.name}</Text><Text style={styles.muted}>{product.quantity} {product.unit}{!card ? ` · ${product.place}` : ""}</Text><Text style={[styles.expiry, daysUntil(product.expiryDate) <= 7 && { color: colors.warning }]}>{expiryLabel(product.expiryDate)}</Text></View>
  </Pressable>;
}

export function ProductImage({ product, large }: { product: Product; large?: boolean }) {
  const image = product.photoUri ? { uri: product.photoUri } : product.category === "Milchprodukte" ? require("../../assets/images/yogurt.png") : product.category === "Obst und Gemüse" ? require("../../assets/images/broccoli.png") : require("../../assets/images/oats.png");
  return <View style={[styles.imageBox, large && styles.largeImage]}><Image source={image} style={large ? styles.largeIcon : styles.icon} resizeMode="contain" /></View>;
}

const styles = StyleSheet.create({
  button: { minHeight: 44, backgroundColor: colors.primary, borderRadius: 12, justifyContent: "center", alignItems: "center", padding: 12 },
  secondary: { backgroundColor: "white", borderWidth: 1, borderColor: colors.primary }, disabled: { opacity: 0.4 },
  buttonText: { fontSize: 16, fontWeight: "600", color: "white" }, secondaryText: { color: colors.dark },
  nav: { flexDirection: "row", backgroundColor: "white", borderWidth: 1, borderColor: colors.border, height: 44 },
  navItem: { flex: 1, justifyContent: "center", alignItems: "center", gap: 4 }, dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.border }, activeDot: { backgroundColor: colors.primary },
  activeText: { color: colors.dark, fontSize: 12, fontWeight: "500" }, muted: { color: colors.muted, fontSize: 14 },
  notice: { backgroundColor: colors.light, padding: 12, borderRadius: 8, gap: 6 }, error: { color: "#bc473e" },
  product: { backgroundColor: "white", borderColor: colors.border, borderWidth: 1, borderRadius: 16, padding: 12, flexDirection: "row", alignItems: "center", gap: 12 },
  card: { flex: 1, flexDirection: "column", alignItems: "flex-start", gap: 8 }, productText: { flex: 1, gap: 4 }, productName: { color: colors.text, fontSize: 16 }, expiry: { fontSize: 12, color: colors.muted },
  imageBox: { width: 44, height: 44, backgroundColor: colors.light, borderRadius: 12, alignItems: "center", justifyContent: "center", overflow: "hidden" }, icon: { width: 44, height: 44 }, largeImage: { width: "100%", height: 160, borderRadius: 16 }, largeIcon: { width: 160, height: 160 },
});
