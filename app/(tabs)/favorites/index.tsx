import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/core/theme";
import { spacing, fontSize, fontWeight, iconSize } from "@/core/design-system";

export default function FavoritesScreen() {
  const { t } = useTranslation();
  const { theme } = useTheme();

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <View style={styles.emptyState}>
        <Ionicons
          name="bookmark-outline"
          size={iconSize["3xl"]}
          color={theme.colors.textTertiary}
        />
        <Text style={[styles.title, { color: theme.colors.text }]}>
          {t("favorites.empty.title")}
        </Text>
        <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
          {t("favorites.empty.subtitle")}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: spacing["2xl"],
  },
  title: {
    fontSize: fontSize["3xl"],
    fontWeight: fontWeight.bold,
    marginTop: spacing.base,
    marginBottom: spacing.sm,
    textAlign: "center",
  },
  subtitle: {
    fontSize: fontSize.md,
    textAlign: "center",
    lineHeight: 22,
  },
});
