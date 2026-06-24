import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "expo-router";
import { useTranslation } from "react-i18next";
import FilterBar, {
  FilterState,
  Category,
  JobType,
} from "@/presentation/components/FilterBar";

const MOCK_CATEGORIES: Category[] = [
  { id: 1, name: "Software Dev" },
  { id: 2, name: "Design" },
  { id: 3, name: "Marketing" },
];

const JOB_TYPES: JobType[] = [
  { id: "full_time", name: "Full Time" },
  { id: "part_time", name: "Part Time" },
  { id: "contract", name: "Contract" },
];

export default function JobsScreen() {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    categoryId: null,
    jobType: null,
  });

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={() => setShowFilters((prev) => !prev)}
          style={styles.filterButton}
          hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
        >
          <Ionicons
            name={showFilters ? "options" : "options-outline"}
            size={24}
            color={showFilters ? "#6200ee" : "#000"}
          />
        </TouchableOpacity>
      ),
    });
  }, [navigation, showFilters]);

  const handleApplyFilters = () => {
    console.log("Filtros aplicados:", filters);
    setShowFilters(false);
  };

  const getJobTypeName = (jobTypeId: string | null): string => {
    if (!jobTypeId) return "";
    return t(`jobs.types.${jobTypeId}`, jobTypeId);
  };

  const getCategoryName = (categoryId: number | null): string => {
    if (!categoryId) return "";
    const category = MOCK_CATEGORIES.find((c) => c.id === categoryId);
    return category?.name || "";
  };

  return (
    <View style={styles.container}>
      <FilterBar
        visible={showFilters}
        categories={MOCK_CATEGORIES}
        jobTypes={JOB_TYPES}
        filters={filters}
        onFiltersChange={setFilters}
        onApply={handleApplyFilters}
      />

      <ScrollView contentContainerStyle={styles.content}>
        {(filters.search || filters.categoryId || filters.jobType) && (
          <View style={styles.activeFiltersSummary}>
            <Ionicons name="funnel" size={16} color="#6200ee" />
            <Text style={styles.activeFiltersText}>
              {filters.search && `"${filters.search}" `}
              {filters.categoryId &&
                `• ${getCategoryName(filters.categoryId)} `}
              {filters.jobType && `• ${getJobTypeName(filters.jobType)}`}
            </Text>
          </View>
        )}

        <View style={styles.emptyState}>
          <Ionicons name="briefcase-outline" size={64} color="#d1d1d6" />
          <Text style={styles.emptyTitle}>{t("jobs.empty.title")}</Text>
          <Text style={styles.emptySubtitle}>
            {showFilters
              ? t("jobs.empty.subtitleActive")
              : t("jobs.empty.subtitle")}
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  filterButton: { marginRight: 16, padding: 4 },
  content: { flexGrow: 1 },
  activeFiltersSummary: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f3f0ff",
    marginHorizontal: 16,
    marginTop: 12,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
    gap: 8,
  },
  activeFiltersText: {
    fontSize: 13,
    color: "#6200ee",
    fontWeight: "600",
    flex: 1,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#1c1c1e",
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 15,
    color: "#8e8e93",
    textAlign: "center",
    lineHeight: 22,
  },
});
