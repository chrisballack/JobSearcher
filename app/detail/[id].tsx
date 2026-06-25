import { View, Text, StyleSheet } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/core/theme";
import { spacing, fontSize, fontWeight } from "@/core/design-system";

export default function JobDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { t } = useTranslation();
  const { theme } = useTheme();

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <Text style={[styles.title, { color: theme.colors.text }]}>
        {t("jobDetail.title")}
      </Text>
      <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
        ID: {id}
      </Text>
      <Text style={[styles.subtitle, { color: theme.colors.textTertiary }]}>
        {t("common.comingSoon")}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: fontSize["4xl"],
    fontWeight: fontWeight.bold,
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: fontSize.lg,
    marginTop: spacing.xs,
  },
});
