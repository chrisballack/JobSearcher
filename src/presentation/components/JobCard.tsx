import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/core/theme";
import {
  spacing,
  fontSize,
  fontWeight,
  borderRadius,
  iconSize,
  shadow,
} from "@/core/design-system";

// ============================================================================
// Types
// ============================================================================
export interface JobCardProps {
  id: string;
  title: string;
  companyName?: string;
  companyLogo?: string;
  location: string;
  salaryMin?: number;
  salaryMax?: number;
  currency?: string;
  postedAt: string;
  tags?: string[];
  isFavorite?: boolean;
  onPress?: () => void;
  onToggleFavorite?: () => void;
}

// ============================================================================
// Constants (sin magic numbers)
// ============================================================================
const BOOKMARK_HIT_SLOP = {
  top: spacing.md,
  bottom: spacing.md,
  left: spacing.md,
  right: spacing.md,
};

const MAX_TAGS_VISIBLE = 5;

// ============================================================================
// Helpers
// ============================================================================
const formatSalary = (
  min?: number,
  max?: number,
  currency: string = "$",
  t: (key: string) => string = (key) => key,
): string => {
  if (!min && !max) return t("jobs.salary.notAvailable");

  const formatNumber = (num: number): string => {
    if (num >= 1000) {
      return `${currency}${(num / 1000).toFixed(0)}k`;
    }
    return `${currency}${num}`;
  };

  if (min && max) {
    return `${formatNumber(min)} - ${formatNumber(max)}`;
  }
  if (min) {
    return `${t("jobs.salary.from")} ${formatNumber(min)}`;
  }
  if (max) {
    return `${t("jobs.salary.to")} ${formatNumber(max)}`;
  }

  return t("jobs.salary.notAvailable");
};

// ============================================================================
// Component
// ============================================================================
export default function JobCard({
  id,
  title,
  companyName,
  companyLogo,
  location,
  salaryMin,
  salaryMax,
  currency = "$",
  postedAt,
  tags = [],
  isFavorite = false,
  onPress,
  onToggleFavorite,
}: JobCardProps) {
  const { t } = useTranslation();
  const { theme } = useTheme();

  const visibleTags = tags.slice(0, MAX_TAGS_VISIBLE);
  const safeCompanyName = companyName || "";
  const companyInitial =
    safeCompanyName.length > 0 ? safeCompanyName.charAt(0).toUpperCase() : "?";

  return (
    <TouchableOpacity
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.cardBackground,
          ...shadow.sm,
          shadowColor: theme.colors.shadow,
        },
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {/* Header: Logo + Bookmark */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          {companyLogo ? (
            <Image
              source={{ uri: companyLogo }}
              style={styles.logo}
              resizeMode="contain"
            />
          ) : (
            <View
              style={[
                styles.logo,
                styles.logoPlaceholder,
                { backgroundColor: theme.colors.surfaceVariant },
              ]}
            >
              <Text style={[styles.logoText, { color: theme.colors.primary }]}>
                {companyInitial}
              </Text>
            </View>
          )}
        </View>

        <TouchableOpacity
          style={styles.bookmarkButton}
          onPress={onToggleFavorite}
          hitSlop={BOOKMARK_HIT_SLOP}
        >
          <Ionicons
            name={isFavorite ? "bookmark" : "bookmark-outline"}
            size={iconSize.md}
            color={
              isFavorite ? theme.colors.primary : theme.colors.textSecondary
            }
          />
        </TouchableOpacity>
      </View>

      {/* Title & Company */}
      <View style={styles.content}>
        <Text
          style={[styles.title, { color: theme.colors.text }]}
          numberOfLines={2}
        >
          {title}
        </Text>
        <Text
          style={[styles.company, { color: theme.colors.textSecondary }]}
          numberOfLines={1}
        >
          {companyName || t("jobs.company.unknown")}
        </Text>

        {/* Tags */}
        {visibleTags.length > 0 && (
          <View style={styles.tagsContainer}>
            {visibleTags.map((tag: string, index: number) => (
              <View
                key={index}
                style={[
                  styles.tag,
                  { backgroundColor: theme.colors.surfaceVariant },
                ]}
              >
                <Text
                  style={[
                    styles.tagText,
                    { color: theme.colors.textSecondary },
                  ]}
                >
                  {tag}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Location & Salary */}
        <View style={styles.footer}>
          <View style={styles.locationContainer}>
            <Ionicons
              name="location-outline"
              size={iconSize.xs}
              color={theme.colors.textTertiary}
            />
            <Text
              style={[styles.location, { color: theme.colors.textSecondary }]}
              numberOfLines={1}
            >
              {location}
            </Text>
          </View>

          <Text style={[styles.salary, { color: theme.colors.primary }]}>
            {formatSalary(salaryMin, salaryMax, currency, t)}
          </Text>
        </View>

        {/* Posted Date */}
        <Text style={[styles.postedAt, { color: theme.colors.textTertiary }]}>
          {postedAt}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

// ============================================================================
// Styles
// ============================================================================
const styles = StyleSheet.create({
  container: {
    borderRadius: borderRadius.xl,
    marginHorizontal: spacing.base,
    marginVertical: spacing.sm,
    padding: spacing.base,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: spacing.md,
  },
  logoContainer: {
    width: iconSize.lg,
    height: iconSize.lg,
  },
  logo: {
    width: "100%",
    height: "100%",
    borderRadius: borderRadius.md,
  },
  logoPlaceholder: {
    justifyContent: "center",
    alignItems: "center",
  },
  logoText: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
  },
  bookmarkButton: {
    padding: spacing.xs,
  },
  content: {
    gap: spacing.sm,
  },
  title: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
    lineHeight: 20,
  },
  company: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.medium,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  tag: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  tagText: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.medium,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: spacing.sm,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    flex: 1,
  },
  location: {
    fontSize: fontSize.sm,
    flexShrink: 1,
  },
  salary: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
    marginLeft: spacing.sm,
  },
  postedAt: {
    fontSize: fontSize.xs,
    marginTop: spacing.xs,
  },
});
