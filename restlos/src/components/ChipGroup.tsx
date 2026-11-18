import { Pressable, StyleSheet, Text, View } from "react-native";

import { colors } from "../constants/colors";

// Generisch, damit die Auswahl für Einheit, Lagerort, Kategorie und Filter typisiert bleibt.
type ChipGroupProps<T extends string> = {
  options: T[];
  selected: T;
  onSelect: (value: T) => void;
};

export default function ChipGroup<T extends string>({
  options,
  selected,
  onSelect,
}: ChipGroupProps<T>) {
  return (
    <View style={styles.row}>
      {options.map((option) => (
        <Pressable
          key={option}
          accessibilityRole="button"
          accessibilityState={{ selected: option === selected }}
          onPress={() => onSelect(option)}
          style={[styles.chip, option === selected && styles.chipSelected]}
        >
          <Text style={option === selected ? styles.textSelected : styles.text}>{option}</Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    borderRadius: 999,
  },
  chipSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  text: {
    color: colors.muted,
    fontSize: 14,
  },
  textSelected: {
    color: colors.surface,
    fontSize: 14,
  },
});
