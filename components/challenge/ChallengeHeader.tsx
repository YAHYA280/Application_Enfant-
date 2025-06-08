import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { icons, COLORS } from "@/constants";

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
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.headerContainer,
        {
          paddingTop:
            Platform.OS === "ios"
              ? insets.top + 8
              : Math.max(insets.top + 8, 32),
        },
        transparent ? styles.transparentHeader : styles.solidHeader,
      ]}
    >
      <View style={styles.headerContent}>
        <TouchableOpacity
          onPress={onBackPress}
          style={[styles.backButton, transparent && styles.transparentButton]}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
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
              style={[styles.backIcon, { tintColor: COLORS.greyscale900 }]}
            />
          )}
        </TouchableOpacity>

        <View style={styles.titleContainer}>
          <Text
            style={[
              styles.headerTitle,
              transparent
                ? styles.transparentTitle
                : { color: COLORS.greyscale900 },
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
                  : { color: COLORS.greyscale600 },
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
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
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
                color={COLORS.greyscale900}
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
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    paddingBottom: 12,
    paddingHorizontal: 16,
    zIndex: 1000,
    // Ensure proper elevation on Android
    elevation: Platform.OS === "android" ? 10 : 0,
  },
  solidHeader: {
    backgroundColor: COLORS.white,
    borderBottomColor: COLORS.greyscale300,
    borderBottomWidth: 1,
    // iOS shadow
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
  },
  transparentHeader: {
    backgroundColor: "transparent",
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 44, // Ensure consistent height
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: "transparent",
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
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: "bold",
    lineHeight: 24,
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
    lineHeight: 16,
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
    backgroundColor: "transparent",
  },
});

export default ChallengeHeader;
