import React from "react";
import {
  View,
  Text,
  Image,
  Platform,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

import { icons, COLORS } from "@/constants";

interface LearningHeaderProps {
  title: string;
  onBackPress: () => void;
  onSearchPress: () => void;
}

const LearningHeader: React.FC<LearningHeaderProps> = ({
  title,
  onBackPress,
  onSearchPress,
}) => {
  return (
    <View style={styles.headerContainer}>
      <View style={styles.headerLeft}>
        <TouchableOpacity
          onPress={onBackPress}
          style={styles.backButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Image
            source={icons.back}
            resizeMode="contain"
            style={styles.backIcon}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{title}</Text>
      </View>
      <TouchableOpacity
        onPress={onSearchPress}
        style={styles.searchButton}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Image
          source={icons.search3}
          resizeMode="contain"
          style={styles.searchIcon}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: Platform.OS === "ios" ? 16 : 12,
    minHeight: Platform.OS === "ios" ? 56 : 52,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  backButton: {
    borderRadius: 20,
    padding: 8,
  },
  backIcon: {
    height: 20,
    width: 20,
    tintColor: COLORS.greyscale900,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: "bold",
    color: COLORS.greyscale900,
    marginLeft: 8,
  },
  searchButton: {
    borderRadius: 20,
    padding: 8,
  },
  searchIcon: {
    width: 24,
    height: 24,
    tintColor: COLORS.greyscale900,
  },
});

export default LearningHeader;
