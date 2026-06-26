import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/core/theme";
import { spacing, fontSize, iconSize } from "@/core/design-system";
import { JobCardProps } from "@/presentation/components/JobCard";

interface JobDetailInfoSectionProps {
  job: JobCardProps;
}

export default function JobDetailInfoSection({
  job,
}: JobDetailInfoSectionProps) {
  const { t } = useTranslation();
  const { theme } = useTheme();

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
  );
}

const styles = StyleSheet.create({
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
});
