import React, { useState } from "react";
import { Feather } from "@expo/vector-icons";
import {
  View,
  Text,
  Modal,
  Platform,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
} from "react-native";

import { FONTS, COLORS } from "@/constants";
import { useTheme } from "@/theme/ThemeProvider";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

import NotificationList from "./NotificationList";
import NotificationTabs from "./NotificationTabs";
import NotificationSearch from "./NotificationSearch";
import NotificationHeaderMenu from "./NotificationHeaderMenu";

type TabKey = "all" | "unread" | "read" | "favorite" | "archive";

interface NotificationModalProps {
  visible: boolean;
  onClose: () => void;
}

const NotificationModal: React.FC<NotificationModalProps> = ({
  visible,
  onClose,
}) => {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<TabKey>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [headerMenuVisible, setHeaderMenuVisible] = useState(false);

  const handleTabChange = (tab: TabKey) => {
    setActiveTab(tab);
  };

  // Calculate proper padding for different platforms
  const statusBarHeight =
    Platform.OS === "android" ? StatusBar.currentHeight || 0 : 0;
  const headerPaddingTop =
    Platform.OS === "ios" ? insets.top : Math.max(insets.top, statusBarHeight);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent={Platform.OS === "android"}
    >
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        {/* Status Bar Background for Android */}
        {Platform.OS === "android" && (
          <View
            style={[
              styles.statusBarBackground,
              {
                height: statusBarHeight,
                backgroundColor: colors.background,
              },
            ]}
          />
        )}

        {/* Safe Area Container */}
        <SafeAreaView
          style={[styles.safeContainer, { backgroundColor: colors.background }]}
          edges={
            Platform.OS === "ios" ? ["top", "left", "right"] : ["left", "right"]
          }
        >
          {/* Header */}
          <View
            style={[
              styles.header,
              {
                paddingTop: Platform.OS === "android" ? 16 : 0,
                borderBottomColor: COLORS.grayscale200,
              },
            ]}
          >
            <View style={styles.headerLeft}>
              <TouchableOpacity
                style={styles.backButton}
                onPress={onClose}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Feather name="arrow-left" size={24} color={COLORS.black} />
              </TouchableOpacity>
              <Text style={[styles.headerTitle, { color: COLORS.black }]}>
                Notifications
              </Text>
            </View>

            <NotificationHeaderMenu
              visible={headerMenuVisible}
              onToggle={() => setHeaderMenuVisible(!headerMenuVisible)}
              onClose={() => setHeaderMenuVisible(false)}
            />
          </View>

          {/* Search */}
          <NotificationSearch
            value={searchQuery}
            onChangeText={setSearchQuery}
          />

          {/* Tabs */}
          <NotificationTabs
            activeTab={activeTab}
            onTabChange={handleTabChange}
          />

          {/* List */}
          <NotificationList searchQuery={searchQuery} activeTab={activeTab} />
        </SafeAreaView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  statusBarBackground: {
    width: "100%",
  },
  safeContainer: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    minHeight: 56, // Ensure minimum touch target
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  backButton: {
    marginRight: 16,
    padding: 8, // Increased touch area
    marginLeft: -8, // Compensate for padding
  },
  headerTitle: {
    ...FONTS.h2,
    fontWeight: "600",
    fontSize: Platform.OS === "android" ? 20 : 22, // Adjust for Android
  },
});

export default NotificationModal;
