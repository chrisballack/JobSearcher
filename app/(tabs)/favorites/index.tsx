import { useCallback } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { useRouter } from "expo-router";
import { FlashList } from "@shopify/flash-list";
import { useTheme } from "@/core/theme";
import { spacing, fontSize, fontWeight, iconSize } from "@/core/design-system";
import JobCard, { JobCardProps } from "@/presentation/components/JobCard";
import { useFavorites } from "@/presentation/hooks/useFavorites";

// ============================================================================
// Component
// ============================================================================
export default function FavoritesScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { theme } = useTheme();
  const { favorites, loading, toggleFavorite } = useFavorites();

  const handleJobPress = useCallback(
    (jobId: string) => {
      router.push(`/detail/${jobId}`);
    },
    [router],
  );

  const handleToggleFavorite = useCallback(
    (job: JobCardProps) => {
      toggleFavorite(job);
    },
    [toggleFavorite],
  );

  const renderFavoriteCard = useCallback(
    ({ item }: { item: JobCardProps }) => (
      <JobCard
        {...item}
        onPress={() => handleJobPress(item.id)}
        onToggleFavorite={() => handleToggleFavorite(item)}
      />
    ),
    [handleJobPress, handleToggleFavorite],
  );

  const renderEmptyList = useCallback(
    () => (
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
    ),
    [
      t,
      theme.colors.text,
      theme.colors.textSecondary,
      theme.colors.textTertiary,
    ],
  );

  if (loading) {
    return (
      <View
        style={[styles.container, { backgroundColor: theme.colors.background }]}
      >
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text
            style={[styles.subtitle, { color: theme.colors.textSecondary }]}
          >
            {t("common.loading")}
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <FlashList<JobCardProps>
        data={favorites}
        renderItem={renderFavoriteCard}
        keyExtractor={(item) => item.id}
        estimatedItemSize={180}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={renderEmptyList}
      />
    </View>
  );
}

// ============================================================================
// Styles
// ============================================================================
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    paddingVertical: spacing.base,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: spacing["2xl"],
    minHeight: 300,
    gap: spacing.base,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: spacing["2xl"],
    minHeight: 300,
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
