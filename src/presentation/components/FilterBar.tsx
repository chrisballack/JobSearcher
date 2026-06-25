import { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Animated,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/core/theme";
import {
  spacing,
  fontSize,
  fontWeight,
  borderRadius,
  shadow,
  borderWidth,
  iconSize,
  animationDuration,
  springConfig,
  animationValues,
  thresholds,
} from "@/core/design-system";
import { Category } from "@/domain/entities/Category";

// ============================================================================
// Types
// ============================================================================
export interface JobType {
  id: string;
  name: string;
}

export interface FilterState {
  search: string;
  categorySlug: string | null;
  jobType: string | null;
}

interface FilterBarProps {
  visible: boolean;
  categories: Category[];
  jobTypes: JobType[];
  filters: FilterState;
  onApply: (filters: FilterState) => void;
}

// ============================================================================
// Predefined job types (Remotive API)
// ============================================================================
const DEFAULT_JOB_TYPES: JobType[] = [
  { id: "full_time", name: "Full Time" },
  { id: "part_time", name: "Part Time" },
  { id: "contract", name: "Contract" },
  { id: "freelance", name: "Freelance" },
  { id: "internship", name: "Internship" },
];

// ============================================================================
// Reusable HitSlop
// ============================================================================
const DEFAULT_HIT_SLOP = {
  top: spacing.sm + 2,
  bottom: spacing.sm + 2,
  left: spacing.sm + 2,
  right: spacing.sm + 2,
};

// ============================================================================
// Component
// ============================================================================
export default function FilterBar({
  visible,
  categories,
  jobTypes,
  filters,
  onApply,
}: FilterBarProps) {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const [localSearch, setLocalSearch] = useState(filters.search);
  const [localCategorySlug, setLocalCategorySlug] = useState<string | null>(
    filters.categorySlug,
  );
  const [localJobType, setLocalJobType] = useState<string | null>(
    filters.jobType,
  );

  const translateY = useRef(
    new Animated.Value(animationValues.translateY.hidden),
  ).current;
  const opacity = useRef(
    new Animated.Value(animationValues.opacity.hidden),
  ).current;

  useEffect(() => {
    if (visible) {
      setLocalSearch(filters.search);
      setLocalCategorySlug(filters.categorySlug);
      setLocalJobType(filters.jobType);
    }
  }, [visible, filters]);

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(translateY, {
          toValue: animationValues.translateY.visible,
          friction: springConfig.normal.friction,
          tension: springConfig.normal.tension,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: animationValues.opacity.visible,
          duration: animationDuration.slow,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: animationValues.translateY.hidden,
          duration: animationDuration.normal,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: animationValues.opacity.hidden,
          duration: animationDuration.fast,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  const clearAll = () => {
    setLocalSearch("");
    setLocalCategorySlug(null);
    setLocalJobType(null);
  };

  const handleApply = () => {
    onApply({
      search: localSearch,
      categorySlug: localCategorySlug,
      jobType: localJobType,
    });
  };

  const hasActiveFilters = localSearch || localCategorySlug || localJobType;
  const hasSearchText = localSearch.length >= thresholds.minLength.search;

  if (!visible) return null;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity,
          transform: [{ translateY }],
          backgroundColor: theme.colors.filterPanelBackground,
          borderBottomColor: theme.colors.filterPanelBorder,
        },
      ]}
    >
      {/* ===== SEARCH BAR ===== */}
      <View
        style={[
          styles.searchContainer,
          { backgroundColor: theme.colors.inputBackground },
        ]}
      >
        <Ionicons
          name="search-outline"
          size={iconSize.sm}
          color={theme.colors.inputPlaceholder}
          style={styles.searchIcon}
        />
        <TextInput
          style={[styles.searchInput, { color: theme.colors.inputText }]}
          placeholder={t("jobs.filters.searchPlaceholder")}
          placeholderTextColor={theme.colors.inputPlaceholder}
          value={localSearch}
          onChangeText={setLocalSearch}
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="search"
        />
        {hasSearchText && (
          <TouchableOpacity
            onPress={() => setLocalSearch("")}
            style={styles.clearButton}
            hitSlop={DEFAULT_HIT_SLOP}
          >
            <Ionicons
              name="close-circle"
              size={iconSize.sm}
              color={theme.colors.inputPlaceholder}
            />
          </TouchableOpacity>
        )}
      </View>

      {/* ===== SECTION 1: CATEGORY ===== */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Ionicons
            name="folder"
            size={iconSize.xs}
            color={theme.colors.primary}
          />
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            {t("jobs.filters.category")}
          </Text>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipsContainer}
        >
          <TouchableOpacity
            style={[
              styles.chip,
              {
                backgroundColor: theme.colors.chipBackground,
                borderColor: theme.colors.chipBorder,
              },
              !localCategorySlug && [
                styles.chipActive,
                {
                  backgroundColor: theme.colors.chipActiveBackground,
                  borderColor: theme.colors.chipActiveBackground,
                },
              ],
            ]}
            onPress={() => setLocalCategorySlug(null)}
          >
            <Text
              style={[
                styles.chipText,
                { color: theme.colors.chipText },
                !localCategorySlug && { color: theme.colors.chipActiveText },
              ]}
            >
              {t("jobs.filters.allCategories")}
            </Text>
          </TouchableOpacity>

          {categories.map((category: Category) => {
            const isSelected = localCategorySlug === category.slug;
            return (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.chip,
                  {
                    backgroundColor: theme.colors.chipBackground,
                    borderColor: theme.colors.chipBorder,
                  },
                  isSelected && [
                    styles.chipActive,
                    {
                      backgroundColor: theme.colors.chipActiveBackground,
                      borderColor: theme.colors.chipActiveBackground,
                    },
                  ],
                ]}
                onPress={() =>
                  setLocalCategorySlug(isSelected ? null : category.slug)
                }
              >
                <Text
                  style={[
                    styles.chipText,
                    { color: theme.colors.chipText },
                    isSelected && { color: theme.colors.chipActiveText },
                  ]}
                  numberOfLines={1}
                >
                  {category.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* ===== SECTION 2: JOB TYPE ===== */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Ionicons
            name="time"
            size={iconSize.xs}
            color={theme.colors.primary}
          />
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            {t("jobs.filters.jobType")}
          </Text>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipsContainer}
        >
          <TouchableOpacity
            style={[
              styles.chip,
              {
                backgroundColor: theme.colors.chipBackground,
                borderColor: theme.colors.chipBorder,
              },
              !localJobType && [
                styles.chipActive,
                {
                  backgroundColor: theme.colors.chipActiveBackground,
                  borderColor: theme.colors.chipActiveBackground,
                },
              ],
            ]}
            onPress={() => setLocalJobType(null)}
          >
            <Text
              style={[
                styles.chipText,
                { color: theme.colors.chipText },
                !localJobType && { color: theme.colors.chipActiveText },
              ]}
            >
              {t("jobs.filters.allTypes")}
            </Text>
          </TouchableOpacity>

          {DEFAULT_JOB_TYPES.map((type: JobType) => (
            <TouchableOpacity
              key={type.id}
              style={[
                styles.chip,
                {
                  backgroundColor: theme.colors.chipBackground,
                  borderColor: theme.colors.chipBorder,
                },
                localJobType === type.id && [
                  styles.chipActive,
                  {
                    backgroundColor: theme.colors.chipActiveBackground,
                    borderColor: theme.colors.chipActiveBackground,
                  },
                ],
              ]}
              onPress={() =>
                setLocalJobType(localJobType === type.id ? null : type.id)
              }
            >
              <Text
                style={[
                  styles.chipText,
                  { color: theme.colors.chipText },
                  localJobType === type.id && {
                    color: theme.colors.chipActiveText,
                  },
                ]}
                numberOfLines={1}
              >
                {t(`jobs.types.${type.id}`, type.name)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* ===== BOTTOM BAR ===== */}
      <View
        style={[
          styles.bottomBar,
          {
            backgroundColor: theme.colors.surface,
            borderTopColor: theme.colors.borderLight,
          },
        ]}
      >
        <View style={styles.bottomActions}>
          {hasActiveFilters && (
            <TouchableOpacity
              onPress={clearAll}
              style={styles.clearAllButton}
              hitSlop={DEFAULT_HIT_SLOP}
            >
              <Ionicons
                name="close-outline"
                size={iconSize.sm}
                color={theme.colors.primary}
              />
              <Text
                style={[styles.clearAllText, { color: theme.colors.primary }]}
              >
                {t("jobs.filters.clearFilters")}
              </Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={[
              styles.applyButton,
              {
                backgroundColor: theme.colors.primary,
                shadowColor: theme.colors.primary,
              },
            ]}
            onPress={handleApply}
          >
            <Text
              style={[
                styles.applyButtonText,
                { color: theme.colors.chipActiveText },
              ]}
            >
              {t("jobs.filters.applyFilters")}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Animated.View>
  );
}

// ============================================================================
// Styles
// ============================================================================
const styles = StyleSheet.create({
  container: {
    borderBottomWidth: borderWidth.thin,
    ...shadow.lg,
    zIndex: 10,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: borderRadius.xl,
    marginHorizontal: spacing.base,
    marginTop: spacing.md,
    marginBottom: spacing.base,
    paddingHorizontal: spacing.md,
    height: 44,
  },
  searchIcon: {
    marginRight: spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: fontSize.md,
    paddingVertical: spacing.sm,
  },
  clearButton: {
    padding: spacing.xs,
  },
  section: {
    marginBottom: spacing.base,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.base,
    marginBottom: spacing.sm + 2,
    gap: 6,
  },
  sectionTitle: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.bold,
  },
  chipsContainer: {
    paddingHorizontal: spacing.base,
    gap: spacing.sm,
  },
  chip: {
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.sm + 2,
    borderRadius: borderRadius["3xl"],
    borderWidth: borderWidth.thin,
    marginRight: spacing.sm,
  },
  chipActive: {},
  chipText: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
  },
  bottomBar: {
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
    borderTopWidth: borderWidth.thin,
  },
  bottomActions: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: spacing.md,
  },
  clearAllButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  clearAllText: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.semibold,
  },
  applyButton: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
    ...shadow.md,
  },
  applyButtonText: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
  },
});
