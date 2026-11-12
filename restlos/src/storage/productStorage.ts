import AsyncStorage from "@react-native-async-storage/async-storage";
import type { Product } from "../types/Product";

const KEY = "restlos.products.v1";

function isProduct(value: unknown): value is Product {
  if (typeof value !== "object" || value === null) return false;
  const product = value as Record<string, unknown>;
  return typeof product.id === "string" && typeof product.name === "string" &&
    typeof product.quantity === "string" && typeof product.unit === "string" &&
    typeof product.place === "string" && typeof product.category === "string" &&
    typeof product.expiryDate === "string" && /^\d{4}-\d{2}-\d{2}$/.test(product.expiryDate) &&
    (product.photoUri === undefined || typeof product.photoUri === "string");
}

export async function loadProducts(): Promise<Product[]> {
  const json = await AsyncStorage.getItem(KEY);
  if (json === null) return [];
  const data: unknown = JSON.parse(json);
  if (!Array.isArray(data) || !data.every(isProduct)) {
    throw new Error("Die gespeicherten Lebensmittel haben ein ungültiges Format.");
  }
  return data;
}

export async function saveProducts(products: Product[]): Promise<void> {
  await AsyncStorage.setItem(KEY, JSON.stringify(products));
}

