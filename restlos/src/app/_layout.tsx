import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

import { ProductProvider } from "../context/ProductContext";

export default function RootLayout() {
  return (
    <ProductProvider>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }} />
    </ProductProvider>
  );
}
