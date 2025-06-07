import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";

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
        <TouchableOpacity onPress={onBackPress} style={styles.backButton}>
          <Image
            source={icons.back}
            resizeMode="contain"
            style={[
              styles.backIcon,
              {
                tintColor: COLORS.greyscale900,
              },
            ]}
          />
        </TouchableOpacity>
        <Text
          style={[
            styles.headerTitle,
            {
              color: COLORS.greyscale900,
            },
          ]}
        >
          {title}
        </Text>
      </View>
      <TouchableOpacity onPress={onSearchPress} style={styles.searchButton}>
        <Image
          source={icons.search3}
          resizeMode="contain"
          style={[
            styles.searchIcon,
            {
              tintColor: COLORS.greyscale900,
            },
          ]}
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
    paddingVertical: 16,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  backButton: {
    borderRadius: 20,
    padding: 8,
  },
  backIcon: {
    height: 24,
    width: 24,
    tintColor: COLORS.black,
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: "bold",
    color: COLORS.black,
    marginLeft: 8,
  },
  searchButton: {
    borderRadius: 20,
    padding: 8,
  },
  searchIcon: {
    width: 24,
    height: 24,
    tintColor: COLORS.black,
  },
});

export default LearningHeader;
