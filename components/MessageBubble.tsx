import type { Message } from "@/contexts/types/chat";

import Tts from "react-native-tts";
import { COLORS } from "@/constants";
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

import AudioMessage from "./AudioMessage";

interface MessageBubbleProps {
  message: Message;
  onToggleLike?: (messageId: string) => void;
  onRegenerate?: () => void;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  onToggleLike,
  onRegenerate,
}) => {
  const [isImageModalVisible, setIsImageModalVisible] = useState(false);

  const openImageModal = () => {
    setIsImageModalVisible(true);
  };

  const closeImageModal = () => {
    setIsImageModalVisible(false);
  };

  const handleCopyMessage = () => {
    Clipboard.setString(message.text);
  };

  const handleTextToSpeech = () => {
    Tts.setDefaultLanguage("fr-FR")
      .then(() => {
        Tts.speak(message.text, {
          iosVoiceId: "com.apple.ttsbundle.Thomas-compact",
          rate: 0.5,
          androidParams: {
            KEY_PARAM_PAN: 0,
            KEY_PARAM_VOLUME: 1,
            KEY_PARAM_STREAM: "STREAM_MUSIC",
          },
        });
      })
      .catch((err) => console.error("Erreur TTS:", err));
  };

  const handleLike = () => {
    onToggleLike?.(message.id);
  };

  const handleDislike = () => {
    onToggleLike?.(message.id);
  };

  // Ne montrer les actions que pour les messages de l'IA
  const renderAIActions = () => {
    if (message.sender !== "ai") return null;

    return (
      <View style={styles.actionContainer}>
        {/* Bouton Copier */}
        <TouchableOpacity
          onPress={handleCopyMessage}
          style={styles.actionButton}
        >
          <Ionicons name="copy" size={20} color={COLORS.gray} />
        </TouchableOpacity>

        {/* Bouton Écouter */}
        <TouchableOpacity
          onPress={handleTextToSpeech}
          style={styles.actionButton}
        >
          <Ionicons name="volume-medium" size={20} color={COLORS.gray} />
        </TouchableOpacity>
        {/* Bouton Refresh */}
        <TouchableOpacity onPress={onRegenerate} style={styles.actionButton}>
          <Ionicons name="refresh" size={20} color={COLORS.gray} />
        </TouchableOpacity>
        {/* Bouton Like */}
        <View style={styles.actionContainerLike}>
          <TouchableOpacity onPress={handleLike} style={styles.actionButton}>
            <FontAwesome
              name={message.liked === "like" ? "thumbs-up" : "thumbs-o-up"}
              size={20}
              color={message.liked === "like" ? COLORS.gray : COLORS.gray}
            />
          </TouchableOpacity>

          <TouchableOpacity onPress={handleDislike} style={styles.actionButton}>
            <FontAwesome
              name={
                message.liked === "dislike" ? "thumbs-down" : "thumbs-o-down"
              }
              size={20}
              color={message.liked === "dislike" ? COLORS.gray : COLORS.gray}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View
      style={[
        styles.bubble,
        message.sender === "child" ? styles.childBubble : styles.aiBubble,
      ]}
    >
      {message.mediaType === "audio" && (
        <AudioMessage audioUri={message.mediaUrl || ""} />
      )}
      {message.mediaType !== "audio" && (
        <Text style={styles.bubbleText}>{message.text}</Text>
      )}
      {/* Gestion des images */}
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

      {/* Actions pour les messages de l'IA */}
      {renderAIActions()}
    </View>
  );
};

const styles = StyleSheet.create({
  bubble: {
    maxWidth: "80%",
    padding: 10,
    borderRadius: 15,
    marginVertical: 5,
  },
  childBubble: {
    backgroundColor: "#E6F2FF",
    alignSelf: "flex-end",
  },
  aiBubble: {
    backgroundColor: "#F0F0F0",
    alignSelf: "flex-start",
  },
  bubbleText: {
    fontSize: 16,
  },
  mediaImage: {
    width: 200,
    height: 150,
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
    width: 120,
  },
  actionContainerLike: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  actionButton: {
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 20,
  },
});

export default MessageBubble;
