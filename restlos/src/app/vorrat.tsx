import { StyleSheet, Text, View } from "react-native";
import { Link } from "expo-router";

export default function VorratScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Dein Vorrat</Text>

      <Text style={styles.description}>
        Hier erscheinen später deine Lebensmittel.
      </Text>

      <Link href="/produktdetails" style={styles.link}>
        Beispielprodukt ansehen
      </Link>
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
  link: {
    marginTop: 24,
    backgroundColor: "#3e7152",
    color: "#ffffff",
    textAlign: "center",
    padding: 14,
    borderRadius: 12,
    overflow: "hidden",
    fontSize: 16,
    fontWeight: "bold",
  },
});