import type { Product } from "../types/Product";

// Liefert eine neue, nach MHD aufsteigend sortierte Liste. Das Original bleibt unverändert.
export function sortByExpiryDate(products: Product[]): Product[] {
  return [...products].sort((a, b) => a.expiryDate.localeCompare(b.expiryDate));
}
