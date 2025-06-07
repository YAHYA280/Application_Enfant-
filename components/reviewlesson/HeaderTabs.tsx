import React from "react";
import { Feather } from "@expo/vector-icons";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

import { COLORS } from "@/constants";

type Tab = "video" | "materials";

interface HeaderTabsProps {
  selectedTab: Tab;
  setSelectedTab: (tab: Tab) => void;
}

const HeaderTabs: React.FC<HeaderTabsProps> = ({
  selectedTab,
  setSelectedTab,
}) => {
  return (
    <View style={[styles.tabContainer, { backgroundColor: "#F5F5F5" }]}>
      <TouchableOpacity
        style={[
          styles.tabButton,
          selectedTab === "video" && styles.activeTabButton,
          selectedTab === "video" && {
            backgroundColor: "#FFFFFF",
          },
        ]}
        onPress={() => setSelectedTab("video")}
      >
        <Feather
          name="video"
          size={20}
          color={selectedTab === "video" ? COLORS.primary : COLORS.greyScale800}
        />
        <Text
          style={[
            styles.tabText,
            selectedTab === "video" && styles.activeTabText,
            {
              color:
                selectedTab === "video" ? COLORS.primary : COLORS.greyScale800,
            },
          ]}
        >
          Vidéo de cours
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.tabButton,
          selectedTab === "materials" && styles.activeTabButton,
          selectedTab === "materials" && {
            backgroundColor: "#FFFFFF",
          },
        ]}
        onPress={() => setSelectedTab("materials")}
      >
        <Feather
          name="file-text"
          size={20}
          color={
            selectedTab === "materials" ? COLORS.primary : COLORS.greyScale800
          }
        />
        <Text
          style={[
            styles.tabText,
            selectedTab === "materials" && styles.activeTabText,
            {
              color:
                selectedTab === "materials"
                  ? COLORS.primary
                  : COLORS.greyScale800,
            },
          ]}
        >
          Supports de cours
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: "row",
    marginBottom: 20,
    borderRadius: 10,
    padding: 4,
    marginTop: 10,
  },
  tabButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 8,
  },
  activeTabButton: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  tabText: {
    fontSize: 14,
    fontFamily: "medium",
    marginLeft: 8,
  },
  activeTabText: {
    color: COLORS.primary,
    fontFamily: "bold",
  },
});

export default HeaderTabs;
