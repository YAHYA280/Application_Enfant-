import type { NavigationProp } from "@react-navigation/native";

import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";

import { COLORS } from "@/constants";
import { useTheme } from "@/theme/ThemeProvider";

interface ChatHeaderProps {
  title: string;
  navigation: NavigationProp<any>;
  onShowHistory: () => void;
  icons: any;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({
  title,
  navigation,
  onShowHistory,
  icons,
}) => {
  const { dark } = useTheme();

  return (
    <View
      style={[
        styles.header,
        {
          backgroundColor: dark ? COLORS.dark1 : COLORS.greyscale100,
          borderBottomColor: dark ? COLORS.dark2 : COLORS.greyscale300,
          borderBottomWidth: 1,
        },
      ]}
    >
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.backButton}
      >
        <Image
          source={icons.arrowLeft}
          style={[
            styles.headerIcon,
            {
              tintColor: dark ? COLORS.white : COLORS.greyscale900,
            },
          ]}
        />
      </TouchableOpacity>

      <Text
        style={[
          styles.headerTitle,
          {
            color: dark ? COLORS.white : COLORS.greyscale900,
          },
        ]}
      >
        {title}
      </Text>

      <TouchableOpacity style={styles.historyButton} onPress={onShowHistory}>
        <Ionicons
          name="menu"
          size={24}
          color={dark ? COLORS.white : COLORS.greyscale900}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: COLORS.white,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: "Inter-Bold",
    color: COLORS.black,
    flex: 1,
    textAlign: "center",
  },
  headerIcon: {
    height: 24,
    width: 24,
    tintColor: COLORS.black,
  },
  historyButton: {
    padding: 8,
  },
  backButton: {
    padding: 8,
  },
});

export default ChatHeader;
