import { useEffect, useState } from "react";
import type { Product } from "../types/Product";
import {
  clearConsumedProduct,
  loadConsumedProduct,
  loadProducts,
  saveConsumedProduct,
  saveProducts,
} from "./productStorage";

// Wie in den AsyncStorage-Übungen: erst laden, dann Änderungen speichern.
export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [removed, setRemoved] = useState<Product | null>(null);
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
      // Fehler beim optionalen Rückgängig-Eintrag dürfen den Vorrat nicht blockieren.
      try {
        const lastConsumed = await loadConsumedProduct();
        setRemoved(lastConsumed && !stored.some(item => item.id === lastConsumed.id) ? lastConsumed : null);
      } catch {
        setRemoved(null);
      }
    } catch {
      setReady(false);
      setError("Dein Vorrat konnte nicht geladen werden. Bitte versuche es erneut.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // Der Anfangszustand ist bereits loading; der Effect selbst ist nicht async.
    async function loadAtStart() {
      try {
        const stored = await loadProducts();
        setProducts(stored);
        setReady(true);
        try {
          const lastConsumed = await loadConsumedProduct();
          setRemoved(lastConsumed && !stored.some(item => item.id === lastConsumed.id) ? lastConsumed : null);
        } catch {
          setRemoved(null);
        }
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

  async function remove(id: string, allowUndo: boolean): Promise<boolean> {
    if (!ready) return false;
    const product = products.find(item => item.id === id);
    if (!product) return false;
    const updated = products.filter(item => item.id !== id);
    try {
      if (allowUndo) await saveConsumedProduct(product);
      await saveProducts(updated);
      setProducts(updated);
      setError(null);
      return true;
    } catch {
      setError("Speichern fehlgeschlagen. Bitte versuche es erneut.");
      return false;
    }
  }

  async function undo(): Promise<boolean> {
    if (!ready || !removed) return false;
    const updated = [...products, removed];
    try {
      await saveProducts(updated);
      setProducts(updated);
      setRemoved(null);
      // Beim nächsten Laden wird ein bereits vorhandenes Produkt nicht erneut angeboten.
      try { await clearConsumedProduct(); } catch { /* Der Vorrat ist bereits gespeichert. */ }
      return true;
    } catch {
      setError("Wiederherstellen fehlgeschlagen. Bitte versuche es erneut.");
      return false;
    }
  }

  return { products, loading, error, retry: load, save, remove, undo, canUndo: removed !== null };
}
