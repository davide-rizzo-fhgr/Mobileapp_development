export type StoragePlace = "Kühlschrank" | "Tiefkühler" | "Vorratsschrank";
export type Category = "Milchprodukte" | "Obst und Gemüse" | "Getreide" | "Sonstiges";

export interface Product {
  id: string;
  name: string;
  quantity: string;
  unit: string;
  place: StoragePlace;
  category: Category;
  expiryDate: string;
  photoUri?: string;
}

export function daysUntil(date: string): number {
  const [year, month, day] = date.split("-").map(Number);
  const today = new Date();
  return Math.round((Date.UTC(year, month - 1, day) - Date.UTC(today.getFullYear(), today.getMonth(), today.getDate())) / 86400000);
}

export function formatDate(date: string): string {
  const [year, month, day] = date.split("-");
  return `${day}.${month}.${year}`;
}

export function expiryLabel(date: string): string {
  const days = daysUntil(date);
  if (days < 0) return `MHD seit ${Math.abs(days)} ${days === -1 ? "Tag" : "Tagen"} überschritten`;
  if (days === 0) return "MHD heute";
  if (days === 1) return "MHD morgen";
  if (days <= 7) return `MHD in ${days} Tagen`;
  return `MHD ${formatDate(date)}`;
}
