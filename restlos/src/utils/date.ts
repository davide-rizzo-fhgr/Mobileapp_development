// Das MHD wird als "JJJJ-MM-TT" gespeichert. So lässt es sich als Text sortieren.

export function daysUntil(date: string): number {
  const [year, month, day] = date.split("-").map(Number);
  const today = new Date();
  const todayUtc = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate());
  return Math.round((Date.UTC(year, month - 1, day) - todayUtc) / 86400000);
}

// Ab so vielen Tagen vor dem MHD gilt ein Produkt als "bald aufbrauchen".
export const SOON_DAYS = 3;

// true, wenn das MHD überschritten ist oder in den nächsten SOON_DAYS Tagen liegt.
export function isExpiringSoon(date: string): boolean {
  return daysUntil(date) <= SOON_DAYS;
}

export function formatDate(date: string): string {
  const [year, month, day] = date.split("-");
  return `${day}.${month}.${year}`;
}

export function expiryLabel(date: string): string {
  const days = daysUntil(date);
  if (days < 0) {
    return `MHD seit ${Math.abs(days)} ${days === -1 ? "Tag" : "Tagen"} überschritten`;
  }
  if (days === 0) return "MHD heute";
  if (days === 1) return "MHD morgen";
  if (days <= 7) return `MHD in ${days} Tagen`;
  return `MHD ${formatDate(date)}`;
}

// Wandelt "TT.MM.JJJJ" in "JJJJ-MM-TT" um. Liefert null, wenn es dieses Datum nicht gibt.
export function parseDate(value: string): string | null {
  const match = /^(\d{2})\.(\d{2})\.(\d{4})$/.exec(value.trim());
  if (match === null) return null;

  const day = Number(match[1]);
  const month = Number(match[2]);
  const year = Number(match[3]);
  const date = new Date(year, month - 1, day);

  // new Date(2026, 1, 31) ergibt den 3. März. So werden Daten wie der 31.02. erkannt.
  const exists =
    date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
  if (!exists) return null;

  return `${match[3]}-${match[2]}-${match[1]}`;
}

// true, wenn das MHD mehr als einen Kalendermonat vor heute liegt.
export function isOlderThanOneMonth(date: string): boolean {
  const today = new Date();
  const lastDayOfPreviousMonth = new Date(today.getFullYear(), today.getMonth(), 0).getDate();
  const earliestDay = Math.min(today.getDate(), lastDayOfPreviousMonth);
  const earliestDate = new Date(today.getFullYear(), today.getMonth() - 1, earliestDay);

  const [year, month, day] = date.split("-").map(Number);
  return new Date(year, month - 1, day) < earliestDate;
}

// true, wenn das MHD mehr als zehn Jahre in der Zukunft liegt (meist ein Tippfehler).
export function isTooFarInFuture(date: string): boolean {
  return daysUntil(date) > 3650;
}
