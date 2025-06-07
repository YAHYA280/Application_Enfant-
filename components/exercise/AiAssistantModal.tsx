import React, { useRef, useState, useEffect } from "react";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import {
  View,
  Text,
  Modal,
  Platform,
  FlatList,
  Keyboard,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import type { Question } from "@/data";
import type { Message } from "@/contexts/types/chat";

import { COLORS } from "@/constants";

import type { ShortAnswerQuestion as ShortAnswerQuestionType } from "./typeGuards";

import { typeGuards } from "./typeGuards";
import ChatInput from "../chat/ChatInput";
import MessageBubble from "../MessageBubble";
import ChatBackground from "../chat/ChatBackground";

interface AiAssistantModalProps {
  visible: boolean;
  onClose: () => void;
  currentQuestion: Question;
}

const AiAssistantModal: React.FC<AiAssistantModalProps> = ({
  visible,
  onClose,
  currentQuestion,
}) => {
  const insets = useSafeAreaInsets();
  const [isQuestionVisible, setIsQuestionVisible] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const flatListRef = useRef<FlatList | null>(null);

  // Recording state
  const [isRecording, setIsRecording] = useState(false);

  // Preview states
  const [imagePreviewUri, setImagePreviewUri] = useState<string | null>(null);
  const [documentPreview, setDocumentPreview] = useState<{
    name: string;
    uri: string;
    type: "text" | "image" | "audio" | "pdf";
  } | null>(null);
  const [audioPreviewUri, setAudioPreviewUri] = useState<string | null>(null);
  const [audioLength, setAudioLength] = useState<number>(0);

  // Set initial welcome message
  useEffect(() => {
    if (isFirstLoad && messages.length === 0) {
      setMessages([
        {
          id: generateUniqueId(),
          text: "Bonjour ! Je suis votre assistant IA. Comment puis-je vous aider avec cette question ?",
          sender: "ai",
          timestamp: Date.now(),
        },
      ]);
      setIsFirstLoad(false);
    }
  }, [isFirstLoad, messages]);

  // Effect to scroll to the bottom when new messages arrive
  useEffect(() => {
    if (messages.length > 0 && flatListRef.current) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 200);
    }
  }, [messages]);

  // Unique ID generator for messages
  const generateUniqueId = () => {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 8);
    return `${timestamp}-${random}`;
  };

  // Handle like/dislike toggle
  const handleToggleLike = (messageId: string) => {
    setMessages((prev) =>
      prev.map((msg) => {
        if (msg.id === messageId) {
          // Toggle between like, dislike and none
          const newLiked =
            msg.liked === "like"
              ? undefined
              : msg.liked === "dislike"
                ? "like"
                : "like";
          return { ...msg, liked: newLiked };
        }
        return msg;
      })
    );
  };

  // Handle message regeneration
  const handleRegenerate = () => {
    // Create a new AI response
    const newAiMessage: Message = {
      id: generateUniqueId(),
      text: "Voici une réponse régénérée à votre question. J'espère que celle-ci est plus claire !",
      sender: "ai",
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, newAiMessage]);
  };

  // Send message handler
  const handleSendMessage = () => {
    Keyboard.dismiss();

    if (
      inputText.trim() === "" &&
      !imagePreviewUri &&
      !documentPreview &&
      !audioPreviewUri
    )
      return;

    // Create user message
    const childMessage: Message = {
      id: generateUniqueId(),
      text: inputText,
      sender: "child",
      timestamp: Date.now(),
      ...(imagePreviewUri && {
        mediaType: "image",
        mediaUrl: imagePreviewUri,
      }),
      ...(documentPreview && {
        mediaType: documentPreview.type,
        mediaUrl: documentPreview.uri,
        text: documentPreview.name,
      }),
      ...(audioPreviewUri && {
        mediaType: "audio",
        mediaUrl: audioPreviewUri,
        text: `Audio (${audioLength} sec)`,
      }),
    };

    // Create AI response
    const aiMessage: Message = {
      id: generateUniqueId(),
      text: generateAiResponse(currentQuestion, inputText),
      sender: "ai",
      timestamp: Date.now(),
    };

    // Add messages to chat
    setMessages((prev) => [...prev, childMessage, aiMessage]);

    // Reset all inputs and previews
    setInputText("");
    setImagePreviewUri(null);
    setDocumentPreview(null);
    setAudioPreviewUri(null);
    setAudioLength(0);
  };

  // Mock document picker function
  const pickDocument = () => {
    console.log("Document picker would be implemented here");
  };

  // Mock image picker function
  const pickImage = () => {
    console.log("Image picker would be implemented here");
  };

  // Mock start audio recording
  const startRecording = () => {
    setIsRecording(true);
    console.log("Audio recording would start here");
  };

  // Mock stop audio recording
  const stopRecording = () => {
    setIsRecording(false);
    console.log("Audio recording would stop here");

    // Simulate recording result
    setTimeout(() => {
      // Add a mock voice message
      const voiceMessage: Message = {
        id: generateUniqueId(),
        text: "[Message vocal]",
        sender: "child",
        timestamp: Date.now(),
        mediaType: "audio",
        mediaUrl: "mock-audio-url",
      };

      // Add AI response
      const aiResponse: Message = {
        id: generateUniqueId(),
        text: "J'ai bien reçu votre message vocal. Comment puis-je vous aider davantage?",
        sender: "ai",
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, voiceMessage, aiResponse]);
    }, 1000);
  };

  // Mock remove image preview
  const removeImagePreview = () => {
    setImagePreviewUri(null);
  };

  // Mock remove document preview
  const removeDocumentPreview = () => {
    setDocumentPreview(null);
  };

  // Mock remove audio preview
  const removeAudioPreview = () => {
    setAudioPreviewUri(null);
    setAudioLength(0);
  };

  // Generate an AI response based on question type and user message
  const generateAiResponse = (
    question: Question,
    userMessage: string
  ): string => {
    const message = userMessage.toLowerCase();

    if (message.includes("indice") || message.includes("aide")) {
      if (typeGuards.isMultipleChoiceQuestion(question)) {
        return "Pour cette question à choix multiples, examinez attentivement chaque option. Essayez d'éliminer les réponses qui sont clairement incorrectes.";
      }

      if (typeGuards.isTrueOrFalseQuestion(question)) {
        return "Pour cette question vrai/faux, cherchez des mots absolus qui pourraient rendre l'affirmation fausse. Des mots comme 'toujours', 'jamais', ou 'tous' exigent souvent une réponse fausse.";
      }

      if (typeGuards.isFillInBlankQuestion(question)) {
        return "Pour ce type de question, pensez au contexte de la phrase. Quel mot compléterait logiquement le sens?";
      }

      if (typeGuards.isShortAnswerQuestion(question)) {
        return `Pour cette question à réponse courte, assurez-vous d'inclure les mots-clés importants comme: ${(question as ShortAnswerQuestionType).expectedKeywords.join(", ")}.`;
      }

      if (typeGuards.isSpeakingQuestion(question)) {
        return "Pour cet exercice de prononciation, prenez votre temps et articulez clairement. N'hésitez pas à vous enregistrer plusieurs fois.";
      }

      return "Analysez la question attentivement et prenez votre temps pour répondre.";
    }

    if (message.includes("bonjour") || message.includes("salut")) {
      return "Bonjour ! Comment puis-je vous aider avec cette question ?";
    }

    if (message.includes("merci")) {
      return "Je vous en prie ! N'hésitez pas si vous avez d'autres questions.";
    }

    if (message.includes("difficile") || message.includes("comprends pas")) {
      return "Ne vous inquiétez pas, c'est normal de trouver certaines questions difficiles. Essayons d'aborder le problème étape par étape. Quelle partie vous pose problème exactement ?";
    }

    // Default response
    return "Je suis là pour vous aider. Pourriez-vous préciser votre question pour que je puisse vous donner une réponse plus pertinente ?";
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={onClose}
      statusBarTranslucent={Platform.OS === "android"}
    >
      <View style={[styles.modalContainer, { backgroundColor: COLORS.white }]}>
        <StatusBar
          barStyle="dark-content"
          backgroundColor={COLORS.white}
          translucent={Platform.OS === "android"}
        />

        {/* Modal Header with proper safe area handling */}
        <View
          style={[
            styles.chatHeader,
            {
              paddingTop: insets.top,
              backgroundColor: COLORS.white,
              borderBottomColor: COLORS.greyscale300,
            },
          ]}
        >
          <View style={styles.chatHeaderContent}>
            <View style={styles.chatHeaderTitle}>
              <MaterialCommunityIcons
                name="robot"
                size={24}
                color={COLORS.primary}
              />
              <Text
                style={[styles.headerTitle, { color: COLORS.greyscale900 }]}
              >
                Assistant IA
              </Text>
            </View>

            <View style={styles.headerActions}>
              <TouchableOpacity
                style={[
                  styles.headerActionButton,
                  {
                    backgroundColor: isQuestionVisible
                      ? COLORS.primary
                      : "rgba(0,0,0,0.05)",
                  },
                ]}
                onPress={() => setIsQuestionVisible(!isQuestionVisible)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Text
                  style={[
                    styles.headerActionText,
                    {
                      color: isQuestionVisible
                        ? "#FFFFFF"
                        : COLORS.greyscale900,
                    },
                  ]}
                >
                  {isQuestionVisible
                    ? "Masquer la question"
                    : "Voir la question"}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.closeButton}
                onPress={onClose}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Feather name="x" size={24} color={COLORS.greyscale900} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Question Display */}
          {isQuestionVisible && (
            <View
              style={[
                styles.questionContainer,
                { backgroundColor: "rgba(0,0,0,0.05)" },
              ]}
            >
              <Text
                style={[styles.questionText, { color: COLORS.greyscale900 }]}
              >
                {currentQuestion.text}
              </Text>
            </View>
          )}
        </View>

        {/* Main Chat Area */}
        <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.chatContent}>
              {/* Decorative Background */}
              <ChatBackground>
                {/* Messages List */}
                <FlatList
                  ref={flatListRef}
                  data={messages}
                  renderItem={({ item }) => (
                    <MessageBubble
                      message={item}
                      onToggleLike={handleToggleLike}
                      onRegenerate={handleRegenerate}
                    />
                  )}
                  keyExtractor={(item) =>
                    item.id || `message-${Date.now()}-${Math.random()}`
                  }
                  contentContainerStyle={[
                    styles.messagesContainer,
                    messages.length === 0 && { justifyContent: "center" },
                    { paddingBottom: Math.max(insets.bottom, 30) },
                  ]}
                  showsVerticalScrollIndicator={false}
                  keyboardShouldPersistTaps="handled"
                  removeClippedSubviews={false}
                />
              </ChatBackground>
            </View>
          </TouchableWithoutFeedback>

          {/* Chat Input Component - positioned at absolute bottom */}
          <View style={styles.inputContainer}>
            <ChatInput
              inputText={inputText}
              setInputText={setInputText}
              handleSendMessage={handleSendMessage}
              pickDocument={pickDocument}
              pickImage={pickImage}
              isRecording={isRecording}
              startRecording={startRecording}
              stopRecording={stopRecording}
              imagePreviewUri={imagePreviewUri}
              removeImagePreview={removeImagePreview}
              documentPreview={documentPreview}
              removeDocumentPreview={removeDocumentPreview}
              audioPreviewUri={audioPreviewUri}
              audioLength={audioLength}
              removeAudioPreview={removeAudioPreview}
              customPlaceholder="Posez votre question..."
            />
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: "transparent",
  },
  chatContent: {
    flex: 1,
  },
  inputContainer: {
    backgroundColor: COLORS.white,
    paddingBottom: Platform.OS === "ios" ? 10 : 0,
  },
  chatHeader: {
    borderBottomWidth: 1,
    paddingBottom: 0,
  },
  chatHeaderContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    minHeight: 56, // Ensure consistent height
  },
  chatHeaderTitle: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: "bold",
    marginLeft: 10,
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerActionButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 12,
  },
  headerActionText: {
    fontSize: 12,
    fontFamily: "medium",
  },
  closeButton: {
    padding: 4,
    borderRadius: 8,
    minWidth: 32,
    minHeight: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  questionContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.05)",
  },
  questionText: {
    fontSize: 15,
    fontFamily: "medium",
    lineHeight: 22,
  },
  messagesContainer: {
    padding: 10,
    flexGrow: 1,
    justifyContent: "flex-end",
  },
});

export default AiAssistantModal;
