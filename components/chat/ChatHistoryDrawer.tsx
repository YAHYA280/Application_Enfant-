import React from "react";
import { Ionicons } from "@expo/vector-icons";
import {
  View,
  Text,
  Modal,
  StyleSheet,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  Platform,
  StatusBar,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import type { ChatHistory } from "@/contexts/types/chat";

import { COLORS } from "@/constants";

interface ChatHistoryDrawerProps {
  isVisible: boolean;
  onClose: () => void;
  chatHistory: ChatHistory[];
  loadChatHistory: (chat: ChatHistory) => void;
  startNewChat: () => void;
}

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const DRAWER_WIDTH = Math.min(SCREEN_WIDTH * 0.85, 380);

const ChatHistoryDrawer: React.FC<ChatHistoryDrawerProps> = ({
  isVisible,
  onClose,
  chatHistory,
  loadChatHistory,
  startNewChat,
}) => {
  const insets = useSafeAreaInsets();

  // Better Android positioning calculation
  const getDrawerTop = () => {
    if (Platform.OS === "ios") {
      return insets.top;
    }

    // For Android, we need to account for status bar properly
    const statusBarHeight = StatusBar.currentHeight || 0;
    return statusBarHeight;
  };

  const drawerTop = getDrawerTop();
  const drawerHeight = SCREEN_HEIGHT - drawerTop;

  return (
    <Modal
      animationType="slide"
      transparent
      visible={isVisible}
      onRequestClose={onClose}
      statusBarTranslucent={Platform.OS === "android"}
    >
      <TouchableOpacity
        style={styles.drawerOverlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <TouchableOpacity
          activeOpacity={1}
          style={[
            styles.drawerContainer,
            {
              top: drawerTop,
              height: drawerHeight,
              width: DRAWER_WIDTH,
            },
          ]}
          onPress={(e) => e.stopPropagation()}
        >
          <View style={styles.drawerContent}>
            {/* Header with proper spacing */}
            <View
              style={[
                styles.drawerHeader,
                Platform.OS === "android" && { paddingTop: 8 },
              ]}
            >
              <Text style={styles.drawerHeaderTitle}>
                Historique des Discussions
              </Text>
              <TouchableOpacity
                onPress={onClose}
                style={styles.closeButton}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons name="close" size={24} color={COLORS.greyscale900} />
              </TouchableOpacity>
            </View>

            {/* Scrollable content */}
            <ScrollView
              style={styles.historyList}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.historyListContent}
              bounces={Platform.OS === "ios"}
            >
              {chatHistory.map((chat, index) => (
                <TouchableOpacity
                  key={chat.id || `chat-${index}`}
                  style={styles.chatHistoryItem}
                  onPress={() => loadChatHistory(chat)}
                  activeOpacity={0.7}
                >
                  <View style={styles.chatInfo}>
                    <Text style={styles.chatHistoryTitle} numberOfLines={1}>
                      {chat.title}
                    </Text>
                    <Text style={styles.chatHistorySubtitle} numberOfLines={2}>
                      {chat.lastMessage}
                    </Text>
                  </View>
                  <Text style={styles.chatHistoryDate}>{chat.date}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Fixed button at the very bottom */}
          <View
            style={[
              styles.bottomSection,
              {
                bottom: 0,
                paddingBottom:
                  Platform.OS === "ios" ? Math.max(insets.bottom, 16) : 16,
              },
            ]}
          >
            <TouchableOpacity
              style={styles.newChatButton}
              onPress={startNewChat}
              activeOpacity={0.8}
            >
              <Ionicons name="add" size={24} color={COLORS.white} />
              <Text style={styles.newChatButtonText}>Nouvelle Discussion</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  drawerOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  drawerContainer: {
    position: "absolute",
    right: 0,
    backgroundColor: COLORS.white,
    borderLeftWidth: 1,
    borderLeftColor: COLORS.greyscale300,
    borderTopLeftRadius: Platform.OS === "android" ? 16 : 20,
    borderBottomLeftRadius: Platform.OS === "android" ? 0 : 20,
    shadowColor: "#000",
    shadowOffset: { width: -2, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: Platform.OS === "android" ? 16 : 8,
  },
  drawerContent: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: Platform.OS === "android" ? 16 : 20,
  },
  drawerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 16,
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.greyscale300,
    minHeight: 50,
  },
  drawerHeaderTitle: {
    fontSize: Platform.OS === "android" ? 17 : 18,
    fontWeight: "bold",
    color: COLORS.greyscale900,
    flex: 1,
    lineHeight: Platform.OS === "android" ? 24 : 22,
  },
  closeButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: COLORS.greyscale100,
    marginLeft: 12,
    minWidth: 40,
    minHeight: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  historyList: {
    flex: 1,
  },
  historyListContent: {
    paddingBottom: 100, // Space for the fixed button at bottom
    flexGrow: 1,
  },
  chatHistoryItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingVertical: Platform.OS === "android" ? 16 : 14,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: COLORS.greyscale300,
    borderRadius: 12,
    marginBottom: 10,
    backgroundColor: COLORS.greyscale100,
    minHeight: Platform.OS === "android" ? 70 : 60,
  },
  chatInfo: {
    flex: 1,
    marginRight: 12,
    justifyContent: "center",
  },
  chatHistoryTitle: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 6,
    color: COLORS.greyscale900,
    lineHeight: 20,
  },
  chatHistorySubtitle: {
    fontSize: 13,
    lineHeight: 18,
    color: COLORS.greyscale600,
  },
  chatHistoryDate: {
    fontSize: 11,
    marginTop: 2,
    color: COLORS.greyscale500,
    lineHeight: 14,
  },
  bottomSection: {
    position: "absolute",
    left: 0,
    right: 0,
    paddingTop: 16,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.greyscale300,
    backgroundColor: COLORS.white,
  },
  newChatButton: {
    flexDirection: "row",
    backgroundColor: COLORS.primary,
    paddingVertical: Platform.OS === "android" ? 18 : 16,
    paddingHorizontal: 20,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: Platform.OS === "android" ? 8 : 4,
    minHeight: Platform.OS === "android" ? 56 : 50,
  },
  newChatButtonText: {
    color: COLORS.white,
    marginLeft: 10,
    fontWeight: "600",
    fontSize: 15,
    lineHeight: 20,
  },
});

export default ChatHistoryDrawer;
