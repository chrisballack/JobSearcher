import { useEffect, useState, useCallback, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  NativeSyntheticEvent,
  NativeScrollEvent,
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
import EmptyState from "@/presentation/components/common/EmptyState";
import LoadingState from "@/presentation/components/common/LoadingState";
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
      return <LoadingState />;
    }

    if (error) {
      return (
        <EmptyState
          icon="alert-circle-outline"
          title={t("common.error")}
          subtitle={error}
          actionLabel={t("common.retry")}
          onAction={() => refresh()}
        />
      );
    }

    return (
      <EmptyState
        icon="briefcase-outline"
        title={t("jobs.empty.title")}
        subtitle={
          showFilters
            ? t("jobs.empty.subtitleActive")
            : t("jobs.empty.subtitle")
        }
      />
    );
  }, [loading, error, showFilters, t, refresh, isRefreshing]);

  const renderRefreshControl = useCallback(
    () => (
      <RefreshControl
        refreshing={isRefreshing}
        onRefresh={handleRefresh}
        tintColor={theme.colors.primary}
        colors={[theme.colors.primary]}
      />
    ),
    [isRefreshing, handleRefresh, theme.colors.primary],
  );

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
        refreshControl={renderRefreshControl()}
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
});
