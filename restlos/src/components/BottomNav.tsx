import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { colors } from "../constants/colors";

type BottomNavProps = {
  active: "overview" | "pantry";
};

export default function BottomNav({ active }: BottomNavProps) {
  return (
    <View style={styles.nav}>
      <Pressable accessibilityRole="button" onPress={() => router.replace("/")} style={styles.item}>
        <View style={[styles.dot, active === "overview" && styles.dotActive]} />
        <Text style={active === "overview" ? styles.textActive : styles.text}>Übersicht</Text>
      </Pressable>
      <Pressable
        accessibilityRole="button"
        onPress={() => router.replace("/vorrat")}
        style={styles.item}
      >
        <View style={[styles.dot, active === "pantry" && styles.dotActive]} />
        <Text style={active === "pantry" ? styles.textActive : styles.text}>Vorrat</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  nav: {
    flexDirection: "row",
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    height: 44,
  },
  item: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 4,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.border,
  },
  dotActive: {
    backgroundColor: colors.primary,
  },
  text: {
    color: colors.muted,
    fontSize: 14,
  },
  textActive: {
    color: colors.dark,
    fontSize: 12,
    fontWeight: "500",
  },
});
