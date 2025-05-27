import React from "react";
import {
  View,
  Image,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

import { icons, COLORS } from "@/constants";
import ConditionalComponent from "@/components/ConditionalComponent";

interface LearningSearchBarProps {
  searchQuery: string;
  onChangeText: (text: string) => void;
  onCancel: () => void;
  dark: boolean;
}

const LearningSearchBar: React.FC<LearningSearchBarProps> = ({
  searchQuery,
  onChangeText,
  onCancel,
  dark,
}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onCancel} style={styles.backButton}>
        <Image
          source={icons.back}
          resizeMode="contain"
          style={[
            styles.backIcon,
            {
              tintColor: dark ? COLORS.white : COLORS.greyscale900,
            },
          ]}
        />
      </TouchableOpacity>

      <View style={styles.searchInputContainer}>
        <View
          style={[
            styles.searchBar,
            {
              backgroundColor: dark ? COLORS.greyScale800 : COLORS.grayscale100,
              borderColor: dark ? COLORS.dark3 : "transparent",
              borderWidth: dark ? 1 : 0,
            },
          ]}
        >
          <Image
            source={icons.search3}
            style={[
              styles.searchIcon,
              {
                tintColor: dark ? COLORS.greyscale500 : COLORS.greyscale600,
              },
            ]}
            resizeMode="contain"
          />

          <TextInput
            style={[
              styles.searchInput,
              {
                color: dark ? COLORS.white : COLORS.greyscale900,
              },
            ]}
            value={searchQuery}
            onChangeText={onChangeText}
            placeholder="Rechercher des leçons..."
            placeholderTextColor={
              dark ? COLORS.greyscale500 : COLORS.greyscale600
            }
            autoFocus
          />

          <ConditionalComponent isValid={searchQuery.length > 0}>
            <TouchableOpacity
              style={styles.clearButton}
              onPress={() => onChangeText("")}
            >
              <Image
                source={icons.clear}
                style={[
                  styles.clearIcon,
                  {
                    tintColor: dark ? COLORS.greyscale500 : COLORS.greyscale600,
                  },
                ]}
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
    paddingVertical: 10,
  },
  backButton: {
    marginRight: 12,
    borderRadius: 20,
    padding: 8,
  },
  backIcon: {
    width: 24,
    height: 24,
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
  },
  searchIcon: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: "100%",
    fontSize: 16,
    fontFamily: "regular",
  },
  clearButton: {
    padding: 6,
  },
  clearIcon: {
    width: 18,
    height: 18,
  },
});

export default LearningSearchBar;
