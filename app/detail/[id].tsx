import { useCallback, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Linking,
  Share,
  useWindowDimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { useTranslation } from "react-i18next";
import { HtmlRenderer } from "@/core/utils/htmlRenderer";
import { useTheme } from "@/core/theme";
import {
  spacing,
  fontSize,
  fontWeight,
  borderRadius,
  iconSize,
  shadow,
} from "@/core/design-system";
import { useJobsStore } from "@/presentation/stores/jobsStore";
import { useFavorites } from "@/presentation/hooks/useFavorites";

// ============================================================================
// Constants
// ============================================================================
const TRACKING_PIXEL_PATTERN = /\/track\/\d+\//;

// ============================================================================
// Component
// ============================================================================
export default function JobDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const navigation = useNavigation();
  const { t } = useTranslation();
  const { theme } = useTheme();
  const { width } = useWindowDimensions();
  const { getJobById } = useJobsStore();
  const { toggleFavorite, isFavorite } = useFavorites();

  const job = useMemo(
    () => (id ? getJobById(id) : undefined),
    [id, getJobById],
  );

  const handleApply = useCallback(async () => {
    if (!job?.url) return;
    try {
      await Linking.openURL(job.url);
    } catch (error) {
      if (__DEV__) {
        console.error("[JobDetail] Failed to open URL:", error);
      }
    }
  }, [job?.url]);

  const handleShare = useCallback(async () => {
    if (!job) return;
    try {
      await Share.share({
        message: `${job.title} at ${job.companyName}\n${job.url}`,
        title: job.title,
      });
    } catch (error) {
      if (__DEV__) {
        console.error("[JobDetail] Failed to share:", error);
      }
    }
  }, [job]);

  const handleHtmlLinkPress = useCallback((event: unknown, href: string) => {
    Linking.openURL(href).catch((error: Error) => {
      if (__DEV__) {
        console.error("[JobDetail] Failed to open HTML link:", error);
      }
    });
  }, []);

  if (!job) {
    return (
      <View
        style={[styles.container, { backgroundColor: theme.colors.background }]}
      >
        <View style={styles.notFoundContainer}>
          <Ionicons
            name="briefcase-outline"
            size={iconSize["3xl"]}
            color={theme.colors.textTertiary}
          />
          <Text style={[styles.notFoundText, { color: theme.colors.text }]}>
            {t("jobDetail.notFound")}
          </Text>
        </View>
      </View>
    );
  }

  const formatDetailSalary = (): string => {
    if (job.salaryMin && job.salaryMax) {
      return `${job.currency}${(job.salaryMin / 1000).toFixed(0)}k - ${job.currency}${(job.salaryMax / 1000).toFixed(0)}k`;
    }
    if (job.salaryMin) {
      return `${t("jobs.salary.from")} ${job.currency}${(job.salaryMin / 1000).toFixed(0)}k`;
    }
    if (job.salaryMax) {
      return `${t("jobs.salary.to")} ${job.currency}${(job.salaryMax / 1000).toFixed(0)}k`;
    }
    return t("jobs.salary.notAvailable");
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      showsVerticalScrollIndicator={false}
    >
      <View
        style={[
          styles.header,
          {
            backgroundColor: theme.colors.surface,
            ...shadow.sm,
            shadowColor: theme.colors.shadow,
          },
        ]}
      >
        <View style={styles.logoContainer}>
          {job.companyLogo ? (
            <Image
              source={{ uri: job.companyLogo }}
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
                {job.companyName?.charAt(0).toUpperCase() ?? "?"}
              </Text>
            </View>
          )}
        </View>

        <Text style={[styles.title, { color: theme.colors.text }]}>
          {job.title}
        </Text>
        <Text style={[styles.company, { color: theme.colors.textSecondary }]}>
          {job.companyName}
        </Text>
      </View>

      <View style={styles.infoSection}>
        <View style={styles.infoRow}>
          <Ionicons
            name="location-outline"
            size={iconSize.sm}
            color={theme.colors.primary}
          />
          <Text style={[styles.infoText, { color: theme.colors.text }]}>
            {job.location}
          </Text>
        </View>

        {job.category && (
          <View style={styles.infoRow}>
            <Ionicons
              name="folder-outline"
              size={iconSize.sm}
              color={theme.colors.primary}
            />
            <Text style={[styles.infoText, { color: theme.colors.text }]}>
              {job.category}
            </Text>
          </View>
        )}

        {job.jobType && (
          <View style={styles.infoRow}>
            <Ionicons
              name="time-outline"
              size={iconSize.sm}
              color={theme.colors.primary}
            />
            <Text style={[styles.infoText, { color: theme.colors.text }]}>
              {t(`jobs.types.${job.jobType}`, job.jobType)}
            </Text>
          </View>
        )}

        <View style={styles.infoRow}>
          <Ionicons
            name="cash-outline"
            size={iconSize.sm}
            color={theme.colors.primary}
          />
          <Text style={[styles.infoText, { color: theme.colors.text }]}>
            {formatDetailSalary()}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Ionicons
            name="calendar-outline"
            size={iconSize.sm}
            color={theme.colors.primary}
          />
          <Text style={[styles.infoText, { color: theme.colors.text }]}>
            {job.postedAt}
          </Text>
        </View>
      </View>

      {job.tags && job.tags.length > 0 && (
        <View style={styles.tagsSection}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            {t("jobDetail.tags")}
          </Text>
          <View style={styles.tagsContainer}>
            {job.tags.map((tag: string, index: number) => (
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
        </View>
      )}

      {job.description && (
        <View style={styles.descriptionSection}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            {t("jobDetail.description")}
          </Text>
          <HtmlRenderer html={job.description} />
        </View>
      )}

      <View style={styles.actionsSection}>
        <TouchableOpacity
          style={[
            styles.actionButton,
            { backgroundColor: theme.colors.primary },
          ]}
          onPress={handleApply}
        >
          <Ionicons name="open-outline" size={iconSize.sm} color="#FFFFFF" />
          <Text style={styles.actionButtonText}>{t("jobDetail.apply")}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.actionButton,
            { backgroundColor: theme.colors.surface },
          ]}
          onPress={handleShare}
        >
          <Ionicons
            name="share-outline"
            size={iconSize.sm}
            color={theme.colors.text}
          />
          <Text style={[styles.actionButtonText, { color: theme.colors.text }]}>
            {t("jobDetail.share")}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

// ============================================================================
// Styles
// ============================================================================
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: spacing.xl,
    alignItems: "center",
    marginBottom: spacing.base,
  },
  logoContainer: {
    width: iconSize["3xl"],
    height: iconSize["3xl"],
    marginBottom: spacing.base,
  },
  logo: {
    width: "100%",
    height: "100%",
    borderRadius: borderRadius.lg,
  },
  logoPlaceholder: {
    justifyContent: "center",
    alignItems: "center",
  },
  logoText: {
    fontSize: fontSize["3xl"],
    fontWeight: fontWeight.bold,
  },
  title: {
    fontSize: fontSize["2xl"],
    fontWeight: fontWeight.bold,
    textAlign: "center",
    marginBottom: spacing.xs,
  },
  company: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.medium,
    textAlign: "center",
  },
  infoSection: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.base,
    gap: spacing.md,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  infoText: {
    fontSize: fontSize.base,
    flex: 1,
  },
  tagsSection: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.base,
  },
  sectionTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    marginBottom: spacing.md,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  tag: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
  },
  tagText: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
  },
  descriptionSection: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.base,
  },
  actionsSection: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.xl,
    gap: spacing.md,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
    gap: spacing.sm,
    ...shadow.md,
  },
  actionButtonText: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.bold,
    color: "#FFFFFF",
  },
  headerButton: {
    marginRight: spacing.base,
    padding: spacing.xs,
  },
  notFoundContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: spacing["2xl"],
  },
  notFoundText: {
    fontSize: fontSize.lg,
    marginTop: spacing.base,
  },
});
