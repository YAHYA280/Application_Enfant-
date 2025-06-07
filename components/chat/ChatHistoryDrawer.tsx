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
} from "react-native";

import type { ChatHistory } from "@/contexts/types/chat";

import { COLORS } from "@/constants";
import { useTheme } from "@/theme/ThemeProvider";

interface ChatHistoryDrawerProps {
  isVisible: boolean;
  onClose: () => void;
  chatHistory: ChatHistory[];
  loadChatHistory: (chat: ChatHistory) => void;
  startNewChat: () => void;
}

const { height } = Dimensions.get("window");

const ChatHistoryDrawer: React.FC<ChatHistoryDrawerProps> = ({
  isVisible,
  onClose,
  chatHistory,
  loadChatHistory,
  startNewChat,
}) => {
  const { dark } = useTheme();

  return (
    <Modal
      animationType="slide"
      transparent
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={styles.drawerOverlay}>
        <View
          style={[
            styles.drawerContainer,
            {
              backgroundColor: dark ? COLORS.dark1 : COLORS.white,
              borderLeftColor: dark ? COLORS.dark3 : COLORS.greyscale300,
            },
          ]}
        >
          <View style={styles.drawerHeader}>
            <Text
              style={[
                styles.drawerHeaderTitle,
                { color: dark ? COLORS.white : COLORS.greyscale900 },
              ]}
            >
              Historique des Discussions
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons
                name="close"
                size={24}
                color={dark ? COLORS.white : COLORS.greyscale900}
              />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.historyList}>
            {chatHistory.map((chat, index) => (
              <TouchableOpacity
                key={chat.id || `chat-${index}`}
                style={[
                  styles.chatHistoryItem,
                  {
                    backgroundColor: dark ? COLORS.dark2 : COLORS.white,
                    borderBottomColor: dark
                      ? COLORS.dark3
                      : COLORS.greyscale300,
                  },
                ]}
                onPress={() => loadChatHistory(chat)}
              >
                <View style={styles.chatInfo}>
                  <Text
                    style={[
                      styles.chatHistoryTitle,
                      { color: dark ? COLORS.white : COLORS.greyscale900 },
                    ]}
                  >
                    {chat.title}
                  </Text>
                  <Text
                    style={[
                      styles.chatHistorySubtitle,
                      { color: dark ? COLORS.gray : COLORS.greyscale900 },
                    ]}
                    numberOfLines={1}
                  >
                    {chat.lastMessage}
                  </Text>
                </View>
                <Text
                  style={[
                    styles.chatHistoryDate,
                    { color: dark ? COLORS.gray : COLORS.greyscale600 },
                  ]}
                >
                  {chat.date}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <TouchableOpacity style={styles.newChatButton} onPress={startNewChat}>
            <Ionicons name="add" size={24} color={COLORS.white} />
            <Text style={styles.newChatButtonText}>Nouvelle Discussion</Text>
          </TouchableOpacity>
        </View>
      </View>
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
    top: 45,
    bottom: 0,
    width: "80%",
    backgroundColor: "white",
    padding: 16,
    borderLeftWidth: 1,
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: -2, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  drawerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
    marginTop: 8,
  },
  drawerHeaderTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  closeButton: {
    padding: 8,
  },
  historyList: {
    flex: 1,
  },
  chatHistoryItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderRadius: 8,
    marginBottom: 8,
    paddingHorizontal: 12,
  },
  chatInfo: {
    flex: 1,
    marginRight: 10,
  },
  chatHistoryTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  chatHistorySubtitle: {
    fontSize: 14,
    color: "grey",
  },
  chatHistoryDate: {
    fontSize: 12,
    color: "grey",
  },
  newChatButton: {
    flexDirection: "row",
    backgroundColor: COLORS.primary,
    padding: 16,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  newChatButtonText: {
    color: "white",
    marginLeft: 8,
    fontWeight: "600",
    fontSize: 16,
  },
});

export default ChatHistoryDrawer;
