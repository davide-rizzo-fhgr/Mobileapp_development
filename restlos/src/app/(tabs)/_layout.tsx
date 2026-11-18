import { Tabs } from "expo-router/js-tabs";
import { Image, StyleSheet } from "react-native";

import { colors } from "../../constants/colors";

// Übersicht und Vorrat sind über die untere Navigation erreichbar.
export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.muted,
        tabBarStyle: { backgroundColor: colors.surface },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Übersicht",
          tabBarIcon: ({ color }) => (
            <Image
              source={require("../../../assets/images/tabIcons/home.png")}
              style={[styles.icon, { tintColor: color }]}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="vorrat"
        options={{
          title: "Vorrat",
          tabBarIcon: ({ color }) => (
            <Image
              source={require("../../../assets/images/tabIcons/explore.png")}
              style={[styles.icon, { tintColor: color }]}
            />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  icon: {
    width: 24,
    height: 24,
  },
});
