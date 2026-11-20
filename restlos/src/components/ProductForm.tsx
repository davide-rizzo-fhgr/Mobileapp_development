import { useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import { colors } from "../constants/colors";
import type { Category, Product, StoragePlace } from "../types/Product";
import { formatDate, parseDate } from "../utils/date";
import {
  formatQuantity,
  hasErrors,
  NAME_MAX_LENGTH,
  parseQuantity,
  validateProductForm,
} from "../utils/productValidation";
import ActionButton from "./ActionButton";
import ChipGroup from "./ChipGroup";
import FormField from "./FormField";

const UNITS = ["Stück", "Becher", "Packung", "g", "kg", "ml", "l"];
const PLACES: StoragePlace[] = ["Kühlschrank", "Tiefkühler", "Vorratsschrank"];
const CATEGORIES: Category[] = ["Milchprodukte", "Obst und Gemüse", "Getreide", "Sonstiges"];

function createId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

type ProductFormProps = {
  existing?: Product;
  onSave: (product: Product) => Promise<boolean>;
};

// Das Formular besitzt nur die Eingaben. Gespeichert und navigiert wird im Screen (onSave).
export default function ProductForm({ existing, onSave }: ProductFormProps) {
  const [name, setName] = useState(existing?.name ?? "");
  const [quantity, setQuantity] = useState(existing?.quantity ?? "");
  const [unit, setUnit] = useState(existing?.unit ?? "Stück");
  const [place, setPlace] = useState<StoragePlace>(existing?.place ?? "Kühlschrank");
  const [category, setCategory] = useState<Category>(existing?.category ?? "Sonstiges");
  const [date, setDate] = useState(existing ? formatDate(existing.expiryDate) : "");

  // Ein Fehler wird erst angezeigt, nachdem das Feld einmal verlassen wurde.
  // Beim Bearbeiten sind alle Felder bereits ausgefüllt und gelten als besucht.
  const [touched, setTouched] = useState({
    name: existing !== undefined,
    quantity: existing !== undefined,
    date: existing !== undefined,
  });
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Abgeleiteter Wert: Die Fehler werden bei jedem Render aus den Eingaben berechnet.
  const errors = validateProductForm({ name, quantity, date }, existing?.expiryDate);
  const isValid = !hasErrors(errors);

  async function handleSubmit() {
    const expiryDate = parseDate(date);
    const parsedQuantity = parseQuantity(quantity);
    if (!isValid || expiryDate === null || parsedQuantity === null) {
      return;
    }

    const product: Product = {
      id: existing?.id ?? createId(),
      name: name.trim(),
      quantity: formatQuantity(parsedQuantity),
      unit,
      place,
      category,
      expiryDate,
      ...(existing?.photoUri ? { photoUri: existing.photoUri } : {}),
    };

    setSaving(true);
    setSaveError(null);
    const ok = await onSave(product);
    if (!ok) {
      setSaving(false);
      setSaveError("Speichern fehlgeschlagen. Bitte versuche es erneut.");
    }
  }

  return (
    <ScrollView
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
      automaticallyAdjustKeyboardInsets
    >
      <FormField
        label="Name"
        value={name}
        onChangeText={setName}
        onBlur={() => setTouched((current) => ({ ...current, name: true }))}
        error={touched.name ? errors.name : undefined}
        placeholder="z. B. Naturjoghurt"
        maxLength={NAME_MAX_LENGTH}
      />
      <FormField
        label="Menge"
        value={quantity}
        onChangeText={setQuantity}
        onBlur={() => setTouched((current) => ({ ...current, quantity: true }))}
        error={touched.quantity ? errors.quantity : undefined}
        placeholder="z. B. 2"
        keyboardType="decimal-pad"
        maxLength={8}
      />

      <Text style={styles.label}>Einheit</Text>
      <ChipGroup options={UNITS} selected={unit} onSelect={setUnit} />

      <Text style={styles.label}>Lagerort</Text>
      <ChipGroup options={PLACES} selected={place} onSelect={setPlace} />

      <Text style={styles.label}>Kategorie</Text>
      <ChipGroup options={CATEGORIES} selected={category} onSelect={setCategory} />

      <FormField
        label="Mindestens haltbar bis"
        value={date}
        onChangeText={setDate}
        onBlur={() => setTouched((current) => ({ ...current, date: true }))}
        error={touched.date ? errors.date : undefined}
        placeholder="TT.MM.JJJJ"
        keyboardType="numbers-and-punctuation"
        maxLength={10}
      />

      <View style={styles.footer}>
        {saveError !== null && <Text style={styles.error}>{saveError}</Text>}
        {!isValid && (
          <Text style={styles.hint}>Speichern ist möglich, sobald alle Angaben gültig sind.</Text>
        )}
        <ActionButton
          label={saving ? "Speichern …" : "Speichern"}
          disabled={!isValid || saving}
          onPress={handleSubmit}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 30,
    gap: 10,
  },
  label: {
    color: colors.muted,
    fontSize: 12,
    marginTop: 4,
  },
  footer: {
    marginTop: 12,
    gap: 8,
  },
  hint: {
    color: colors.muted,
    fontSize: 13,
  },
  error: {
    color: colors.error,
    fontSize: 14,
  },
});
