// components/profile/GradesSection.tsx
import React, { useState, useCallback } from "react";
import { Feather, Ionicons } from "@expo/vector-icons";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";

import { COLORS } from "@/constants";

interface GradeItem {
  id: number;
  subject: string;
  grade: number;
  evaluation: string;
}

interface GradesSectionProps {
  grades: GradeItem[];
}

const GradesSection: React.FC<GradesSectionProps> = ({ grades }) => {
  const [filteredGrades, setFilteredGrades] = useState<GradeItem[]>(grades);
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc" | null>(null);
  const [showSortOptions, setShowSortOptions] = useState(false);

  // Calculate average grade
  const averageGrade = React.useMemo(() => {
    if (filteredGrades.length === 0) return 0;
    const sum = filteredGrades.reduce((acc, grade) => acc + grade.grade, 0);
    return Math.round((sum / filteredGrades.length) * 10) / 10;
  }, [filteredGrades]);

  // Handle filter change
  const handleFilterChange = useCallback(
    (filterId: string) => {
      setActiveFilter(filterId);

      if (filterId === "all") {
        setFilteredGrades(grades);
      } else {
        setFilteredGrades(grades.filter((grade) => grade.subject === filterId));
      }
    },
    [grades]
  );

  // Handle sort change
  const handleSort = useCallback((order: "asc" | "desc") => {
    setSortOrder(order);
    setShowSortOptions(false);

    setFilteredGrades((prevGrades) =>
      [...prevGrades].sort((a, b) => {
        return order === "asc" ? a.grade - b.grade : b.grade - a.grade;
      })
    );
  }, []);

  // Toggle sort options panel
  const toggleSortOptions = useCallback(() => {
    setShowSortOptions((prev) => !prev);
  }, []);

  // Get color based on grade value
  const getGradeColor = useCallback((grade: number) => {
    if (grade >= 16) return "#4CAF50"; // Green for excellent grades
    if (grade >= 14) return "#8BC34A"; // Light green for good grades
    if (grade >= 12) return "#FFC107"; // Yellow for average grades
    if (grade >= 10) return "#FF9800"; // Orange for pass grades
    return "#F44336"; // Red for fail grades
  }, []);

  // Render the header section
  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <View>
        <Text style={[styles.sectionTitle, { color: COLORS.black }]}>
          Notes et Évaluations
        </Text>
        <Text style={[styles.sectionSubtitle, { color: "rgba(0,0,0,0.6)" }]}>
          Suivez vos résultats académiques
        </Text>
      </View>

      {filteredGrades.length > 0 && (
        <View style={styles.averageContainer}>
          <View
            style={[
              styles.averageBadge,
              { backgroundColor: getGradeColor(averageGrade) },
            ]}
          >
            <Text style={styles.averageText}>{averageGrade.toFixed(1)}</Text>
            <Text style={styles.averageLabel}>Moyenne</Text>
          </View>
        </View>
      )}
    </View>
  );

  // Render filters section
  const renderFilters = () => {
    const filters = [
      { id: "all", label: "Toutes", icon: "grid-outline" },
      { id: "Mathématiques", label: "Maths", icon: "calculator-outline" },
      { id: "Physique", label: "Physique", icon: "flask-outline" },
      { id: "Français", label: "Français", icon: "book-outline" },
    ];

    return (
      <View style={styles.filtersContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersScrollContent}
        >
          {filters.map((filter) => {
            const isActive = activeFilter === filter.id;
            return (
              <TouchableOpacity
                key={filter.id}
                style={[
                  styles.filterChip,
                  {
                    backgroundColor: isActive
                      ? COLORS.primary
                      : "rgba(0,0,0,0.05)",
                  },
                ]}
                onPress={() => handleFilterChange(filter.id)}
              >
                <Ionicons
                  name={filter.icon as any}
                  size={14}
                  color={isActive ? COLORS.white : COLORS.black}
                  style={styles.filterIcon}
                />
                <Text
                  style={[
                    styles.filterChipText,
                    {
                      color: isActive ? COLORS.white : COLORS.black,
                    },
                  ]}
                >
                  {filter.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
    );
  };

  // Render table header
  const renderTableHeader = () => (
    <View
      style={[
        styles.tableHeader,
        {
          backgroundColor: "rgba(0,0,0,0.05)",
        },
      ]}
    >
      <Text
        style={[
          styles.headerText,
          styles.subjectHeader,
          { color: COLORS.black },
        ]}
      >
        Matière
      </Text>
      <Text
        style={[styles.headerText, styles.gradeHeader, { color: COLORS.black }]}
      >
        Note
      </Text>
      <Text
        style={[
          styles.headerText,
          styles.evaluationHeader,
          { color: COLORS.black },
        ]}
      >
        Évaluation
      </Text>
    </View>
  );

  // Render individual grade item
  const renderGradeItem = ({ item }: { item: GradeItem }) => {
    const gradeColor = getGradeColor(item.grade);

    return (
      <View
        style={[styles.gradeItemContainer, { backgroundColor: COLORS.white }]}
      >
        <View style={styles.subjectContainer}>
          <View
            style={[
              styles.subjectIcon,
              { backgroundColor: `${gradeColor}20` }, // 20% opacity version of grade color
            ]}
          >
            <Ionicons
              name={
                item.subject === "Mathématiques"
                  ? "calculator-outline"
                  : item.subject === "Physique"
                    ? "flask-outline"
                    : "book-outline"
              }
              size={16}
              color={gradeColor}
            />
          </View>
          <Text style={[styles.subjectText, { color: COLORS.black }]}>
            {item.subject}
          </Text>
        </View>

        <View style={styles.gradeContainer}>
          <View
            style={[
              styles.gradeBadge,
              { backgroundColor: `${gradeColor}15` }, // 15% opacity version of grade color
            ]}
          >
            <Text style={[styles.gradeText, { color: gradeColor }]}>
              {item.grade}/20
            </Text>
          </View>
        </View>

        <View style={styles.evaluationContainer}>
          <View
            style={[
              styles.evaluationBadge,
              { backgroundColor: `${gradeColor}10` }, // 10% opacity version of grade color
            ]}
          >
            <Text style={[styles.evaluationText, { color: gradeColor }]}>
              {item.evaluation}
            </Text>
          </View>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${(item.grade / 20) * 100}%`,
                  backgroundColor: gradeColor,
                },
              ]}
            />
          </View>
        </View>
      </View>
    );
  };

  // Render empty state
  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Feather name="file-text" size={40} color="rgba(0,0,0,0.2)" />
      <Text style={[styles.emptyText, { color: "rgba(0,0,0,0.5)" }]}>
        Aucune note disponible
      </Text>
      <Text style={[styles.emptySubtext, { color: "rgba(0,0,0,0.3)" }]}>
        Essayez un autre filtre pour voir plus de résultats
      </Text>
    </View>
  );

  return (
    <View style={styles.outerContainer}>
      <View style={[styles.container, { backgroundColor: COLORS.white }]}>
        {/* Top accent bar */}
        <View style={styles.accentBar} />

        {/* Main content */}
        <View style={styles.contentContainer}>
          {renderHeader()}
          {renderFilters()}

          {filteredGrades.length > 0 && renderTableHeader()}

          {filteredGrades.length > 0 ? (
            <FlatList
              data={filteredGrades}
              renderItem={renderGradeItem}
              keyExtractor={(item) => item.id.toString()}
              scrollEnabled={false}
              contentContainerStyle={styles.gradesListContainer}
              ItemSeparatorComponent={() => (
                <View
                  style={[
                    styles.separator,
                    {
                      backgroundColor: "rgba(0,0,0,0.05)",
                    },
                  ]}
                />
              )}
            />
          ) : (
            renderEmptyState()
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    marginBottom: 24,
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },
  container: {
    borderRadius: 16,
    overflow: "hidden",
  },
  accentBar: {
    height: 4,
    backgroundColor: COLORS.primary,
    width: "100%",
  },
  contentContainer: {
    padding: 16,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: "bold",
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    fontFamily: "regular",
  },
  averageContainer: {
    alignItems: "flex-end",
  },
  averageBadge: {
    borderRadius: 12,
    paddingVertical: 6,
    paddingHorizontal: 8,
    alignItems: "center",
    minWidth: 50,
  },
  averageText: {
    fontSize: 16,
    fontFamily: "bold",
    color: "#FFFFFF",
  },
  averageLabel: {
    fontSize: 9,
    fontFamily: "medium",
    color: "#FFFFFF",
    opacity: 0.9,
  },
  filtersContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  filtersScrollContent: {
    flexGrow: 1,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  filterIcon: {
    marginRight: 6,
  },
  filterChipText: {
    fontSize: 12,
    fontFamily: "medium",
  },

  tableHeader: {
    flexDirection: "row",
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  headerText: {
    fontSize: 13,
    fontFamily: "semiBold",
  },
  subjectHeader: {
    flex: 3,
  },
  gradeHeader: {
    flex: 1,
    textAlign: "center",
  },
  evaluationHeader: {
    flex: 2,
    textAlign: "right",
  },
  gradesListContainer: {
    paddingTop: 4,
  },
  gradeItemContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginVertical: 4,
  },
  subjectContainer: {
    flex: 3,
    flexDirection: "row",
    alignItems: "center",
  },
  subjectIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  subjectText: {
    fontSize: 14,
    fontFamily: "semiBold",
  },
  gradeContainer: {
    flex: 1,
    alignItems: "center",
  },
  gradeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  gradeText: {
    fontSize: 13,
    fontFamily: "bold",
  },
  evaluationContainer: {
    flex: 2,
    alignItems: "flex-end",
  },
  evaluationBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 6,
  },
  evaluationText: {
    fontSize: 12,
    fontFamily: "medium",
  },
  progressBar: {
    height: 4,
    width: "100%",
    backgroundColor: "rgba(0,0,0,0.05)",
    borderRadius: 2,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 2,
  },
  separator: {
    height: 1,
    marginVertical: 4,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
  },
  emptyText: {
    fontSize: 16,
    fontFamily: "semiBold",
    marginTop: 16,
    marginBottom: 4,
  },
  emptySubtext: {
    fontSize: 13,
    fontFamily: "regular",
    textAlign: "center",
  },
});

export default GradesSection;
