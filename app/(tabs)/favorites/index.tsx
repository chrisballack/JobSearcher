import { useCallback, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { useRouter } from "expo-router";
import { FlashList } from "@shopify/flash-list";
import { useTheme } from "@/core/theme";
import { spacing, fontSize, fontWeight, iconSize } from "@/core/design-system";
import JobCard, { JobCardProps } from "@/presentation/components/JobCard";

// ============================================================================
// Mock Data
// ============================================================================
const MOCK_FAVORITES: JobCardProps[] = [
  {
    id: "2",
    title: "Senior Frontend Developer",
    companyName: "TechCorp International",
    location: "Remote - Worldwide",
    salaryMin: 60000,
    salaryMax: 90000,
    currency: "$",
    postedAt: "2 days ago",
    tags: ["frontend", "react", "typescript"],
    isFavorite: true,
  },
  {
    id: "4",
    title: "Product Designer",
    companyName: "DesignHub",
    location: "Remote - US/EU",
    salaryMin: 70000,
    salaryMax: 100000,
    currency: "$",
    postedAt: "1 week ago",
    tags: ["ui/ux", "figma", "design"],
    isFavorite: true,
  },
];

// ============================================================================
// Component
// ============================================================================
export default function FavoritesScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { theme } = useTheme();
  const [favorites, setFavorites] = useState<JobCardProps[]>(MOCK_FAVORITES);

  const handleToggleFavorite = useCallback((jobId: string) => {
    setFavorites((prev: JobCardProps[]) =>
      prev.filter((job) => job.id !== jobId),
    );
  }, []);

  const handleJobPress = useCallback(
    (jobId: string) => {
      router.push(`/detail/${jobId}`);
    },
    [router],
  );

  const renderFavoriteCard = useCallback(
    ({ item }: { item: JobCardProps }) => (
      <JobCard
        {...item}
        onPress={() => handleJobPress(item.id)}
        onToggleFavorite={() => handleToggleFavorite(item.id)}
      />
    ),
    [handleJobPress, handleToggleFavorite],
  );

  const renderEmptyList = () => (
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
  );

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
