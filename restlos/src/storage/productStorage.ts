import AsyncStorage from "@react-native-async-storage/async-storage";

import type { Category, Product, StoragePlace } from "../types/Product";

const STORAGE_KEY = "restlos.products.v1";

const PLACES: StoragePlace[] = ["Kühlschrank", "Tiefkühler", "Vorratsschrank"];
const CATEGORIES: Category[] = ["Milchprodukte", "Obst und Gemüse", "Getreide", "Sonstiges"];

// Type Guard: prüft zur Laufzeit, ob ein geladener Wert wirklich ein Product ist.
function isProduct(value: unknown): value is Product {
  if (typeof value !== "object" || value === null) return false;

  const product = value as Record<string, unknown>;
  return (
    typeof product.id === "string" &&
    typeof product.name === "string" &&
    typeof product.quantity === "string" &&
    typeof product.unit === "string" &&
    PLACES.includes(product.place as StoragePlace) &&
    CATEGORIES.includes(product.category as Category) &&
    typeof product.expiryDate === "string" &&
    /^\d{4}-\d{2}-\d{2}$/.test(product.expiryDate) &&
    (product.photoUri === undefined || typeof product.photoUri === "string")
  );
}

export async function loadProducts(): Promise<Product[]> {
  // 1) Speicherfehler
  let json: string | null;
  try {
    json = await AsyncStorage.getItem(STORAGE_KEY);
  } catch (error) {
    console.error("loadProducts: Lesen fehlgeschlagen:", error);
    throw new Error("Dein Vorrat konnte nicht gelesen werden.");
  }

  // 2) Default-Wert beim ersten Start
  if (json === null) {
    return [];
  }

  // 3) Kaputtes JSON
  let data: unknown;
  try {
    data = JSON.parse(json);
  } catch (error) {
    console.error("loadProducts: Ungültiges JSON:", error);
    throw new Error("Die gespeicherten Lebensmittel sind beschädigt.");
  }

  // 4) Falsche Struktur
  if (!Array.isArray(data)) {
    throw new Error("Die gespeicherten Lebensmittel haben ein unerwartetes Format.");
  }

  // 5) Einzelne ungültige Einträge überspringen, damit der restliche Vorrat nutzbar bleibt
  const products = data.filter(isProduct);
  if (products.length < data.length) {
    console.warn(`loadProducts: ${data.length - products.length} ungültige Einträge übersprungen.`);
  }
  return products;
}

export async function saveProducts(products: Product[]): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(products));
  } catch (error) {
    console.error("saveProducts fehlgeschlagen:", error);
    throw new Error("Dein Vorrat konnte nicht gespeichert werden.");
  }
}
