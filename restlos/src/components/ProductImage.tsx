import { Image, StyleSheet, View } from "react-native";

import { colors } from "../constants/colors";
import type { Product } from "../types/Product";

type ProductImageProps = {
  product: Product;
  large?: boolean;
};

// Ohne eigenes Foto wird das Bild der Kategorie angezeigt.
function getImageSource(product: Product) {
  if (product.photoUri) {
    return { uri: product.photoUri };
  }
  if (product.category === "Milchprodukte") {
    return require("../../assets/images/yogurt.png");
  }
  if (product.category === "Obst und Gemüse") {
    return require("../../assets/images/broccoli.png");
  }
  return require("../../assets/images/oats.png");
}

export default function ProductImage({ product, large }: ProductImageProps) {
  return (
    <View style={[styles.box, large && styles.boxLarge]}>
      <Image
        source={getImageSource(product)}
        style={large ? styles.imageLarge : styles.image}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    width: 44,
    height: 44,
    backgroundColor: colors.light,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  boxLarge: {
    width: "100%",
    height: 160,
    borderRadius: 16,
  },
  image: {
    width: 44,
    height: 44,
  },
  imageLarge: {
    width: 160,
    height: 160,
  },
});
