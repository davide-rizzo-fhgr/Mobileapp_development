import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

import { colors } from "../constants/colors";
import { ProductProvider } from "../context/ProductContext";

export default function RootLayout() {
  return (
    <ProductProvider>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.dark,
          headerBackTitle: "Zurück",
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="erfassen" options={{ title: "Lebensmittel erfassen" }} />
        <Stack.Screen name="produktdetails" options={{ title: "Details" }} />
      </Stack>
    </ProductProvider>
  );
}
