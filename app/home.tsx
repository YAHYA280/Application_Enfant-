import { scaleLinear } from "d3-scale";
import { useNavigation } from "expo-router";
import { COLORS, images } from "@/constants";
import React, { useRef, useState } from "react";
import { useTheme } from "@/theme/ThemeProvider";
import { MaterialIcons } from "@expo/vector-icons";
import CurvedMenuItem from "@/components/CurvedMenuItem";
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
  Animated,
  StyleSheet,
  Dimensions,
  PanResponder,
} from "react-native";

const { width } = Dimensions.get("window");
const MIN_ANGLE_OFFSET = -1.2;
const MAX_ANGLE_OFFSET = 1.65;

const menuItems: {
  name: string;
  icon: "home" | "library-books" | "emoji-events" | "search";
  link: string;
}[] = [
  { name: "AI Devoir", icon: "home", link: "chatAiAcceuil" },
  { name: "J'apprends", icon: "library-books", link: "learning" },
  { name: "Challenge", icon: "emoji-events", link: "defi" },
  { name: "AI Recherche", icon: "search", link: "chatAiRecherche" },
];

export default function Home() {
  const { navigate } = useNavigation<{ navigate: (screen: string) => void }>();
  const refRBSheet = useRef<{ open: () => void } | null>(null);
  const { dark, colors } = useTheme();

  // State to track active menu item
  const [activeMenuItem, setActiveMenuItem] = useState(0);

  const radius = 180;
  const [angleOffset, setAngleOffset] = useState(1.65);
  const angleScale = scaleLinear()
    .domain([0, menuItems.length - 1])
    .range([-Math.PI / 1.9, Math.PI / 2.5]);

  const getArcPosition = (index: number) => {
    const angle = angleScale(index) + angleOffset;
    const x = Math.sin(angle) * radius;
    const y = -Math.cos(angle) * radius + 450;
    return { x, y };
  };

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        const delta = gestureState.dx / 4600;
        setAngleOffset((prev) => {
          const next = prev + delta;
          return Math.max(MIN_ANGLE_OFFSET, Math.min(MAX_ANGLE_OFFSET, next));
        });
      },
    })
  ).current;

  const renderHeader = () => (
    <View
      style={[
        styles.headerContainer,
        { backgroundColor: dark ? COLORS.black : COLORS.white },
      ]}
    >
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
            }}
          >
            <MenuOption onSelect={() => navigate("profil")}>
              <View style={styles.menuItemHeader}>
                <MaterialIcons
                  name="person"
                  size={24}
                  color={dark ? COLORS.white : COLORS.black}
                />
                <Text
                  style={[
                    styles.menuTextHeader,
                    { color: dark ? COLORS.white : COLORS.black },
                  ]}
                >
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
      <View style={styles.viewRight}>
        <NotificationBell style={styles.notificationBell} />
      </View>
    </View>
  );

  const renderMenu = () => (
    <View style={styles.menuContainer} {...panResponder.panHandlers}>
      {menuItems.map((item, index) => {
        const { x, y } = getArcPosition(index);
        const isActive = index === activeMenuItem;

        return (
          <Animated.View
            key={index}
            style={{
              position: "absolute",
              left: width / 2 + x - 78,
              top: y,
              transform: [
                {
                  rotate: `${angleScale(index) * (180 / Math.PI) + angleOffset * (180 / Math.PI)}deg`,
                },
              ],
            }}
          >
            <CurvedMenuItem
              icon={
                <MaterialIcons
                  name={item.icon}
                  size={30}
                  color={COLORS.white}
                />
              }
              label={item.name}
              isActive={isActive}
              onPress={() => {
                setActiveMenuItem(index);
                navigate(item.link);
              }}
            />
          </Animated.View>
        );
      })}
    </View>
  );

  return (
    <SafeAreaView style={[styles.area, { backgroundColor: colors.background }]}>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        {renderHeader()}
        <View style={styles.greetingContainer}>
          <Text
            style={[
              styles.greeting,
              { color: dark ? COLORS.white : COLORS.black },
            ]}
          >
            Bienvenue Peter,{"\n"}Comment puis-je vous aider aujourd&apos;hui ?
          </Text>
        </View>
        {renderMenu()}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  area: { flex: 1 },
  container: { flex: 1, padding: 10 },
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
  viewLeft: { flexDirection: "row", alignItems: "center" },
  viewRight: { flex: 1, alignItems: "flex-end" },
  profileImage: { width: 48, height: 48, borderRadius: 32 },
  notificationBell: { marginLeft: 12 },
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
  menuItemHeader: { flexDirection: "row", alignItems: "center", padding: 10 },
  menuTextHeader: { fontSize: 16, marginLeft: 10, color: COLORS.black },
  greetingContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 100,
    marginTop: 100,
  },
  greeting: { fontSize: 24, fontWeight: "bold", textAlign: "center" },
  menuContainer: { position: "relative", width: "100%", height: 400 },
});
