import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

import {
  clearConsumedProduct,
  loadConsumedProduct,
  loadProducts,
  saveConsumedProduct,
  saveProducts,
} from "../storage/productStorage";
import type { LoadingState, Product } from "../types/Product";

type ProductContextValue = {
  products: Product[];
  loadingState: LoadingState;
  errorMessage: string | null;
  lastConsumed: Product | null;
  retry: () => void;
  saveProduct: (product: Product) => Promise<boolean>;
  consumeProduct: (id: string) => Promise<boolean>;
  deleteProduct: (id: string) => Promise<boolean>;
  undoConsume: () => Promise<boolean>;
};

const ProductContext = createContext<ProductContextValue | null>(null);

type ProductProviderProps = {
  children: ReactNode;
};

// Der Provider BESITZT den Vorrat. Alle Screens lesen und ändern ihn nur über useProducts().
export function ProductProvider({ children }: ProductProviderProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [lastConsumed, setLastConsumed] = useState<Product | null>(null);
  const [loadingState, setLoadingState] = useState<LoadingState>("loading");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loadAttempt, setLoadAttempt] = useState(0); // Retry-Zähler

  useEffect(() => {
    async function load() {
      try {
        const storedProducts = await loadProducts();
        setProducts(storedProducts);
        setLoadingState("ready");

        // Ein Fehler beim optionalen Rückgängig-Eintrag darf den Vorrat nicht blockieren.
        try {
          const consumed = await loadConsumedProduct();
          const isInPantry = storedProducts.some((item) => item.id === consumed?.id);
          setLastConsumed(isInPantry ? null : consumed);
        } catch {
          setLastConsumed(null);
        }
      } catch (error) {
        // productStorage wirft verständliche Meldungen, die direkt angezeigt werden.
        setErrorMessage(error instanceof Error ? error.message : "Unbekannter Fehler");
        setLoadingState("error");
      }
    }
    load();
  }, [loadAttempt]); // erneut laden, wenn loadAttempt sich ändert

  function retry() {
    setLoadingState("loading");
    setLoadAttempt((current) => current + 1);
  }

  // Gespeichert wird in den Handlern und erst, nachdem geladen wurde.
  // So überschreibt eine leere Liste nie den gespeicherten Vorrat.
  async function saveProduct(product: Product): Promise<boolean> {
    if (loadingState !== "ready") return false;

    const exists = products.some((item) => item.id === product.id);
    const updated = exists
      ? products.map((item) => (item.id === product.id ? product : item))
      : [...products, product];

    try {
      await saveProducts(updated);
      setProducts(updated);
      return true;
    } catch {
      return false;
    }
  }

  async function consumeProduct(id: string): Promise<boolean> {
    if (loadingState !== "ready") return false;

    const product = products.find((item) => item.id === id);
    if (product === undefined) return false;
    const updated = products.filter((item) => item.id !== id);

    try {
      await saveConsumedProduct(product);
      await saveProducts(updated);
      setProducts(updated);
      setLastConsumed(product);
      return true;
    } catch {
      return false;
    }
  }

  async function deleteProduct(id: string): Promise<boolean> {
    if (loadingState !== "ready") return false;

    const updated = products.filter((item) => item.id !== id);

    try {
      await saveProducts(updated);
      setProducts(updated);
      return true;
    } catch {
      return false;
    }
  }

  async function undoConsume(): Promise<boolean> {
    if (loadingState !== "ready" || lastConsumed === null) return false;

    const updated = [...products, lastConsumed];

    try {
      await saveProducts(updated);
      setProducts(updated);
      setLastConsumed(null);
    } catch {
      return false;
    }

    try {
      await clearConsumedProduct();
    } catch {
      // Der Vorrat ist bereits gespeichert. Beim nächsten Laden wird der Eintrag ignoriert.
    }
    return true;
  }

  return (
    <ProductContext.Provider
      value={{
        products,
        loadingState,
        errorMessage,
        lastConsumed,
        retry,
        saveProduct,
        consumeProduct,
        deleteProduct,
        undoConsume,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
}

export function useProducts(): ProductContextValue {
  const context = useContext(ProductContext);
  if (context === null) {
    throw new Error("useProducts muss innerhalb von <ProductProvider> verwendet werden.");
  }
  return context;
}
