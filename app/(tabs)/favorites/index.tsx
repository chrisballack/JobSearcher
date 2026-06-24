import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";

export default function FavoritesScreen() {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <View style={styles.emptyState}>
        <Ionicons name="bookmark-outline" size={80} color="#d1d1d6" />
        <Text style={styles.title}>{t("favorites.empty.title")}</Text>
        <Text style={styles.subtitle}>{t("favorites.empty.subtitle")}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#1c1c1e",
    marginTop: 16,
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 15,
    color: "#8e8e93",
    textAlign: "center",
    lineHeight: 22,
  },
});
