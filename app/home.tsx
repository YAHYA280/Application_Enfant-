import { Image } from "react-native";
import React, { useRef } from "react";
import { useNavigation } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { View, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Menu,
  MenuOption,
  MenuOptions,
  MenuTrigger,
} from "react-native-popup-menu";

import { COLORS, images } from "@/constants";
import { useTheme } from "@/theme/ThemeProvider";
import KidFriendlyMenu from "@/components/KidFriendlyMenu";
import AnimatedAvatar from "@/components/AnimatedAvatar";
import NotificationBell from "@/components/notifications/NotificationBell";

export default function Home() {
  const { navigate } = useNavigation<{ navigate: (screen: string) => void }>();
  const refRBSheet = useRef<{ open: () => void } | null>(null);
  const { colors } = useTheme();

  const handleNavigation = (link: string) => {
    navigate(link);
  };

  const renderHeader = () => (
    <View style={[styles.headerContainer, { backgroundColor: COLORS.white }]}>
      {/* Logo on the left */}
      <View style={styles.logoContainer}>
        <Image source={images.logo} style={styles.logoImage} />
      </View>

      {/* Profile and notification on the right */}
      <View style={styles.profileContainer}>
        <NotificationBell style={styles.notificationBell} />
        <Menu>
          <MenuTrigger>
            <Image source={images.user1} style={styles.profileImage} />
          </MenuTrigger>
          <MenuOptions
            customStyles={{
              optionsContainer: {
                ...styles.menuOptionsContainer,
                backgroundColor: COLORS.white,
              },
            }}
          >
            <MenuOption onSelect={() => navigate("profil")}>
              <View style={styles.menuItemHeader}>
                <MaterialIcons name="person" size={24} color={COLORS.black} />
                <Text style={[styles.menuTextHeader, { color: COLORS.black }]}>
                  Mon Profil
                </Text>
              </View>
            </MenuOption>
            <MenuOption onSelect={() => refRBSheet.current?.open()}>
              <View style={styles.menuItemHeader}>
                <MaterialIcons name="logout" size={24} color="red" />
                <Text style={[styles.menuTextHeader, { color: "red" }]}>
                  Déconnexion
                </Text>
              </View>
            </MenuOption>
          </MenuOptions>
        </Menu>
      </View>
    </View>
  );

  const renderGreeting = () => (
    <View style={styles.greetingContainer}>
      <Text style={[styles.greetingText, { color: COLORS.black }]}>
        Bienvenue Peter,
      </Text>

      {/* Animated avatar */}
      <AnimatedAvatar />

      <Text style={[styles.helpText, { color: COLORS.black }]}>
        Comment puis-je vous aider aujourd&apos;hui ?
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={[styles.area, { backgroundColor: colors.background }]}>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        {renderHeader()}

        {/* Main content area with centered greeting */}
        <View style={styles.contentArea}>{renderGreeting()}</View>

        {/* New Kid-Friendly Bottom Menu */}
        <KidFriendlyMenu onNavigate={handleNavigation} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  area: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 10,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#0002",
    padding: 2,
    paddingLeft: 15,
    paddingRight: 15,
  },
  logoContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  logoImage: {
    width: 48,
    height: 48,
    resizeMode: "contain",
  },
  profileContainer: {
    gap: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  notificationBell: {
    marginLeft: 12,
  },
  menuOptionsContainer: {
    backgroundColor: "#f9f9f9",
    padding: 10,
    borderRadius: 10,
    borderColor: "#ddd",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    marginTop: 55,
    marginLeft: 0,
  },
  menuItemHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
  },
  menuTextHeader: {
    fontSize: 16,
    marginLeft: 10,
    color: COLORS.black,
  },
  contentArea: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 120,
  },
  greetingContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  greetingText: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  helpText: {
    fontSize: 18,
    textAlign: "center",
    marginTop: 10,
  },
});
