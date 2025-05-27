import React, { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import {
  View,
  Text,
  Image,
  Modal,
  Alert,
  Clipboard,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from "react-native";

import type { MessageAssistantAi } from "@/constants/LearningChat";

import { COLORS } from "@/constants";

import AudioMessage from "./AudioMessage";
import ConditionalComponent from "./ConditionalComponent";

interface MessageBubbleProps {
  message: MessageAssistantAi;
  onToggleLike?: (messageId: string, action: string) => void;
  onRegenerate?: () => void;
}

const LearningMessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  onToggleLike,
  onRegenerate,
}) => {
  const [isImageModalVisible, setIsImageModalVisible] = useState(false);
  const [showActions, setShowActions] = useState(false);

  const openImageModal = () => {
    setIsImageModalVisible(true);
  };

  const closeImageModal = () => {
    setIsImageModalVisible(false);
  };

  const handleCopyMessage = () => {
    Clipboard.setString(message.text);
  };

  const handleLike = () => {
    onToggleLike?.(message.id, "like");
  };

  const handleDislike = () => {
    onToggleLike?.(message.id, "dislike");
  };

  const renderAIActions = () => {
    if (!showActions) return null;

    return (
      <View
        style={[
          styles.actionContainer,
          message.sender === "user" && styles.userActions,
        ]}
      >
        <TouchableOpacity
          onPress={handleCopyMessage}
          style={styles.actionButton}
        >
          <Ionicons name="copy" size={20} color={COLORS.gray} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="volume-medium" size={20} color={COLORS.gray} />
        </TouchableOpacity>

        <TouchableOpacity onPress={onRegenerate} style={styles.actionButton}>
          <Ionicons name="refresh" size={20} color={COLORS.gray} />
        </TouchableOpacity>

        <ConditionalComponent isValid={message.sender === "ai"}>
          <View style={styles.actionContainerLike}>
            <TouchableOpacity onPress={handleLike} style={styles.actionButton}>
              <FontAwesome
                name={message.liked === "like" ? "thumbs-up" : "thumbs-o-up"}
                size={20}
                color={message.liked === "like" ? COLORS.primary : COLORS.gray}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleDislike}
              style={styles.actionButton}
            >
              <FontAwesome
                name={
                  message.liked === "dislike" ? "thumbs-down" : "thumbs-o-down"
                }
                size={20}
                color={
                  message.liked === "dislike" ? COLORS.primary : COLORS.gray
                }
              />
            </TouchableOpacity>
          </View>
        </ConditionalComponent>
      </View>
    );
  };

  const handleMessagePress = () => {
    setShowActions(!showActions);
  };

  const renderDocumentAttachment = () => {
    try {
      const documentData = JSON.parse(message.text);
      if (documentData.documents && documentData.documents.length > 0) {
        return documentData.documents.map(
          (doc: { name: string; uri: string }, index: number) => (
            <TouchableOpacity
              key={index}
              style={styles.documentAttachment}
              onPress={() => {
                // Attempt to open the document if possible
                Alert.alert("Document", `Fichier: ${doc.name}`, [
                  {
                    text: "Ouvrir",
                    onPress: () => {
                      // expo-document-picker
                      console.log(
                        "Tentative d'affichage du document:",
                        doc.uri
                      );
                    },
                  },
                  {
                    text: "Annuler",
                    style: "cancel",
                  },
                ]);
              }}
            >
              <Ionicons name="document" size={24} color={COLORS.primary} />
              <Text style={styles.documentName} numberOfLines={1}>
                {doc.name}
              </Text>
            </TouchableOpacity>
          )
        );
      }
    } catch (error) {
      console.error("Erreur d'analyse de la pièce jointe", error);
    }
    return null;
  };

  const renderImageAttachment = () => {
    try {
      // Check if the message is an image message
      if (message.mediaType === "image" && message.mediaUrl) {
        return (
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
        );
      }

      // Check for image in parsed text (for attachment case)
      const parsedText = JSON.parse(message.text);
      if (parsedText.images && parsedText.images.length > 0) {
        return parsedText.images.map((imageUri: string, index: number) => (
          <TouchableOpacity key={index} onPress={openImageModal}>
            <Image
              source={{ uri: imageUri }}
              style={styles.mediaImage}
              resizeMode="cover"
            />
          </TouchableOpacity>
        ));
      }
    } catch (error) {
      console.error("Erreur d'analyse de l'image jointe", error);
    }
    return null;
  };

  return (
    <>
      <View
        style={[
          styles.messageContainer,
          { alignSelf: message.sender === "user" ? "flex-end" : "flex-start" },
        ]}
      >
        <View>
          <TouchableOpacity activeOpacity={0.8} onPress={handleMessagePress}>
            <View
              style={[
                styles.bubble,
                message.sender === "user"
                  ? styles.childBubble
                  : styles.aiBubble,
              ]}
            >
              {message.mediaType === "audio" ? (
                <AudioMessage audioUri={message.mediaUrl || ""} />
              ) : (
                null
              )}

              {/* Render text if not an attachment type */}
              {message.mediaType === "text" && !message.isAttachment ? (
                <Text style={styles.bubbleText}>{message.text}</Text>
              ) : (
                null
              )}

              {/* Render document attachments */}
              {message.mediaType === "document" ? (
                renderDocumentAttachment()
              ) : (
                null
              )}

              {/* Render image attachments */}
              {message.mediaType === "image" ||
              (message.text && message.isAttachment) ? (
                renderImageAttachment()
              ) : (
                null
              )}
            </View>
          </TouchableOpacity>
        </View>
      </View>
      {renderAIActions()}
    </>
  );
};

const styles = StyleSheet.create({
  messageContainer: {
    marginVertical: 8,
    maxWidth: "80%",
  },
  userActions: {
    alignSelf: "flex-end",
  },
  bubble: {
    padding: 10,
    borderRadius: 15,
  },
  childBubble: {
    backgroundColor: "#E6F2FF",
  },
  aiBubble: {
    backgroundColor: "#F0F0F0",
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
  documentAttachment: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.grayscale100,
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
  },
  documentName: {
    marginLeft: 10,
    color: COLORS.primary,
    maxWidth: 200,
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
    justifyContent: "flex-start",
  },
  actionContainerLike: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  actionButton: {
    paddingHorizontal: 5,
    paddingVertical: 7,
    borderRadius: 20,
  },
});

export default LearningMessageBubble;
