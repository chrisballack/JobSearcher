import { useEffect, useState, useCallback, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  NativeSyntheticEvent,
  NativeScrollEvent,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { FlashList } from "@shopify/flash-list";
import { useTheme } from "@/core/theme";
import {
  spacing,
  fontSize,
  fontWeight,
  iconSize,
  borderRadius,
} from "@/core/design-system";
import FilterBar, {
  FilterState,
  JobType,
} from "@/presentation/components/FilterBar";
import JobCard, { JobCardProps } from "@/presentation/components/JobCard";
import { useCategories } from "@/presentation/hooks/useCategories";
import { useJobs } from "@/presentation/hooks/useJobs";
import Config from "@/core/constants/Config";

// ============================================================================
// Job Types
// ============================================================================
const JOB_TYPES: JobType[] = [
  { id: "full_time", name: "Full Time" },
  { id: "part_time", name: "Part Time" },
  { id: "contract", name: "Contract" },
  { id: "freelance", name: "Freelance" },
  { id: "internship", name: "Internship" },
];

// ============================================================================
// Reusable HitSlop
// ============================================================================
const HEADER_ICON_HIT_SLOP = {
  top: spacing.md + 3,
  bottom: spacing.md + 3,
  left: spacing.md + 3,
  right: spacing.md + 3,
};

// ============================================================================
// Scroll Thresholds
// ============================================================================
const SCROLL_THRESHOLD = {
  DIRECTION_DELTA: 5,
  HIDE_ABOVE_Y: 100,
  SHOW_BELOW_Y: 50,
};

// ============================================================================
// Initial filter state
// ============================================================================
const INITIAL_FILTERS: FilterState = {
  search: "",
  categorySlug: null,
  jobType: null,
};

// ============================================================================
// Empty List Component
// ============================================================================
function EmptyJobsList({
  showFilters,
  title,
  subtitle,
  subtitleActive,
  iconColor,
  textColor,
  textSecondaryColor,
}: {
  showFilters: boolean;
  title: string;
  subtitle: string;
  subtitleActive: string;
  iconColor: string;
  textColor: string;
  textSecondaryColor: string;
}) {
  return (
    <View style={styles.emptyState}>
      <Ionicons
        name="briefcase-outline"
        size={iconSize["2xl"]}
        color={iconColor}
      />
      <Text style={[styles.emptyTitle, { color: textColor }]}>{title}</Text>
      <Text style={[styles.emptySubtitle, { color: textSecondaryColor }]}>
        {showFilters ? subtitleActive : subtitle}
      </Text>
    </View>
  );
}

// ============================================================================
// Component
// ============================================================================
export default function JobsScreen() {
  const navigation = useNavigation();
  const router = useRouter();
  const { t } = useTranslation();
  const { theme } = useTheme();

  // Hooks
  const { data: categories = [] } = useCategories();
  const [appliedFilters, setAppliedFilters] =
    useState<FilterState>(INITIAL_FILTERS);
  const selectedCategoryName = appliedFilters.categorySlug
    ? categories.find((c) => c.slug === appliedFilters.categorySlug)?.name
    : undefined;
  const { jobs, loading, error, toggleFavorite, refresh } = useJobs(
    {
      jobType: appliedFilters.jobType || undefined,
      limit: Config.PAGINATION.DEFAULT_LIMIT,
    },
    {
      search: appliedFilters.search || undefined,
      category: selectedCategoryName,
    },
  );

  const [showFilters, setShowFilters] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const lastScrollY = useRef(0);
  const isHiddenByScroll = useRef(false);

  const hasActiveFilters =
    appliedFilters.search ||
    appliedFilters.categorySlug ||
    appliedFilters.jobType;

  // ========================================================================
  // Header button
  // ========================================================================
  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={() => {
            setShowFilters((prev) => {
              const next = !prev;
              if (next) isHiddenByScroll.current = false;
              return next;
            });
          }}
          style={styles.filterButton}
          hitSlop={HEADER_ICON_HIT_SLOP}
        >
          <Ionicons
            name={showFilters ? "options" : "options-outline"}
            size={iconSize.md}
            color={showFilters ? theme.colors.primary : theme.colors.text}
          />
        </TouchableOpacity>
      ),
    });
  }, [navigation, showFilters, theme.colors.primary, theme.colors.text]);

  // ========================================================================
  // Handlers
  // ========================================================================
  const handleApplyFilters = useCallback((newFilters: FilterState) => {
    setAppliedFilters(newFilters);
    setShowFilters(false);
  }, []);

  const handleJobPress = useCallback(
    (jobId: string) => {
      router.push(`/detail/${jobId}`);
    },
    [router],
  );

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await refresh();
    } finally {
      setIsRefreshing(false);
    }
  }, [refresh]);

  // ========================================================================
  // Scroll handler
  // ========================================================================
  const handleScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const currentY = event.nativeEvent.contentOffset.y;
      const delta = currentY - lastScrollY.current;

      if (
        delta > SCROLL_THRESHOLD.DIRECTION_DELTA &&
        currentY > SCROLL_THRESHOLD.HIDE_ABOVE_Y &&
        !isHiddenByScroll.current
      ) {
        isHiddenByScroll.current = true;
        setShowFilters(false);
      }

      lastScrollY.current = currentY;
    },
    [],
  );

  // ========================================================================
  // Pill organisers
  // ========================================================================
  const getJobTypeName = (jobTypeId: string | null): string => {
    if (!jobTypeId) return "";
    return t(`jobs.types.${jobTypeId}`, jobTypeId);
  };

  const getCategoryName = (categorySlug: string | null): string => {
    if (!categorySlug) return "";
    const category = categories.find((c) => c.slug === categorySlug);
    return category?.name || "";
  };

  // ========================================================================
  // Renderers
  // ========================================================================
  const renderJobCard = useCallback(
    ({ item }: { item: JobCardProps }) => (
      <JobCard
        {...item}
        onPress={() => handleJobPress(item.id)}
        onToggleFavorite={() => toggleFavorite(item)}
      />
    ),
    [handleJobPress, toggleFavorite],
  );

  const renderEmptyList = useCallback(() => {
    if (loading && !isRefreshing) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text
            style={[styles.loadingText, { color: theme.colors.textSecondary }]}
          >
            {t("common.loading")}
          </Text>
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.emptyState}>
          <Ionicons
            name="alert-circle-outline"
            size={iconSize["2xl"]}
            color={theme.colors.error}
          />
          <Text style={[styles.emptyTitle, { color: theme.colors.text }]}>
            {t("common.error")}
          </Text>
          <Text
            style={[
              styles.emptySubtitle,
              { color: theme.colors.textSecondary },
            ]}
          >
            {error}
          </Text>
          <TouchableOpacity
            style={[
              styles.retryButton,
              { backgroundColor: theme.colors.primary },
            ]}
            onPress={() => refresh()}
          >
            <Text style={styles.retryButtonText}>{t("common.retry")}</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <EmptyJobsList
        showFilters={showFilters}
        title={t("jobs.empty.title")}
        subtitle={t("jobs.empty.subtitle")}
        subtitleActive={t("jobs.empty.subtitleActive")}
        iconColor={theme.colors.textTertiary}
        textColor={theme.colors.text}
        textSecondaryColor={theme.colors.textSecondary}
      />
    );
  }, [loading, error, showFilters, t, theme, refresh, isRefreshing]);

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <FilterBar
        visible={showFilters}
        categories={categories}
        jobTypes={JOB_TYPES}
        filters={appliedFilters}
        onApply={handleApplyFilters}
      />

      {hasActiveFilters && (
        <TouchableOpacity
          style={[
            styles.activeFiltersSummary,
            { backgroundColor: theme.colors.surfaceVariant },
          ]}
          onPress={() => {
            isHiddenByScroll.current = false;
            setShowFilters(true);
          }}
          activeOpacity={0.7}
        >
          <Ionicons
            name="funnel"
            size={iconSize.xs}
            color={theme.colors.primary}
          />
          <Text
            style={[styles.activeFiltersText, { color: theme.colors.primary }]}
            numberOfLines={1}
          >
            {appliedFilters.search && `"${appliedFilters.search}" `}
            {appliedFilters.categorySlug &&
              `• ${getCategoryName(appliedFilters.categorySlug)} `}
            {appliedFilters.jobType &&
              `• ${getJobTypeName(appliedFilters.jobType)}`}
          </Text>
        </TouchableOpacity>
      )}

      <FlashList
        data={jobs}
        renderItem={renderJobCard}
        keyExtractor={(item) => item.id}
        estimatedItemSize={180}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        ListEmptyComponent={renderEmptyList()}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            tintColor={theme.colors.primary}
            colors={[theme.colors.primary]}
          />
        }
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
  filterButton: {
    marginRight: spacing.base,
    padding: spacing.xs,
  },
  listContent: {
    paddingBottom: spacing.base,
  },
  activeFiltersSummary: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: spacing.base,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: spacing.md + 2,
    borderRadius: borderRadius.lg,
    gap: spacing.sm,
  },
  activeFiltersText: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
    flex: 1,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: spacing["2xl"],
    minHeight: 300,
  },
  emptyTitle: {
    fontSize: fontSize["3xl"],
    fontWeight: fontWeight.bold,
    marginTop: spacing.base,
    marginBottom: spacing.sm,
  },
  emptySubtitle: {
    fontSize: fontSize.md,
    textAlign: "center",
    lineHeight: 22,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: spacing["2xl"],
    minHeight: 300,
    gap: spacing.base,
  },
  loadingText: {
    fontSize: fontSize.md,
  },
  retryButton: {
    marginTop: spacing.base,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
  },
  retryButtonText: {
    color: "#FFFFFF",
    fontSize: fontSize.base,
    fontWeight: fontWeight.bold,
  },
});
