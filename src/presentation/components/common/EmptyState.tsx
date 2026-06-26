import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/core/theme";
import {
  spacing,
  fontSize,
  fontWeight,
  iconSize,
  borderRadius,
} from "@/core/design-system";

interface EmptyStateProps {
  icon: string;
  title: string;
  subtitle?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export default function EmptyState({
  icon,
  title,
  subtitle,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  const { theme } = useTheme();

  return (
    <View style={styles.container}>
      <Ionicons
        name={icon as any}
        size={iconSize["3xl"]}
        color={theme.colors.textTertiary}
      />
      <Text style={[styles.title, { color: theme.colors.text }]}>{title}</Text>
      {subtitle && (
        <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
          {subtitle}
        </Text>
      )}
      {actionLabel && onAction && (
        <TouchableOpacity
          style={[
            styles.actionButton,
            { backgroundColor: theme.colors.primary },
          ]}
          onPress={onAction}
        >
          <Text style={styles.actionButtonText}>{actionLabel}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: spacing["2xl"],
    minHeight: 300,
    gap: spacing.base,
  },
  title: {
    fontSize: fontSize["3xl"],
    fontWeight: fontWeight.bold,
    textAlign: "center",
  },
  subtitle: {
    fontSize: fontSize.md,
    textAlign: "center",
    lineHeight: 22,
    paddingHorizontal: spacing.lg,
  },
  actionButton: {
    marginTop: spacing.md,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
  },
  actionButtonText: {
    color: "#FFFFFF",
    fontSize: fontSize.base,
    fontWeight: fontWeight.bold,
  },
});
