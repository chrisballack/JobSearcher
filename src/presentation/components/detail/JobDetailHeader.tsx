import { View, Text, StyleSheet, Image } from "react-native";
import { useTheme } from "@/core/theme";
import {
  spacing,
  fontSize,
  fontWeight,
  borderRadius,
  iconSize,
  shadow,
} from "@/core/design-system";
import { JobCardProps } from "@/presentation/components/JobCard";

interface JobDetailHeaderProps {
  job: JobCardProps;
}

export default function JobDetailHeader({ job }: JobDetailHeaderProps) {
  const { theme } = useTheme();

  return (
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
  );
}

const styles = StyleSheet.create({
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
});
