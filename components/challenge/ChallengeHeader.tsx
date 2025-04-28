import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

import { COLORS, icons } from "@/constants";
import { useTheme } from "@/theme/ThemeProvider";

interface ChallengeHeaderProps {
  title: string;
  subtitle?: string;
  onBackPress: () => void;
  onInfoPress?: () => void;
  showInfo?: boolean;
  transparent?: boolean;
}

const ChallengeHeader: React.FC<ChallengeHeaderProps> = ({
  title,
  subtitle,
  onBackPress,
  onInfoPress,
  showInfo = false,
  transparent = false,
}) => {
  const { dark } = useTheme();

  return (
    <View
      style={[
        styles.headerContainer,
        transparent
          ? styles.transparentHeader
          : {
              backgroundColor: dark ? COLORS.dark1 : COLORS.white,
              borderBottomColor: dark ? COLORS.dark2 : COLORS.greyscale300,
              borderBottomWidth: 1,
            },
      ]}
    >
      <View style={styles.headerContent}>
        <TouchableOpacity
          onPress={onBackPress}
          style={[styles.backButton, transparent && styles.transparentButton]}
        >
          {transparent ? (
            <LinearGradient
              colors={["rgba(0,0,0,0.6)", "rgba(0,0,0,0.3)"]}
              style={styles.gradientButton}
            >
              <Image
                source={icons.back}
                resizeMode="contain"
                style={[styles.backIcon, { tintColor: COLORS.white }]}
              />
            </LinearGradient>
          ) : (
            <Image
              source={icons.back}
              resizeMode="contain"
              style={[
                styles.backIcon,
                { tintColor: dark ? COLORS.white : COLORS.greyscale900 },
              ]}
            />
          )}
        </TouchableOpacity>

        <View style={styles.titleContainer}>
          <Text
            style={[
              styles.headerTitle,
              transparent
                ? styles.transparentTitle
                : { color: dark ? COLORS.white : COLORS.greyscale900 },
            ]}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {title}
          </Text>

          {subtitle && (
            <Text
              style={[
                styles.headerSubtitle,
                transparent
                  ? styles.transparentSubtitle
                  : { color: dark ? COLORS.greyscale500 : COLORS.greyscale600 },
              ]}
              numberOfLines={1}
            >
              {subtitle}
            </Text>
          )}
        </View>

        {showInfo && (
          <TouchableOpacity
            onPress={onInfoPress}
            style={[styles.infoButton, transparent && styles.transparentButton]}
          >
            {transparent ? (
              <LinearGradient
                colors={["rgba(0,0,0,0.6)", "rgba(0,0,0,0.3)"]}
                style={styles.gradientButton}
              >
                <Ionicons
                  name="information-circle"
                  size={24}
                  color={COLORS.white}
                />
              </LinearGradient>
            ) : (
              <Ionicons
                name="information-circle"
                size={24}
                color={dark ? COLORS.white : COLORS.greyscale900}
              />
            )}
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    paddingTop: 44,
    paddingBottom: 12,
    paddingHorizontal: 16,
    zIndex: 10,
  },
  transparentHeader: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: "transparent",
    zIndex: 100,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
  },
  transparentButton: {
    backgroundColor: "transparent",
  },
  gradientButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  backIcon: {
    height: 24,
    width: 24,
  },
  titleContainer: {
    flex: 1,
    marginHorizontal: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: "bold",
  },
  transparentTitle: {
    color: COLORS.white,
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  headerSubtitle: {
    fontSize: 14,
    fontFamily: "medium",
    marginTop: 2,
  },
  transparentSubtitle: {
    color: "rgba(255, 255, 255, 0.8)",
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  infoButton: {
    padding: 8,
    borderRadius: 20,
  },
});

export default ChallengeHeader;
