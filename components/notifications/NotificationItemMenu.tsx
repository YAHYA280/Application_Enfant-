import React from "react";
import { Feather } from "@expo/vector-icons";
import {
  View,
  Text,
  Modal,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Platform,
} from "react-native";

import { COLORS } from "@/constants";
import { useTheme } from "@/theme/ThemeProvider";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface Notification {
  id: string;
  type: string;
  subject: string;
  message: string;
  time: string;
  read: boolean;
  archived: boolean;
  favorite: boolean;
}

interface NotificationItemMenuProps {
  notification: Notification | null;
  position: { x: number; y: number };
  onClose: () => void;
}

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const MENU_WIDTH = 220;
const SCREEN_MARGIN = 16;

const NotificationItemMenu: React.FC<NotificationItemMenuProps> = ({
  notification,
  position,
  onClose,
}) => {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  if (!notification) return null;

  const handleToggleRead = () => {
    // Logic to toggle read status
    console.log(`Toggle read status for notification ${notification.id}`);
    onClose();
  };

  const handleToggleFavorite = () => {
    // Logic to toggle favorite status
    console.log(`Toggle favorite status for notification ${notification.id}`);
    onClose();
  };

  const handleToggleArchive = () => {
    // Logic to toggle archive status
    console.log(`Toggle archive status for notification ${notification.id}`);
    onClose();
  };

  const handleDelete = () => {
    // Logic to delete notification
    console.log(`Delete notification ${notification.id}`);
    onClose();
  };

  // Enhanced position calculation for better screen adaptation
  const calculateMenuPosition = () => {
    let left = position.x - MENU_WIDTH / 2;
    let top = position.y;

    // Horizontal positioning
    if (left < SCREEN_MARGIN) {
      left = SCREEN_MARGIN;
    } else if (left + MENU_WIDTH > SCREEN_WIDTH - SCREEN_MARGIN) {
      left = SCREEN_WIDTH - MENU_WIDTH - SCREEN_MARGIN;
    }

    // Vertical positioning - account for menu height and screen bounds
    const menuHeight = 200; // Approximate menu height
    const safeTop = insets.top + 60; // Account for header
    const safeBottom = SCREEN_HEIGHT - insets.bottom - 20;

    if (top + menuHeight > safeBottom) {
      top = Math.max(safeTop, safeBottom - menuHeight);
    }

    if (top < safeTop) {
      top = safeTop;
    }

    return { left, top };
  };

  const menuPosition = calculateMenuPosition();

  return (
    <Modal
      transparent
      visible
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
            top: menuPosition.top,
            left: menuPosition.left,
            width: MENU_WIDTH,
          },
        ]}
      >
        <TouchableOpacity
          onPress={handleToggleRead}
          style={styles.menuItem}
          accessibilityLabel={
            notification.read ? "Marquer non lu" : "Marquer lu"
          }
          accessibilityRole="button"
        >
          <Feather
            name={notification.read ? "eye-off" : "eye"}
            size={18}
            style={styles.menuIcon}
            color={COLORS.primary}
          />
          <Text style={[styles.menuText, { color: COLORS.greyscale900 }]}>
            {notification.read ? "Marquer non lu" : "Marquer lu"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleToggleFavorite}
          style={styles.menuItem}
          accessibilityLabel={
            notification.favorite ? "Retirer favori" : "Ajouter favori"
          }
          accessibilityRole="button"
        >
          <Feather
            name="star"
            size={18}
            style={styles.menuIcon}
            color={notification.favorite ? COLORS.warning : COLORS.primary}
          />
          <Text style={[styles.menuText, { color: COLORS.greyscale900 }]}>
            {notification.favorite ? "Retirer favori" : "Ajouter favori"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleToggleArchive}
          style={styles.menuItem}
          accessibilityLabel={
            notification.archived ? "Désarchiver" : "Archiver"
          }
          accessibilityRole="button"
        >
          <Feather
            name={notification.archived ? "unlock" : "archive"}
            size={18}
            style={styles.menuIcon}
            color={COLORS.primary}
          />
          <Text style={[styles.menuText, { color: COLORS.greyscale900 }]}>
            {notification.archived ? "Désarchiver" : "Archiver"}
          </Text>
        </TouchableOpacity>

        <View
          style={[styles.divider, { backgroundColor: COLORS.greyscale300 }]}
        />

        <TouchableOpacity
          onPress={handleDelete}
          style={styles.menuItem}
          accessibilityLabel="Supprimer"
          accessibilityRole="button"
        >
          <Feather
            name="trash-2"
            size={18}
            style={styles.menuIcon}
            color={COLORS.error}
          />
          <Text style={[styles.menuText, { color: COLORS.error }]}>
            Supprimer
          </Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
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
    paddingVertical: Platform.OS === "android" ? 16 : 12,
    paddingHorizontal: 16,
    minHeight: 48, // Ensure minimum touch target for accessibility
  },
  menuIcon: {
    marginRight: 12,
    width: 18, // Fixed width for consistent alignment
  },
  menuText: {
    fontSize: Platform.OS === "android" ? 15 : 14,
    fontFamily: "medium",
    flex: 1,
  },
  divider: {
    height: 1,
    width: "100%",
  },
});

export default NotificationItemMenu;
