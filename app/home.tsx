import React, { useRef } from "react";
import { useNavigation } from "expo-router";
import { COLORS, images } from "@/constants";
import { useTheme } from "@/theme/ThemeProvider";
import { MaterialIcons } from "@expo/vector-icons";
import NotificationBell from "@/components/NotificationBell";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Menu,
  MenuOption,
  MenuOptions,
  MenuTrigger,
} from "react-native-popup-menu";
import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from "react-native";

type Nav = {
  navigate: (value: string) => void;
};

const { width } = Dimensions.get("window");

const menuItems: {
  name: string;
  icon: "home" | "library-books" | "emoji-events" | "search";
  link: string;
}[] = [
  { name: "AI Accueil", icon: "home", link: "chatAiAcceuil" },
  { name: "J’apprends", icon: "library-books", link: "learning" },
  { name: "Challenge", icon: "emoji-events", link: "defi" },
  { name: "AI Recherche", icon: "search", link: "chatAiRecherche" },
];

// eslint-disable-next-line import/export
export default function Home() {
  const { navigate } = useNavigation<Nav>();
  const refRBSheet = useRef<any>(null);
  const { dark, colors } = useTheme();

  // Header with left (Menu trigger) and right (NotificationBell)
  const renderHeader = () => (
    <View style={[styles.headerContainer, { backgroundColor: dark ? COLORS.black : COLORS.white }]}>
      {/* Left side: Menu trigger (profile image with options) */}
      <View style={styles.viewLeft}>
        <Menu>
          <MenuTrigger>
            <Image source={images.user1} style={styles.profileImage} />
          </MenuTrigger>
          <MenuOptions
            customStyles={{
              optionsContainer: {
                ...styles.menuOptionsContainer,
                backgroundColor: dark ? COLORS.dark2 : COLORS.white,
              },
              optionText: styles.menuOptionText,
            }}
          >
            <MenuOption onSelect={() => navigate("profil")}>
              <View style={styles.menuItemHeader}>
                <MaterialIcons name="person" size={24} color={dark ? COLORS.white : COLORS.black} />
                <Text style={[styles.menuTextHeader, { color: dark ? COLORS.white : COLORS.black }]}>
                  Mon Profil
                </Text>
              </View>
            </MenuOption>
            <MenuOption onSelect={() => refRBSheet.current.open()}>
              <View style={styles.menuItemHeader}>
                <MaterialIcons name="logout" size={24} color="red" />
                <Text style={[styles.menuTextHeader, { color: "red" }]}>Déconnexion</Text>
              </View>
            </MenuOption>
          </MenuOptions>
          <MenuTrigger />
        </Menu>
      </View>
      {/* Right side: Only the NotificationBell, aligned to the far right */}
      <View style={styles.viewRight}>
        <NotificationBell style={styles.notificationBell} />
      </View>
    </View>
  );

  // ... (Render other parts of your component as before)

  const renderMenu = () => (
    <View style={styles.menuContainer}>
      <FlatList
        data={menuItems}
        horizontal
        keyExtractor={(_item, index) => index.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.menuItem, { backgroundColor: dark ? COLORS.black : COLORS.white }]}
            onPress={() => navigate(item.link)}
          >
            <View style={[styles.iconWrapper, { borderColor: COLORS.white, borderWidth: 2 }]}>
              <MaterialIcons name={item.icon} size={30} color={COLORS.black} />
            </View>
            <Text style={[styles.menuText, { color: dark ? COLORS.white : COLORS.black }]}>
              {item.name}
            </Text>
          </TouchableOpacity>
        )}
        showsHorizontalScrollIndicator={false}
        snapToInterval={width / 3}
        decelerationRate="fast"
        contentContainerStyle={styles.flatListContent}
        snapToAlignment="center"
        viewabilityConfig={{ itemVisiblePercentThreshold: 50 }}
      />
    </View>
  );

  // (Assume renderProfile and other components remain unchanged)

  return (
    <SafeAreaView style={[styles.area, { backgroundColor: colors.background }]}>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        {renderHeader()}
        {/* Your other component renderings */}
        <View style={styles.greetingContainer}>
          <Text style={[styles.greeting, { color: dark ? COLORS.white : COLORS.black }]}>
            {"Bienvenue Peter,\nComment puis-je vous aider aujourd'hui ?"}
          </Text>
        </View>
        {renderMenu()}
        {/* RBSheet and other content goes here */}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  area: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    marginBottom: 20,
    padding: 16,
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
  viewLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  viewRight: {
    flex: 1,
    alignItems: "flex-end",
  },
  profileImage: {
    width: 48,
    height: 48,
    borderRadius: 32,
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
  menuOptionText: {
    fontSize: 16,
    color: "#333",
    paddingVertical: 8,
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
  greetingContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 200,
    marginTop: 220,
  },
  greeting: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
  menuContainer: {
    bottom: 50,
    width,
    height: 215,
    alignItems: "center",
  },
  menuItem: {
    width: 107,
    height: 125,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    marginHorizontal: 7,
    backgroundColor: COLORS.white,
    paddingBottom: 4,
  },
  iconWrapper: {
    width: 60,
    height: 60,
    borderRadius: 45,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  menuText: {
    marginTop: 5,
    fontSize: 14,
    fontWeight: "bold",
    color: COLORS.black,
  },
  flatListContent: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },

});