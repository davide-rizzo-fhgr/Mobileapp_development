import { Pressable, StyleSheet, Text, View } from "react-native";

import { colors } from "../constants/colors";
import type { Product } from "../types/Product";
import { expiryLabel, isExpiringSoon } from "../utils/date";
import ProductImage from "./ProductImage";

type ProductCardProps = {
  product: Product;
  onPress: (id: string) => void;
  card?: boolean;
};

// Die Karte navigiert nicht selbst. Sie meldet nur, welches Produkt gedrückt wurde.
export default function ProductCard({ product, onPress, card }: ProductCardProps) {
  const isSoon = isExpiringSoon(product.expiryDate);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${product.name} öffnen`}
      onPress={() => onPress(product.id)}
      style={[styles.row, card && styles.card]}
    >
      <ProductImage product={product} />
      <View style={styles.textContainer}>
        <Text style={styles.name}>{product.name}</Text>
        <Text style={styles.muted}>
          {product.quantity} {product.unit}
          {!card ? ` · ${product.place}` : ""}
        </Text>
        <Text style={[styles.expiry, isSoon && styles.expirySoon]}>
          {expiryLabel(product.expiryDate)}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 16,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  card: {
    flex: 1,
    flexDirection: "column",
    alignItems: "flex-start",
    gap: 8,
  },
  textContainer: {
    flex: 1,
    gap: 4,
  },
  name: {
    color: colors.text,
    fontSize: 16,
  },
  muted: {
    color: colors.muted,
    fontSize: 14,
  },
  expiry: {
    fontSize: 12,
    color: colors.muted,
  },
  expirySoon: {
    color: colors.warning,
  },
});
