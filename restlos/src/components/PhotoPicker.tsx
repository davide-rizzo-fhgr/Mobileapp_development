import { File, Paths } from "expo-file-system";
import * as ImagePicker from "expo-image-picker";
import { Alert, Image, Platform, Pressable, StyleSheet, Text, View } from "react-native";

import { colors } from "../constants/colors";
import ActionButton from "./ActionButton";

type PhotoPickerProps = {
  photoUri?: string;
  onChange: (photoUri: string | undefined) => void;
};

// Kopiert das gewählte Bild in den App-Ordner, damit es nach einem Neustart noch vorhanden ist.
function copyToDocuments(uri: string): string {
  const source = new File(uri);
  const fileName = `restlos-${Date.now()}${source.extension || ".jpg"}`;
  const destination = new File(Paths.document, fileName);
  source.copy(destination);
  return destination.uri;
}

// Optionales Foto aus der Galerie. Ohne Foto zeigt die App das Kategorie-Bild.
export default function PhotoPicker({ photoUri, onChange }: PhotoPickerProps) {
  async function handleChoose() {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        quality: 0.6,
        base64: Platform.OS === "web",
      });
      if (result.canceled) {
        return;
      }

      const asset = result.assets[0];
      if (Platform.OS === "web") {
        // Im Browser gibt es keinen App-Ordner. Das Bild wird als Data-URL gespeichert.
        onChange(`data:${asset.mimeType ?? "image/jpeg"};base64,${asset.base64}`);
      } else {
        onChange(copyToDocuments(asset.uri));
      }
    } catch (error) {
      console.error("Foto auswählen fehlgeschlagen:", error);
      Alert.alert("Foto", "Das Foto konnte nicht ausgewählt werden.");
    }
  }

  return (
    <View style={styles.row}>
      <View style={styles.preview}>
        {photoUri !== undefined && <Image source={{ uri: photoUri }} style={styles.image} />}
      </View>
      <View style={styles.actions}>
        <ActionButton
          label={photoUri === undefined ? "Foto hinzufügen" : "Foto ändern"}
          secondary
          onPress={handleChoose}
        />
        {photoUri === undefined ? (
          <Text style={styles.hint}>Optional · ohne Foto erscheint das Kategorie-Bild</Text>
        ) : (
          <Pressable accessibilityRole="button" onPress={() => onChange(undefined)} hitSlop={8}>
            <Text style={styles.remove}>Foto entfernen</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  preview: {
    width: 80,
    height: 80,
    borderRadius: 12,
    backgroundColor: colors.light,
    overflow: "hidden",
  },
  image: {
    width: 80,
    height: 80,
  },
  actions: {
    flex: 1,
    gap: 6,
  },
  hint: {
    color: colors.muted,
    fontSize: 12,
  },
  remove: {
    color: colors.dark,
    fontSize: 14,
    fontWeight: "600",
  },
});
