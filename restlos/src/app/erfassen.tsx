import { useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ActionButton from "../components/ActionButton";
import ChipGroup from "../components/ChipGroup";
import ErrorView from "../components/ErrorView";
import { colors } from "../constants/colors";
import { useProducts } from "../context/ProductContext";
import type { Category, Product, StoragePlace } from "../types/Product";
import { formatDate } from "../utils/date";

const places: StoragePlace[] = ["Kühlschrank", "Tiefkühler", "Vorratsschrank"];
const categories: Category[] = ["Milchprodukte", "Obst und Gemüse", "Getreide", "Sonstiges"];
const units = ["Stück", "Becher", "Packung", "g", "kg", "ml", "l"];

function parseDate(value: string): string | null {
  const match = /^(\d{2})\.(\d{2})\.(\d{4})$/.exec(value.trim());
  if (!match) return null;
  const day = Number(match[1]);
  const month = Number(match[2]);
  const year = Number(match[3]);
  const date = new Date(year, month - 1, day);
  if (
    year < 1900 ||
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  )
    return null;
  return `${match[3]}-${match[2]}-${match[1]}`;
}

// Erlaubt ein MHD bis genau einen Kalendermonat vor heute.
function isTooOld(expiryDate: string): boolean {
  const today = new Date();
  const lastDay = new Date(today.getFullYear(), today.getMonth(), 0).getDate();
  const earliestDay = Math.min(today.getDate(), lastDay);
  const earliestDate = new Date(today.getFullYear(), today.getMonth() - 1, earliestDay);

  const [year, month, day] = expiryDate.split("-").map(Number);
  const enteredDate = new Date(year, month - 1, day);
  return enteredDate < earliestDate;
}

export default function FormScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { products, loadingState, errorMessage, retry, saveProduct } = useProducts();

  const existing = products.find((item) => item.id === id);

  if (loadingState === "loading") {
    return (
      <SafeAreaView style={styles.page}>
        <ActivityIndicator color={colors.primary} style={styles.center} />
      </SafeAreaView>
    );
  }

  if (loadingState === "error") {
    return (
      <SafeAreaView style={styles.page}>
        <ErrorView
          message={errorMessage ?? "Unbekannter Fehler"}
          actionLabel="Erneut versuchen"
          onAction={retry}
        />
      </SafeAreaView>
    );
  }

  if (id !== undefined && existing === undefined) {
    return (
      <SafeAreaView style={styles.page}>
        <ErrorView
          message="Dieses Lebensmittel existiert nicht (mehr)."
          actionLabel="Zum Vorrat"
          onAction={() => router.replace("/vorrat")}
        />
      </SafeAreaView>
    );
  }

  return <ProductForm existing={existing} onSave={saveProduct} />;
}

function ProductForm({
  existing,
  onSave,
}: {
  existing?: Product;
  onSave: (product: Product) => Promise<boolean>;
}) {
  const [name, setName] = useState(existing?.name ?? "");
  const [quantity, setQuantity] = useState(existing?.quantity ?? "");
  const [unit, setUnit] = useState(existing?.unit ?? "Stück");
  const [place, setPlace] = useState<StoragePlace>(existing?.place ?? "Kühlschrank");
  const [category, setCategory] = useState<Category>(existing?.category ?? "Sonstiges");
  const [date, setDate] = useState(existing ? formatDate(existing.expiryDate) : "");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  async function submit() {
    const expiryDate = parseDate(date);
    if (!name.trim() || !quantity.trim() || !expiryDate) {
      setError("Bitte Name, Menge und ein gültiges Datum (TT.MM.JJJJ) eingeben.");
      return;
    }
    if (isTooOld(expiryDate)) {
      setError("Das Mindesthaltbarkeitsdatum darf höchstens einen Monat zurückliegen.");
      return;
    }
    const product: Product = {
      id: existing?.id ?? `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      name: name.trim(),
      quantity: quantity.trim(),
      unit,
      place,
      category,
      expiryDate,
      ...(existing?.photoUri ? { photoUri: existing.photoUri } : {}),
    };
    setSaving(true);
    setError("");
    const ok = await onSave(product);
    setSaving(false);
    if (ok) router.replace({ pathname: "/produktdetails", params: { id: product.id } });
    else setError("Speichern fehlgeschlagen. Bitte versuche es erneut.");
  }
  return (
    <SafeAreaView style={styles.page}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Pressable
            onPress={() =>
              existing
                ? router.replace({ pathname: "/produktdetails", params: { id: existing.id } })
                : router.replace("/")
            }
            accessibilityLabel="Zurück"
          >
            <Text style={styles.back}>‹</Text>
          </Pressable>
          <Text style={styles.heading}>{existing ? "Bearbeiten" : "Lebensmittel erfassen"}</Text>
        </View>
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <Text style={styles.label}>Name</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="z. B. Naturjoghurt"
        />
        <Text style={styles.label}>Menge</Text>
        <TextInput
          style={styles.input}
          value={quantity}
          onChangeText={setQuantity}
          placeholder="z. B. 2"
          keyboardType="decimal-pad"
        />
        <Text style={styles.label}>Einheit</Text>
        <ChipGroup options={units} selected={unit} onSelect={setUnit} />
        <Text style={styles.label}>Lagerort</Text>
        <ChipGroup options={places} selected={place} onSelect={setPlace} />
        <Text style={styles.label}>Kategorie</Text>
        <ChipGroup options={categories} selected={category} onSelect={setCategory} />
        <Text style={styles.label}>Mindestens haltbar bis</Text>
        <TextInput
          style={styles.input}
          value={date}
          onChangeText={setDate}
          placeholder="TT.MM.JJJJ"
          keyboardType="numbers-and-punctuation"
        />
        <View style={{ height: 8 }} />
        <ActionButton
          label={saving ? "Speichern …" : "Speichern"}
          disabled={saving}
          onPress={() => void submit()}
        />
        <Pressable
          onPress={() =>
            existing
              ? router.replace({ pathname: "/produktdetails", params: { id: existing.id } })
              : router.replace("/")
          }
          style={styles.backButton}
        >
          <Text style={styles.remove}>Zurück</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: colors.background,
  },
  center: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 30,
    gap: 8,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  back: {
    fontSize: 32,
    color: colors.text,
  },
  heading: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
  },
  label: {
    color: colors.muted,
    fontSize: 12,
    marginTop: 4,
  },
  input: {
    height: 46,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 16,
    backgroundColor: colors.surface,
    fontSize: 16,
  },
  error: {
    color: colors.error,
    padding: 8,
  },
  remove: {
    color: colors.dark,
    fontWeight: "600",
  },
  backButton: {
    padding: 12,
  },
});
