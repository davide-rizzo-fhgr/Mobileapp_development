import { StyleSheet, Text, View } from "react-native";

export default function ErfassenScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Lebensmittel erfassen</Text>

      <Text style={styles.description}>
        Hier kannst du später ein Lebensmittel hinzufügen.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fbf8f2",
    padding: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#232621",
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: "#686d62",
  },
});