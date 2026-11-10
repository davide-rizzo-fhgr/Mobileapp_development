import { StyleSheet, Text, View } from "react-native";

export default function ProduktdetailsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Produktdetails</Text>

      <Text style={styles.name}>Naturjoghurt</Text>

      <Text style={styles.description}>
        Das ist ein Beispielprodukt.
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
    marginBottom: 24,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#284d38",
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: "#686d62",
  },
});