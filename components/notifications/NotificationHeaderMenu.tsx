import React from "react";
import { Feather, FontAwesome } from "@expo/vector-icons";
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Platform,
  Dimensions,
} from "react-native";

import { COLORS } from "@/constants";
import { useTheme } from "@/theme/ThemeProvider";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface NotificationHeaderMenuProps {
  visible: boolean;
  onToggle: () => void;
  onClose: () => void;
}

const { width: screenWidth } = Dimensions.get("window");

const NotificationHeaderMenu: React.FC<NotificationHeaderMenuProps> = ({
  visible,
  onToggle,
  onClose,
}) => {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  const handleMarkAllAsRead = () => {
    // Logic to mark all as read
    console.log("Mark all as read");
    onClose();
  };

  const handleDeleteAll = () => {
    // Logic to delete all
    console.log("Delete all");
    onClose();
  };

  // Calculate menu position for different screen sizes
  const menuWidth = Math.min(250, screenWidth - 32);
  const menuRight = 16;
  const menuTop = Platform.OS === "android" ? 60 : 55;

  return (
    <>
      <TouchableOpacity
        onPress={onToggle}
        style={styles.menuButton}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        accessibilityLabel="Menu des options"
        accessibilityRole="button"
      >
        <FontAwesome name="ellipsis-v" size={20} color={COLORS.black} />
      </TouchableOpacity>

      <Modal
        transparent
        visible={visible}
        animationType="fade"
        onRequestClose={onClose}
        statusBarTranslucent={Platform.OS === "android"}
      >
        <TouchableWithoutFeedback onPress={onClose}>
          <View style={styles.modalOverlay} />
        </TouchableWithoutFeedback>

        <View
          style={[
            styles.menuContainer,
            {
              backgroundColor: colors.background,
              borderColor: COLORS.greyscale300,
              width: menuWidth,
              top: menuTop + insets.top,
              right: menuRight,
            },
          ]}
        >
          <TouchableOpacity
            onPress={handleMarkAllAsRead}
            style={styles.menuItem}
            accessibilityLabel="Tout marquer comme lu"
            accessibilityRole="button"
          >
            <Feather
              name="check"
              size={18}
              style={styles.menuIcon}
              color={COLORS.primary}
            />
            <Text style={[styles.menuText, { color: COLORS.black }]}>
              Tout marquer comme lu
            </Text>
          </TouchableOpacity>

          <View
            style={[styles.divider, { backgroundColor: COLORS.greyscale300 }]}
          />

          <TouchableOpacity
            onPress={handleDeleteAll}
            style={styles.menuItem}
            accessibilityLabel="Tout supprimer"
            accessibilityRole="button"
          >
            <Feather
              name="trash-2"
              size={18}
              style={styles.menuIcon}
              color={COLORS.error}
            />
            <Text style={[styles.menuText, { color: COLORS.error }]}>
              Tout supprimer
            </Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  menuButton: {
    padding: Platform.OS === "android" ? 12 : 10,
    alignItems: "center",
    justifyContent: "center",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  menuContainer: {
    position: "absolute",
    borderRadius: 12,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8, // Increased for Android
    overflow: "hidden",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: Platform.OS === "android" ? 16 : 14,
    paddingHorizontal: 16,
    minHeight: 48, // Ensure minimum touch target
  },
  menuIcon: {
    marginRight: 12,
    width: 18, // Fixed width for alignment
  },
  menuText: {
    fontSize: Platform.OS === "android" ? 16 : 15,
    fontFamily: "medium",
    flex: 1,
  },
  divider: {
    height: 1,
    width: "100%",
  },
});

export default NotificationHeaderMenu;
