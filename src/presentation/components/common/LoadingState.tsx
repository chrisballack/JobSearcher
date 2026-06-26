import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/core/theme";
import { spacing, fontSize } from "@/core/design-system";

interface LoadingStateProps {
  message?: string;
}

export default function LoadingState({ message }: LoadingStateProps) {
  const { t } = useTranslation();
  const { theme } = useTheme();

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={theme.colors.primary} />
      <Text style={[styles.message, { color: theme.colors.textSecondary }]}>
        {message || t("common.loading")}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: spacing["2xl"],
    minHeight: 300,
    gap: spacing.base,
  },
  message: {
    fontSize: fontSize.md,
  },
});
