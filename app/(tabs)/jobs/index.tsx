import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "expo-router";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/core/theme";
import {
  spacing,
  fontSize,
  fontWeight,
  borderRadius,
  iconSize,
} from "@/core/design-system";
import FilterBar, {
  FilterState,
  Category,
  JobType,
} from "@/presentation/components/FilterBar";

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
// Component
// ============================================================================
export default function JobsScreen() {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const { theme } = useTheme();
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    categoryId: null,
    jobType: null,
  });

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={() => setShowFilters((prev) => !prev)}
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

  const handleApplyFilters = () => {
    console.log("Filtros aplicados:", filters);
    setShowFilters(false);
  };

  const getJobTypeName = (jobTypeId: string | null): string => {
    if (!jobTypeId) return "";
    return t(`jobs.types.${jobTypeId}`, jobTypeId);
  };

  const getCategoryName = (categoryId: number | null): string => {
    if (!categoryId) return "";
    const category = MOCK_CATEGORIES.find((c) => c.id === categoryId);
    return category?.name || "";
  };

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

      <ScrollView contentContainerStyle={styles.content}>
        {(filters.search || filters.categoryId || filters.jobType) && (
          <View
            style={[
              styles.activeFiltersSummary,
              { backgroundColor: theme.colors.surfaceVariant },
            ]}
          >
            <Ionicons
              name="funnel"
              size={iconSize.xs}
              color={theme.colors.primary}
            />
            <Text
              style={[
                styles.activeFiltersText,
                { color: theme.colors.primary },
              ]}
            >
              {filters.search && `"${filters.search}" `}
              {filters.categoryId &&
                `• ${getCategoryName(filters.categoryId)} `}
              {filters.jobType && `• ${getJobTypeName(filters.jobType)}`}
            </Text>
          </View>
        )}

        <View style={styles.emptyState}>
          <Ionicons
            name="briefcase-outline"
            size={iconSize["2xl"]}
            color={theme.colors.textTertiary}
          />
          <Text style={[styles.emptyTitle, { color: theme.colors.text }]}>
            {t("jobs.empty.title")}
          </Text>
          <Text
            style={[
              styles.emptySubtitle,
              { color: theme.colors.textSecondary },
            ]}
          >
            {showFilters
              ? t("jobs.empty.subtitleActive")
              : t("jobs.empty.subtitle")}
          </Text>
        </View>
      </ScrollView>
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
  content: {
    flexGrow: 1,
  },
  activeFiltersSummary: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: spacing.base,
    marginTop: spacing.md,
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
