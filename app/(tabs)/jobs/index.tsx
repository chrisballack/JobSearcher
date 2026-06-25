import { useEffect, useState, useCallback, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  NativeSyntheticEvent,
  NativeScrollEvent,
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
  Category,
  JobType,
} from "@/presentation/components/FilterBar";
import JobCard, { JobCardProps } from "@/presentation/components/JobCard";

// ============================================================================
// Mock Data
// ============================================================================
const MOCK_CATEGORIES: Category[] = [
  { id: 1, name: "Software Dev" },
  { id: 2, name: "Design" },
  { id: 3, name: "Marketing" },
];

const JOB_TYPES: JobType[] = [
  { id: "full_time", name: "Full Time" },
  { id: "part_time", name: "Part Time" },
  { id: "contract", name: "Contract" },
];

const MOCK_JOBS: JobCardProps[] = [
  {
    id: "1",
    title: "Senior Quality Engineer (São Paulo)",
    companyName: "LawnStarter",
    companyLogo: "https://remotive.com/job/2091000/logo",
    location: "Brazil",
    salaryMin: 45000,
    salaryMax: 65000,
    currency: "$",
    postedAt: "25 days ago",
    tags: ["backend", "php", "react"],
    isFavorite: false,
  },
  {
    id: "2",
    title: "Senior Frontend Developer",
    companyName: "TechCorp International",
    location: "Remote - Worldwide",
    salaryMin: 60000,
    salaryMax: 90000,
    currency: "$",
    postedAt: "2 days ago",
    tags: [
      "AWS",
      "backend",
      "frontend",
      "php",
      "react",
      "security",
      "UI/UX",
      "AI/ML",
      "jira",
      "react native",
      "documentation",
      "laravel",
      "Typescript ",
      "people management",
      "prototyping",
      "engineering management",
      "marketplace",
      "github",
      "REST",
      "datadog",
    ],
    isFavorite: true,
  },
  {
    id: "3",
    title: "Backend Developer",
    companyName: "StartupXYZ",
    location: "Remote - LATAM",
    salaryMin: 40000,
    salaryMax: 70000,
    currency: "$",
    postedAt: "5 days ago",
    tags: ["nodejs", "python", "aws"],
    isFavorite: false,
  },
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
  DIRECTION_DELTA: 5, // Mínimo de pixels para considerar cambio de dirección
  HIDE_ABOVE_Y: 100, // Ocultar FilterBar si scrollY > 100
  SHOW_BELOW_Y: 50, // Mostrar FilterBar si scrollY < 50
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

  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    categoryId: null,
    jobType: null,
  });
  const [jobs, setJobs] = useState<JobCardProps[]>(MOCK_JOBS);
  const lastScrollY = useRef(0);
  const isHiddenByScroll = useRef(false);

  const hasActiveFilters =
    filters.search || filters.categoryId || filters.jobType;

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
  const handleApplyFilters = () => {
    console.log("Filtros aplicados:", filters);
    setShowFilters(false);
  };

  const handleToggleFavorite = useCallback((jobId: string) => {
    setJobs((prevJobs) =>
      prevJobs.map((job) =>
        job.id === jobId ? { ...job, isFavorite: !job.isFavorite } : job,
      ),
    );
  }, []);

  const handleJobPress = useCallback(
    (jobId: string) => {
      router.push(`/detail/${jobId}`);
    },
    [router],
  );

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

  const getCategoryName = (categoryId: number | null): string => {
    if (!categoryId) return "";
    const category = MOCK_CATEGORIES.find((c) => c.id === categoryId);
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
        onToggleFavorite={() => handleToggleFavorite(item.id)}
      />
    ),
    [handleJobPress, handleToggleFavorite],
  );

  const renderEmptyList = useCallback(() => {
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
  }, [
    showFilters,
    t,
    theme.colors.text,
    theme.colors.textSecondary,
    theme.colors.textTertiary,
  ]);

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <FilterBar
        visible={showFilters}
        categories={MOCK_CATEGORIES}
        jobTypes={JOB_TYPES}
        filters={filters}
        onFiltersChange={setFilters}
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
            {filters.search && `"${filters.search}" `}
            {filters.categoryId && `• ${getCategoryName(filters.categoryId)} `}
            {filters.jobType && `• ${getJobTypeName(filters.jobType)}`}
          </Text>
        </TouchableOpacity>
      )}

      <FlashList<JobCardProps>
        data={jobs}
        renderItem={renderJobCard}
        keyExtractor={(item) => item.id}
        estimatedItemSize={180}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        ListEmptyComponent={renderEmptyList()}
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
});
