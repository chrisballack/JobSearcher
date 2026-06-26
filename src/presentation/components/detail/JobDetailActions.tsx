import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
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

interface JobDetailActionsProps {
  onApply: () => void;
  onShare: () => void;
}

export default function JobDetailActions({
  onApply,
  onShare,
}: JobDetailActionsProps) {
  const { t } = useTranslation();
  const { theme } = useTheme();

  return (
    <View style={styles.actionsSection}>
      <TouchableOpacity
        style={[styles.actionButton, { backgroundColor: theme.colors.primary }]}
        onPress={onApply}
      >
        <Ionicons name="open-outline" size={iconSize.sm} color="#FFFFFF" />
        <Text style={styles.actionButtonText}>{t("jobDetail.apply")}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.actionButton, { backgroundColor: theme.colors.surface }]}
        onPress={onShare}
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
  );
}

const styles = StyleSheet.create({
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
});
