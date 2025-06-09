import React from "react";
import { Feather } from "@expo/vector-icons";
import {
  View,
  Image,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Dimensions,
} from "react-native";

import { icons } from "@/constants";
import { COLORS } from "@/constants";

import ConditionalComponent from "@/components/ConditionalComponent";

interface NotificationSearchProps {
  value: string;
  onChangeText: (text: string) => void;
}

const { width: screenWidth } = Dimensions.get("window");

const NotificationSearch: React.FC<NotificationSearchProps> = ({
  value,
  onChangeText,
}) => {
  // Calculate responsive padding and sizing
  const getResponsiveValues = () => {
    if (screenWidth < 350) {
      return {
        containerPadding: 12,
        inputHeight: 44,
        fontSize: 14,
        iconSize: 18,
      };
    }
    if (screenWidth < 400) {
      return {
        containerPadding: 14,
        inputHeight: 46,
        fontSize: 15,
        iconSize: 19,
      };
    }
    return {
      containerPadding: 16,
      inputHeight: 48,
      fontSize: 16,
      iconSize: 20,
    };
  };

  const responsive = getResponsiveValues();

  // Create platform-specific props for TextInput
  const getTextInputProps = () => {
    const baseProps = {
      style: [
        styles.searchInput,
        {
          color: COLORS.greyscale900,
          fontSize: responsive.fontSize,
        },
      ],
      value,
      onChangeText,
      placeholder: "Rechercher dans les notifications",
      placeholderTextColor: COLORS.greyscale600,
      autoCorrect: false,
      autoCapitalize: "none" as const,
      returnKeyType: "search" as const,
      clearButtonMode:
        Platform.OS === "ios" ? ("while-editing" as const) : ("never" as const),
    };

    // Add Android-specific props
    if (Platform.OS === "android") {
      return {
        ...baseProps,
        underlineColorAndroid: "transparent",
        textAlignVertical: "center" as const,
        includeFontPadding: false,
      };
    }

    return baseProps;
  };

  return (
    <View
      style={[
        styles.searchContainer,
        { paddingHorizontal: responsive.containerPadding },
      ]}
    >
      <View
        style={[
          styles.searchInputContainer,
          {
            backgroundColor: COLORS.greyscale100,
            borderColor: COLORS.greyscale300,
            height: responsive.inputHeight,
          },
        ]}
      >
        <Feather
          name="search"
          size={responsive.iconSize}
          color={COLORS.greyscale600}
          style={styles.searchIcon}
        />

        <TextInput
          {...getTextInputProps()}
          accessibilityLabel="Rechercher dans les notifications"
          accessibilityRole="search"
        />

        <ConditionalComponent isValid={value.length > 0}>
          <TouchableOpacity
            style={styles.clearButton}
            onPress={() => onChangeText("")}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            accessibilityLabel="Effacer la recherche"
            accessibilityRole="button"
          >
            <Image
              source={icons.clear}
              style={[
                styles.clearIcon,
                {
                  tintColor: COLORS.greyscale600,
                  width: responsive.iconSize,
                  height: responsive.iconSize,
                },
              ]}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </ConditionalComponent>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  searchContainer: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.greyscale300,
  },
  searchInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1, // Android shadow
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: "100%",
    fontFamily: "regular",
    paddingVertical: Platform.OS === "android" ? 0 : 8,
    paddingTop: Platform.OS === "android" ? 0 : undefined,
    paddingBottom: Platform.OS === "android" ? 0 : undefined,
  },
  clearButton: {
    padding: 8,
    marginRight: -4, // Compensate for padding
  },
  clearIcon: {
    opacity: 0.7,
  },
});

export default NotificationSearch;
