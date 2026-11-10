import { Link } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

export default function OverviewScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.brand}>Restlos</Text>

      <Text style={styles.slogan}>
        Gutes Essen. Weniger vergessen.
      </Text>

      <Text style={styles.subtitle}>
        Dein Vorrat im Blick.
      </Text>

      <Text style={styles.heading}>Bald aufbrauchen</Text>

      <View style={styles.emptyBox}>
        <Text style={styles.emptyText}>
          Aktuell läuft nichts bald ab.
        </Text>
      </View>

      <Link href="/erfassen" style={styles.link}>
        Lebensmittel erfassen
      </Link>
      
      <Link href="/vorrat" style={styles.link}>
        Zum Vorrat
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fbf8f2",
    padding: 20,
    paddingTop: 40,
  },
  brand: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#284d38",
    marginBottom: 16,
  },
  slogan: {
    fontSize: 16,
    color: "#232621",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#686d62",
    marginBottom: 24,
  },
  heading: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#232621",
    marginBottom: 16,
  },
  emptyBox: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#c9c8bf",
    borderRadius: 12,
    padding: 24,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 14,
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