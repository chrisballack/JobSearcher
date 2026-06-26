import { useCallback, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Linking,
  Share,
  useWindowDimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/core/theme";
import { spacing, fontSize, iconSize } from "@/core/design-system";
import { useJobsStore } from "@/presentation/stores/jobsStore";
import { useFavorites } from "@/presentation/hooks/useFavorites";
import JobDetailHeader from "@/presentation/components/detail/JobDetailHeader";
import JobDetailInfoSection from "@/presentation/components/detail/JobDetailInfoSection";
import JobDetailTags from "@/presentation/components/detail/JobDetailTags";
import JobDetailDescription from "@/presentation/components/detail/JobDetailDescription";
import JobDetailActions from "@/presentation/components/detail/JobDetailActions";

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

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      showsVerticalScrollIndicator={false}
    >
      <JobDetailHeader job={job} />
      <JobDetailInfoSection job={job} />
      {job.tags && job.tags.length > 0 && <JobDetailTags tags={job.tags} />}
      {job.description && <JobDetailDescription html={job.description} />}
      <JobDetailActions onApply={handleApply} onShare={handleShare} />
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
