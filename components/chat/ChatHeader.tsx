import type { NavigationProp } from "@react-navigation/native";

import React from "react";
import { Ionicons } from "@expo/vector-icons";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from "react-native";

import { COLORS } from "@/constants";

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
  return (
    <View style={styles.header}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.backButton}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Image source={icons.arrowLeft} style={styles.headerIcon} />
      </TouchableOpacity>

      <Text style={styles.headerTitle} numberOfLines={1}>
        {title}
      </Text>

      <TouchableOpacity
        style={styles.historyButton}
        onPress={onShowHistory}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Ionicons name="menu" size={24} color={COLORS.greyscale900} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: Platform.OS === "ios" ? 16 : 12,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.greyscale300,
    minHeight: Platform.OS === "ios" ? 56 : 52,
    elevation: Platform.OS === "android" ? 2 : 0,
    shadowColor: Platform.OS === "ios" ? "#000" : undefined,
    shadowOffset: Platform.OS === "ios" ? { width: 0, height: 1 } : undefined,
    shadowOpacity: Platform.OS === "ios" ? 0.05 : undefined,
    shadowRadius: Platform.OS === "ios" ? 1 : undefined,
  },
  headerTitle: {
    fontSize: 17,
    fontFamily: "Inter-Bold",
    color: COLORS.greyscale900,
    flex: 1,
    textAlign: "center",
    marginHorizontal: 8,
  },
  headerIcon: {
    height: 24,
    width: 24,
    tintColor: COLORS.greyscale900,
  },
  historyButton: {
    padding: 8,
    borderRadius: 8,
    minWidth: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  backButton: {
    padding: 8,
    borderRadius: 8,
    minWidth: 40,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default ChatHeader;
