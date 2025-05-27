import * as Speech from "expo-speech";
import React, { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import {
  View,
  Text,
  Image,
  Modal,
  Clipboard,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from "react-native";

import type { Message } from "@/contexts/types/chat";

import { COLORS } from "@/constants";
import { useTheme } from "@/theme/ThemeProvider";

import AudioMessage from "./AudioMessage";
import ToastNotification from "./ToastNotification";

// Type for toast actions
type ToastActionType = "copy" | "like" | "dislike" | "speak" | "regenerate";

interface MessageBubbleProps {
  message: Message;
  onToggleLike?: (messageId: string) => void;
  onRegenerate?: () => void;
}

const { width } = Dimensions.get("window");

const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  onToggleLike,
  onRegenerate,
}) => {
  const { dark } = useTheme();
  const [isImageModalVisible, setIsImageModalVisible] = useState(false);
  const isAI = message.sender === "ai";

  // Toast notification state
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastAction, setToastAction] = useState<ToastActionType>("copy");

  // Format the timestamp
  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const openImageModal = () => {
    setIsImageModalVisible(true);
  };

  const closeImageModal = () => {
    setIsImageModalVisible(false);
  };

  // Show toast notification
  const showToast = (toastText: string, action: ToastActionType) => {
    setToastMessage(toastText);
    setToastAction(action);
    setToastVisible(true);
  };

  const handleCopyMessage = () => {
    Clipboard.setString(message.text);
    showToast("Texte copié", "copy");
  };

  const handleTextToSpeech = () => {
    Speech.speak(message.text, {
      language: "fr-FR",
      pitch: 1.0,
      rate: 0.75,
    });
    showToast("Lecture audio", "speak");
  };

  const handleLike = () => {
    if (message.liked !== "like") {
      showToast("Vous avez aimé ce message", "like");
    }
    onToggleLike?.(message.id);
  };

  const handleDislike = () => {
    if (message.liked !== "dislike") {
      showToast("Vous n'avez pas aimé ce message", "dislike");
    }
    onToggleLike?.(message.id);
  };

  const handleRegenerate = () => {
    showToast("Régénération de la réponse...", "regenerate");
    onRegenerate?.();
  };

  // Only show actions for AI messages
  const renderAIActions = () => {
    if (!isAI) return null;

    return (
      <View style={styles.actionContainer}>
        {/* Copy Button */}
        <TouchableOpacity
          onPress={handleCopyMessage}
          style={styles.actionButton}
        >
          <Ionicons
            name="copy"
            size={18}
            color={dark ? COLORS.greyscale500 : COLORS.gray}
          />
        </TouchableOpacity>

        {/* Listen Button */}
        <TouchableOpacity
          onPress={handleTextToSpeech}
          style={styles.actionButton}
        >
          <Ionicons
            name="volume-medium"
            size={18}
            color={dark ? COLORS.greyscale500 : COLORS.gray}
          />
        </TouchableOpacity>

        {/* Refresh Button */}
        <TouchableOpacity
          onPress={handleRegenerate}
          style={styles.actionButton}
        >
          <Ionicons
            name="refresh"
            size={18}
            color={dark ? COLORS.greyscale500 : COLORS.gray}
          />
        </TouchableOpacity>

        {/* Like/Dislike Buttons */}
        <View style={styles.actionContainerLike}>
          <TouchableOpacity onPress={handleLike} style={styles.actionButton}>
            <FontAwesome
              name={message.liked === "like" ? "thumbs-up" : "thumbs-o-up"}
              size={18}
              color={
                message.liked === "like"
                  ? COLORS.primary
                  : dark
                    ? COLORS.greyscale500
                    : COLORS.gray
              }
            />
          </TouchableOpacity>

          <TouchableOpacity onPress={handleDislike} style={styles.actionButton}>
            <FontAwesome
              name={
                message.liked === "dislike" ? "thumbs-down" : "thumbs-o-down"
              }
              size={18}
              color={
                message.liked === "dislike"
                  ? COLORS.primary
                  : dark
                    ? COLORS.greyscale500
                    : COLORS.gray
              }
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  // Render document content
  const renderDocumentContent = () => {
    if (message.mediaType === "pdf" && message.mediaUrl) {
      return (
        <TouchableOpacity style={styles.documentContainer}>
          <Ionicons name="document-text" size={24} color={COLORS.primary} />
          <Text
            style={[
              styles.documentText,
              { color: dark ? COLORS.white : COLORS.greyscale900 },
            ]}
          >
            {message.text}
          </Text>
        </TouchableOpacity>
      );
    }
    return null;
  };

  return (
    <View
      style={[
        styles.container,
        isAI ? styles.aiContainer : styles.userContainer,
      ]}
    >
      {/* AI avatar for AI messages */}
      {isAI && (
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>🤖</Text>
          </View>
        </View>
      )}

      <View
        style={[
          styles.bubble,
          isAI
            ? [
                styles.aiBubble,
                {
                  backgroundColor: dark
                    ? "rgba(53, 56, 63, 0.8)"
                    : "rgba(255, 255, 255, 0.9)",
                  borderColor: dark ? COLORS.dark3 : COLORS.greyscale300,
                },
              ]
            : [
                styles.userBubble,
                {
                  backgroundColor: dark
                    ? "rgba(255, 142, 105, 0.3)"
                    : "rgba(255, 142, 105, 0.2)",
                  borderColor: dark
                    ? "rgba(255, 142, 105, 0.5)"
                    : COLORS.primary,
                },
              ],
        ]}
      >
        {/* Audio message */}
        {message.mediaType === "audio" && message.mediaUrl && (
          <AudioMessage audioUri={message.mediaUrl} />
        )}

        {/* Document content */}
        {renderDocumentContent()}

        {/* Text message */}
        {message.mediaType !== "audio" && message.mediaType !== "pdf" && (
          <Text
            style={[
              styles.bubbleText,
              { color: dark ? COLORS.white : COLORS.greyscale900 },
            ]}
          >
            {message.text}
          </Text>
        )}

        {/* Image handling */}
        {message.mediaType === "image" && message.mediaUrl && (
          <>
            <TouchableOpacity onPress={openImageModal}>
              <Image
                source={{ uri: message.mediaUrl }}
                style={styles.mediaImage}
                resizeMode="cover"
              />
            </TouchableOpacity>

            <Modal
              visible={isImageModalVisible}
              transparent
              onRequestClose={closeImageModal}
            >
              <View style={styles.modalContainer}>
                <TouchableOpacity
                  style={styles.modalBackground}
                  activeOpacity={1}
                  onPress={closeImageModal}
                >
                  <Image
                    source={{ uri: message.mediaUrl }}
                    style={styles.fullScreenImage}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
              </View>
            </Modal>
          </>
        )}

        {/* Timestamp */}
        <Text
          style={[
            styles.timestamp,
            { color: dark ? COLORS.gray : COLORS.greyscale600 },
          ]}
        >
          {formatTime(message.timestamp)}
        </Text>

        {/* Actions for AI messages */}
        {renderAIActions()}
      </View>

      {/* Toast Notification */}
      <ToastNotification
        visible={toastVisible}
        message={toastMessage}
        action={toastAction}
        onHide={() => setToastVisible(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    marginVertical: 8,
    paddingHorizontal: 8,
    position: "relative", // For positioning the toast notification
  },
  aiContainer: {
    justifyContent: "flex-start",
  },
  userContainer: {
    justifyContent: "flex-end",
  },
  avatarContainer: {
    marginRight: 8,
    alignSelf: "flex-end",
    marginBottom: 5,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(255, 142, 105, 0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    fontSize: 16,
  },
  bubble: {
    maxWidth: width * 0.75,
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 1,
  },
  aiBubble: {
    alignSelf: "flex-start",
    borderTopLeftRadius: 4,
  },
  userBubble: {
    alignSelf: "flex-end",
    borderTopRightRadius: 4,
  },
  bubbleText: {
    fontSize: 16,
    lineHeight: 22,
  },
  timestamp: {
    fontSize: 10,
    alignSelf: "flex-end",
    marginTop: 6,
    marginBottom: 2,
  },
  mediaImage: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginTop: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.8)",
  },
  modalBackground: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  fullScreenImage: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
  actionContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.05)",
  },
  actionContainerLike: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  actionButton: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  documentContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    backgroundColor: "rgba(0,0,0,0.05)",
    borderRadius: 8,
    marginBottom: 10,
  },
  documentText: {
    marginLeft: 8,
    flex: 1,
    color: COLORS.primary,
  },
});

export default MessageBubble;
