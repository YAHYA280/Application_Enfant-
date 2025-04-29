// components/profile/ProfileHeader.tsx
import React from "react";
import { COLORS } from "@/constants";
import { Ionicons } from "@expo/vector-icons";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import NotificationBell from "@/components/notifications/NotificationBell";

interface ProfileHeaderProps {
  dark: boolean;
  onBackPress: () => void;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ dark, onBackPress }) => {
  return (
    <View style={styles.headerContainer}>
      <View style={styles.headerLeft}>
        <TouchableOpacity
          style={[
            styles.backButton,
            { backgroundColor: dark ? COLORS.dark3 : "rgba(0,0,0,0.05)" },
          ]}
          onPress={onBackPress}
        >
          <Ionicons
            name="chevron-back"
            size={24}
            color={dark ? COLORS.white : COLORS.black}
          />
        </TouchableOpacity>
        <Text
          style={[
            styles.headerTitle,
            { color: dark ? COLORS.white : COLORS.black },
          ]}
        >
          Mon Profil
        </Text>
      </View>
      <View style={styles.headerRight}>
        <NotificationBell style={styles.notificationBell} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.05)",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: "bold",
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  notificationBell: {
    marginLeft: 12,
  },
});

export default ProfileHeader;
