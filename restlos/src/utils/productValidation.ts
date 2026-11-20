import { isOlderThanOneMonth, isTooFarInFuture, parseDate } from "./date";

export const NAME_MAX_LENGTH = 40;

export type ProductFormValues = {
  name: string;
  quantity: string;
  date: string;
};

// Pro Feld höchstens eine Meldung. Fehlt der Eintrag, ist das Feld gültig.
export type ProductFormErrors = {
  name?: string;
  quantity?: string;
  date?: string;
};

// Akzeptiert "2", "1,5" und "1.5". Liefert null, wenn die Eingabe keine Zahl ist.
export function parseQuantity(value: string): number | null {
  const normalized = value.trim().replace(",", ".");
  if (!/^\d+(\.\d+)?$/.test(normalized)) return null;
  return Number(normalized);
}

// Einheitliche Schreibweise für die Anzeige: "1.50" und "1,5" werden zu "1,5".
export function formatQuantity(quantity: number): string {
  return String(quantity).replace(".", ",");
}

function validateName(name: string): string | undefined {
  if (name.trim() === "") return "Bitte einen Namen eingeben.";
  return undefined;
}

function validateQuantity(value: string): string | undefined {
  if (value.trim() === "") return "Bitte eine Menge eingeben.";

  const quantity = parseQuantity(value);
  if (quantity === null) return "Die Menge muss eine Zahl sein, z. B. 2 oder 1,5.";
  if (quantity <= 0) return "Die Menge muss grösser als 0 sein.";
  return undefined;
}

// originalDate ist das bereits gespeicherte MHD beim Bearbeiten. Bleibt es unverändert,
// gilt die Ein-Monats-Regel nicht. Sonst liessen sich ältere Produkte nicht mehr bearbeiten.
function validateDate(value: string, originalDate?: string): string | undefined {
  if (value.trim() === "") return "Bitte ein Datum eingeben.";

  const date = parseDate(value);
  if (date === null) return "Bitte ein gültiges Datum im Format TT.MM.JJJJ eingeben.";
  if (date === originalDate) return undefined;
  if (isOlderThanOneMonth(date)) return "Das MHD darf höchstens einen Monat zurückliegen.";
  if (isTooFarInFuture(date)) return "Das MHD liegt zu weit in der Zukunft.";
  return undefined;
}

export function validateProductForm(
  values: ProductFormValues,
  originalDate?: string,
): ProductFormErrors {
  return {
    name: validateName(values.name),
    quantity: validateQuantity(values.quantity),
    date: validateDate(values.date, originalDate),
  };
}

export function hasErrors(errors: ProductFormErrors): boolean {
  return errors.name !== undefined || errors.quantity !== undefined || errors.date !== undefined;
}
