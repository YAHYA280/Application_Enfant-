import type { ViewStyle } from "react-native";

import React, { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Dimensions,
} from "react-native";

import { COLORS } from "@/constants";

import NotificationModal from "./NotificationModal";
import { getNotificationCounts } from "./NotificationData";

interface NotificationBellProps {
  style?: ViewStyle;
  iconSize?: number;
  iconColor?: string;
}

const { width: screenWidth } = Dimensions.get("window");

const NotificationBell: React.FC<NotificationBellProps> = ({
  style,
  iconSize = 24,
  iconColor = COLORS.greyscale900,
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  // Get the unread count from our notification data
  const unreadCount = getNotificationCounts().unread;

  // Scale badge size based on screen width for responsive design
  const getBadgeSize = () => {
    if (screenWidth < 350) return 18; // Small screens
    if (screenWidth < 400) return 20; // Medium screens
    return 22; // Large screens
  };

  const badgeSize = getBadgeSize();

  return (
    <>
      <TouchableOpacity
        style={[styles.bellContainer, style]}
        onPress={() => setIsModalVisible(true)}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} // Better touch area
        accessibilityLabel={`Notifications${unreadCount > 0 ? `, ${unreadCount} non lues` : ""}`}
        accessibilityRole="button"
      >
        <View style={styles.bellIconWrapper}>
          <Ionicons name="notifications" size={iconSize} color={iconColor} />

          {unreadCount > 0 && (
            <View
              style={[
                styles.badge,
                {
                  width: badgeSize,
                  height: badgeSize,
                  borderRadius: badgeSize / 2,
                  top: Platform.OS === "android" ? -6 : -8,
                  right: Platform.OS === "android" ? -6 : -8,
                },
              ]}
            >
              <Text
                style={[
                  styles.badgeText,
                  {
                    fontSize: badgeSize < 20 ? 10 : 11,
                  },
                ]}
              >
                {unreadCount > 99 ? "99+" : unreadCount}
              </Text>
            </View>
          )}
        </View>
      </TouchableOpacity>

      <NotificationModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
      />
    </>
  );
};

const styles = StyleSheet.create({
  bellContainer: {
    position: "relative",
    padding: Platform.OS === "android" ? 12 : 8,
    alignItems: "center",
    justifyContent: "center",
  },
  bellIconWrapper: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  badge: {
    position: "absolute",
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
    borderWidth: Platform.OS === "android" ? 1 : 2,
    borderColor: "white",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3, // Android shadow
  },
  badgeText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    includeFontPadding: false, // Android specific
    textAlignVertical: "center", // Android specific
  },
});

export default NotificationBell;
