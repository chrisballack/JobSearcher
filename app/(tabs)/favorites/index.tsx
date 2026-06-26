import { useCallback } from "react";
import { View, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { FlashList } from "@shopify/flash-list";
import { useTheme } from "@/core/theme";
import { spacing } from "@/core/design-system";
import JobCard, { JobCardProps } from "@/presentation/components/JobCard";
import EmptyState from "@/presentation/components/common/EmptyState";
import LoadingState from "@/presentation/components/common/LoadingState";
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

  const renderEmptyList = useCallback(() => {
    return (
      <EmptyState
        icon="bookmark-outline"
        title={t("favorites.empty.title")}
        subtitle={t("favorites.empty.subtitle")}
      />
    );
  }, [t]);

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      {loading ? (
        <LoadingState />
      ) : (
        <FlashList<JobCardProps>
          data={favorites}
          renderItem={renderFavoriteCard}
          keyExtractor={(item) => item.id}
          estimatedItemSize={180}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={renderEmptyList()}
        />
      )}
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
});
