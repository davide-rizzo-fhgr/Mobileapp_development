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

export type LoadingState = "loading" | "ready" | "error";
