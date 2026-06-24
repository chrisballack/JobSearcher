// src/presentation/components/FilterBar.tsx
//
//  FilterBar.tsx
//  JobSearcher
//
//  Created by Christians Bonilla on 25/06/2026.
//  Copyright © 2026 JobSearcher. All rights reserved.
//

import { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Animated,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";

// ============================================================================
// Types
// ============================================================================
export interface Category {
  id: number;
  name: string;
}

export interface JobType {
  id: string;
  name: string;
}

export interface FilterState {
  search: string;
  categoryId: number | null;
  jobType: string | null;
}

interface FilterBarProps {
  visible: boolean;
  categories: Category[];
  jobTypes: JobType[];
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  onApply: () => void;
}

// ============================================================================
// Predefined job types (Remotive API)
// ============================================================================
const DEFAULT_JOB_TYPES: JobType[] = [
  { id: "full_time", name: "Full Time" },
  { id: "part_time", name: "Part Time" },
  { id: "contract", name: "Contract" },
  { id: "freelance", name: "Freelance" },
  { id: "internship", name: "Internship" },
];

// ============================================================================
// Component
// ============================================================================
export default function FilterBar({
  visible,
  categories,
  jobTypes,
  filters,
  onFiltersChange,
  onApply,
}: FilterBarProps) {
  const { t } = useTranslation();

  const [localSearch, setLocalSearch] = useState(filters.search);
  const [localCategory, setLocalCategory] = useState<number | null>(
    filters.categoryId,
  );
  const [localJobType, setLocalJobType] = useState<string | null>(
    filters.jobType,
  );

  const translateY = useRef(new Animated.Value(-100)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(translateY, {
          toValue: 0,
          friction: 10,
          tension: 80,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: -100,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  useEffect(() => {
    onFiltersChange({
      search: localSearch,
      categoryId: localCategory,
      jobType: localJobType,
    });
  }, [localSearch, localCategory, localJobType]);

  const clearAll = () => {
    setLocalSearch("");
    setLocalCategory(null);
    setLocalJobType(null);
  };

  const hasActiveFilters = localSearch || localCategory || localJobType;

  if (!visible) return null;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity,
          transform: [{ translateY }],
        },
      ]}
    >
      {/* ===== SEARCH BAR ===== */}
      <View style={styles.searchContainer}>
        <Ionicons
          name="search-outline"
          size={20}
          color="#8e8e93"
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder={t("jobs.filters.searchPlaceholder")}
          placeholderTextColor="#8e8e93"
          value={localSearch}
          onChangeText={setLocalSearch}
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="search"
        />
        {localSearch.length > 0 && (
          <TouchableOpacity
            onPress={() => setLocalSearch("")}
            style={styles.clearButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="close-circle" size={20} color="#8e8e93" />
          </TouchableOpacity>
        )}
      </View>

      {/* ===== SECTION 1: CATEGORY ===== */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Ionicons name="folder" size={16} color="#6200ee" />
          <Text style={styles.sectionTitle}>{t("jobs.filters.category")}</Text>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipsContainer}
        >
          <TouchableOpacity
            style={[styles.chip, !localCategory && styles.chipActive]}
            onPress={() => setLocalCategory(null)}
          >
            <Text
              style={[styles.chipText, !localCategory && styles.chipTextActive]}
            >
              {t("jobs.filters.allCategories")}
            </Text>
          </TouchableOpacity>

          {categories.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.chip,
                localCategory === category.id && styles.chipActive,
              ]}
              onPress={() =>
                setLocalCategory(
                  localCategory === category.id ? null : category.id,
                )
              }
            >
              <Text
                style={[
                  styles.chipText,
                  localCategory === category.id && styles.chipTextActive,
                ]}
                numberOfLines={1}
              >
                {category.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* ===== SECTION 2: JOB TYPE ===== */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Ionicons name="time" size={16} color="#6200ee" />
          <Text style={styles.sectionTitle}>{t("jobs.filters.jobType")}</Text>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipsContainer}
        >
          <TouchableOpacity
            style={[styles.chip, !localJobType && styles.chipActive]}
            onPress={() => setLocalJobType(null)}
          >
            <Text
              style={[styles.chipText, !localJobType && styles.chipTextActive]}
            >
              {t("jobs.filters.allTypes")}
            </Text>
          </TouchableOpacity>

          {DEFAULT_JOB_TYPES.map((type) => (
            <TouchableOpacity
              key={type.id}
              style={[
                styles.chip,
                localJobType === type.id && styles.chipActive,
              ]}
              onPress={() =>
                setLocalJobType(localJobType === type.id ? null : type.id)
              }
            >
              <Text
                style={[
                  styles.chipText,
                  localJobType === type.id && styles.chipTextActive,
                ]}
                numberOfLines={1}
              >
                {t(`jobs.types.${type.id}`, type.name)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* ===== BOTTOM BAR ===== */}
      <View style={styles.bottomBar}>
        <View style={styles.bottomActions}>
          {hasActiveFilters && (
            <TouchableOpacity
              onPress={clearAll}
              style={styles.clearAllButton}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="close-outline" size={18} color="#6200ee" />
              <Text style={styles.clearAllText}>
                {t("jobs.filters.clearFilters")}
              </Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity style={styles.applyButton} onPress={onApply}>
            <Text style={styles.applyButtonText}>
              {t("jobs.filters.applyFilters")}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Animated.View>
  );
}

// ============================================================================
// Styles
// ============================================================================
const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e5ea",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 5,
    zIndex: 10,
  },

  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f2f2f7",
    borderRadius: 12,
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 16,
    paddingHorizontal: 12,
    height: 44,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: "#000",
    paddingVertical: 8,
  },
  clearButton: {
    padding: 4,
  },

  section: {
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 10,
    gap: 6,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1c1c1e",
  },

  chipsContainer: {
    paddingHorizontal: 16,
    gap: 8,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: "#f2f2f7",
    borderWidth: 1,
    borderColor: "#e5e5ea",
    marginRight: 8,
  },
  chipActive: {
    backgroundColor: "#6200ee",
    borderColor: "#6200ee",
  },
  chipText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#6200ee",
  },
  chipTextActive: {
    color: "#fff",
  },

  bottomBar: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "#f2f2f7",
    backgroundColor: "#fafafa",
  },
  bottomActions: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 12,
  },
  clearAllButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  clearAllText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6200ee",
  },
  applyButton: {
    backgroundColor: "#6200ee",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 10,
    shadowColor: "#6200ee",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  applyButtonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
  },
});
