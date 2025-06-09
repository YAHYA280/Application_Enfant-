import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
} from "react-native";

import { COLORS } from "@/constants";

import { getNotificationCounts } from "./NotificationData";

type TabKey = "all" | "unread" | "read" | "favorite" | "archive";

interface NotificationTabsProps {
  activeTab: TabKey;
  onTabChange: (tab: TabKey) => void;
}

const NotificationTabs: React.FC<NotificationTabsProps> = ({
  activeTab,
  onTabChange,
}) => {
  // Get counts from our data
  const counts = getNotificationCounts();

  const tabs: { key: TabKey; label: string }[] = [
    { key: "all", label: "Tous" },
    { key: "unread", label: "Non lu" },
    { key: "read", label: "Lu" },
    { key: "favorite", label: "Favoris" },
    { key: "archive", label: "Archivé" },
  ];

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.tabsContainer}
        style={styles.scrollView}
      >
        {tabs.map((tab, index) => {
          const isActive = activeTab === tab.key;
          const count = counts[tab.key];

          return (
            <TouchableOpacity
              key={tab.key}
              onPress={() => onTabChange(tab.key)}
              style={[
                styles.tabButton,
                isActive
                  ? [
                      styles.activeTabButton,
                      { backgroundColor: COLORS.primary },
                    ]
                  : [
                      styles.inactiveTabButton,
                      {
                        backgroundColor: COLORS.greyscale100,
                        borderColor: COLORS.greyscale300,
                      },
                    ],
                // Add margin for spacing instead of gap (better compatibility)
                index > 0 && styles.tabMargin,
              ]}
            >
              <Text
                style={[
                  styles.tabLabel,
                  {
                    color: isActive ? COLORS.white : COLORS.greyscale900,
                  },
                ]}
              >
                {tab.label}
              </Text>

              {count > 0 && (
                <View
                  style={[
                    styles.countBadge,
                    {
                      backgroundColor: isActive
                        ? "rgba(255,255,255,0.3)"
                        : COLORS.gray,
                    },
                  ]}
                >
                  <Text style={styles.countText}>
                    {count > 99 ? "99+" : count}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.greyscale300,
  },
  scrollView: {
    flexGrow: 0,
  },
  tabsContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    alignItems: "center",
  },
  tabButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Platform.OS === "android" ? 8 : 6,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    minHeight: 36, // Ensure minimum touch target
    minWidth: 60, // Minimum width for better layout
  },
  tabMargin: {
    marginLeft: 8, // Replace gap with margin for better compatibility
  },
  activeTabButton: {
    borderColor: COLORS.primary,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3, // Android shadow
  },
  inactiveTabButton: {
    borderColor: COLORS.greyscale300,
  },
  tabLabel: {
    fontSize: Platform.OS === "android" ? 13 : 12,
    fontFamily: "medium",
    marginRight: 6,
    textAlign: "center",
  },
  countBadge: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 6,
  },
  countText: {
    fontSize: Platform.OS === "android" ? 11 : 10,
    fontFamily: "medium",
    color: COLORS.white,
    textAlign: "center",
  },
});

export default NotificationTabs;
