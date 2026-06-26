import { View, Text, StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/core/theme";
import {
  spacing,
  fontSize,
  fontWeight,
  borderRadius,
} from "@/core/design-system";

interface JobDetailTagsProps {
  tags: string[];
}

export default function JobDetailTags({ tags }: JobDetailTagsProps) {
  const { t } = useTranslation();
  const { theme } = useTheme();

  return (
    <View style={styles.tagsSection}>
      <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
        {t("jobDetail.tags")}
      </Text>
      <View style={styles.tagsContainer}>
        {tags.map((tag: string, index: number) => (
          <View
            key={index}
            style={[
              styles.tag,
              { backgroundColor: theme.colors.surfaceVariant },
            ]}
          >
            <Text
              style={[styles.tagText, { color: theme.colors.textSecondary }]}
            >
              {tag}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
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
});
