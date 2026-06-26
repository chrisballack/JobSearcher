import { View, Text, StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/core/theme";
import { spacing, fontSize, fontWeight } from "@/core/design-system";
import { HtmlRenderer } from "@/core/utils/htmlRenderer";

interface JobDetailDescriptionProps {
  html: string;
}

export default function JobDetailDescription({
  html,
}: JobDetailDescriptionProps) {
  const { t } = useTranslation();
  const { theme } = useTheme();

  return (
    <View style={styles.descriptionSection}>
      <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
        {t("jobDetail.description")}
      </Text>
      <HtmlRenderer html={html} />
    </View>
  );
}

const styles = StyleSheet.create({
  descriptionSection: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.base,
  },
  sectionTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    marginBottom: spacing.md,
  },
});
