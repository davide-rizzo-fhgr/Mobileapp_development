import { useEffect, useState } from "react";
import type { Product } from "../types/Product";
import { loadProducts, saveProducts } from "./productStorage";

// Wie in den Folien: ein leerer State, danach asynchron laden.
export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function load(): Promise<void> {
    setLoading(true);
    setError(null);
    try {
      const stored = await loadProducts();
      setProducts(stored);
      setReady(true);
    } catch {
      setReady(false);
      setError("Dein Vorrat konnte nicht geladen werden. Bitte versuche es erneut.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    async function loadAtStart() {
      try {
        const stored = await loadProducts();
        setProducts(stored);
        setReady(true);
      } catch {
        setReady(false);
        setError("Dein Vorrat konnte nicht geladen werden. Bitte versuche es erneut.");
      } finally {
        setLoading(false);
      }
    }
    void loadAtStart();
  }, []);

  async function save(product: Product): Promise<boolean> {
    if (!ready) return false;
    const updated = products.some(item => item.id === product.id)
      ? products.map(item => item.id === product.id ? product : item)
      : [...products, product];
    try {
      await saveProducts(updated);
      setProducts(updated);
      setError(null);
      return true;
    } catch {
      setError("Speichern fehlgeschlagen. Bitte versuche es erneut.");
      return false;
    }
  }

  return { products, loading, ready, error, retry: load, save };
}
