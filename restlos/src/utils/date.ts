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
