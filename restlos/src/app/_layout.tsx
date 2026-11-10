import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="erfassen"
        options={{ title: "Erfassen" }}
      />

      <Stack.Screen
        name="index"
        options={{ title: "Restlos" }}
      />

      <Stack.Screen
        name="vorrat"
        options={{ title: "Vorrat" }}
      />

      <Stack.Screen
        name="produktdetails"
        options={{ title: "Produktdetails" }}
      />
    </Stack>
  );
}