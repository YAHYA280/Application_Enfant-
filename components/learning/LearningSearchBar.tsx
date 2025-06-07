import React from "react";
import {
  View,
  Image,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from "react-native";

import { icons, COLORS } from "@/constants";
import ConditionalComponent from "@/components/ConditionalComponent";

interface LearningSearchBarProps {
  searchQuery: string;
  onChangeText: (text: string) => void;
  onCancel: () => void;
}

const LearningSearchBar: React.FC<LearningSearchBarProps> = ({
  searchQuery,
  onChangeText,
  onCancel,
}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={onCancel}
        style={styles.backButton}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Image
          source={icons.back}
          resizeMode="contain"
          style={styles.backIcon}
        />
      </TouchableOpacity>

      <View style={styles.searchInputContainer}>
        <View style={styles.searchBar}>
          <Image
            source={icons.search3}
            style={styles.searchIcon}
            resizeMode="contain"
          />

          <TextInput
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={onChangeText}
            placeholder="Rechercher des leçons..."
            placeholderTextColor={COLORS.greyscale600}
            autoFocus
          />

          <ConditionalComponent isValid={searchQuery.length > 0}>
            <TouchableOpacity
              style={styles.clearButton}
              onPress={() => onChangeText("")}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Image
                source={icons.clear}
                style={styles.clearIcon}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </ConditionalComponent>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: Platform.OS === "ios" ? 12 : 10,
    minHeight: Platform.OS === "ios" ? 60 : 56,
  },
  backButton: {
    marginRight: 12,
    borderRadius: 20,
    padding: 8,
  },
  backIcon: {
    width: 24,
    height: 24,
    tintColor: COLORS.greyscale900,
  },
  searchInputContainer: {
    flex: 1,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 16,
    paddingHorizontal: 12,
    height: 46,
    backgroundColor: COLORS.greyscale100,
    borderWidth: 0,
  },
  searchIcon: {
    width: 20,
    height: 20,
    marginRight: 10,
    tintColor: COLORS.greyscale600,
  },
  searchInput: {
    flex: 1,
    height: "100%",
    fontSize: 16,
    fontFamily: "regular",
    color: COLORS.greyscale900,
  },
  clearButton: {
    padding: 6,
  },
  clearIcon: {
    width: 18,
    height: 18,
    tintColor: COLORS.greyscale600,
  },
});

export default LearningSearchBar;
