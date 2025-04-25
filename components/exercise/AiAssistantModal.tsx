import type { Question } from "@/data";
import type { MessageAssistantAi } from "@/constants/LearningChat";

import React, { useRef, useState } from "react";
import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import {
  View,
  Text,
  Modal,
  Platform,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";

import type { ShortAnswerQuestion as ShortAnswerQuestionType } from "./typeGuards";

import { COLORS } from "../../constants";
import { typeGuards } from "./typeGuards";
import LearningMessageBubble from "../LearningMessageBubble";

interface AiAssistantModalProps {
  visible: boolean;
  onClose: () => void;
  currentQuestion: Question;
  dark: boolean;
}

const AiAssistantModal: React.FC<AiAssistantModalProps> = ({
  visible,
  onClose,
  currentQuestion,
  dark,
}) => {
  const [isQuestionVisible, setIsQuestionVisible] = useState(true);
  const [chatMessages, setChatMessages] = useState<MessageAssistantAi[]>([
    {
      id: "welcome",
      text: "Bonjour ! Je suis votre assistant IA. Comment puis-je vous aider avec cette question ?",
      sender: "ai",
      timestamp: Date.now(),
      mediaType: "text",
      status: "sent",
      liked: "none",
    },
  ]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  // Send chat message
  const sendChatMessage = () => {
    if (currentMessage.trim() === "") return;

    // Create user message
    const userMessage: MessageAssistantAi = {
      id: Date.now().toString(),
      text: currentMessage,
      sender: "user",
      timestamp: Date.now(),
      mediaType: "text",
      status: "sent",
      liked: "none",
    };

    // Add user message to chat
    setChatMessages((prev) => [...prev, userMessage]);

    // Clear input
    setCurrentMessage("");

    // Auto-response from AI (simulated)
    setTimeout(() => {
      const aiResponse: MessageAssistantAi = {
        id: (Date.now() + 1).toString(),
        text: generateAiResponse(currentQuestion, currentMessage),
        sender: "ai",
        timestamp: Date.now() + 1,
        mediaType: "text",
        status: "sent",
        liked: "none",
      };

      setChatMessages((prev) => [...prev, aiResponse]);

      // Scroll to bottom after new message
      if (scrollViewRef.current) {
        setTimeout(() => {
          scrollViewRef.current?.scrollToEnd({ animated: true });
        }, 100);
      }
    }, 500);
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
    >
      <View
        style={[
          styles.chatContainer,
          { backgroundColor: dark ? COLORS.dark1 : COLORS.white },
        ]}
      >
        {/* Chat Header */}
        <View
          style={[
            styles.chatHeader,
            { backgroundColor: dark ? COLORS.dark1 : COLORS.white },
          ]}
        >
          <View style={styles.chatHeaderTop}>
            <View style={styles.chatHeaderTitle}>
              <MaterialCommunityIcons
                name="robot"
                size={24}
                color={COLORS.primary}
              />
              <Text
                style={[
                  styles.chatHeaderText,
                  { color: dark ? COLORS.white : COLORS.greyscale900 },
                ]}
              >
                Assistant IA
              </Text>
            </View>

            <View style={styles.chatHeaderActions}>
              <TouchableOpacity
                style={[
                  styles.headerActionButton,
                  {
                    backgroundColor: isQuestionVisible
                      ? COLORS.primary
                      : dark
                        ? COLORS.dark2
                        : "rgba(0,0,0,0.05)",
                  },
                ]}
                onPress={() => setIsQuestionVisible(!isQuestionVisible)}
              >
                <Text
                  style={[
                    styles.headerActionText,
                    {
                      color: isQuestionVisible
                        ? "#FFFFFF"
                        : dark
                          ? COLORS.white
                          : COLORS.greyscale900,
                    },
                  ]}
                >
                  {isQuestionVisible
                    ? "Masquer la question"
                    : "Voir la question"}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                <Feather
                  name="x"
                  size={24}
                  color={dark ? COLORS.white : COLORS.greyscale900}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Question Display */}
          {isQuestionVisible && (
            <View
              style={[
                styles.questionDisplayContainer,
                { backgroundColor: dark ? COLORS.dark2 : "rgba(0,0,0,0.05)" },
              ]}
            >
              <Text
                style={[
                  styles.questionDisplayText,
                  { color: dark ? COLORS.white : COLORS.greyscale900 },
                ]}
              >
                {currentQuestion.text}
              </Text>
            </View>
          )}
        </View>

        {/* Chat Background with Messages */}
        <View
          style={[
            styles.chatBackground,
            {
              backgroundColor: dark
                ? "rgba(30,30,35,0.8)"
                : "rgba(245,245,245,0.9)",
            },
          ]}
        >
          <ScrollView
            ref={scrollViewRef}
            style={styles.messagesContainer}
            contentContainerStyle={styles.messagesContent}
            showsVerticalScrollIndicator={false}
          >
            {chatMessages.map((message) => (
              <LearningMessageBubble
                key={message.id}
                message={message}
                onToggleLike={(id, action) => {
                  setChatMessages(
                    chatMessages.map((msg) =>
                      msg.id === id
                        ? {
                            ...msg,
                            liked: action === "like" ? "like" : "dislike",
                          }
                        : msg
                    )
                  );
                }}
              />
            ))}
          </ScrollView>
        </View>

        {/* Chat Input */}
        <View
          style={[
            styles.chatInputContainer,
            { backgroundColor: dark ? COLORS.dark2 : "#F0F0F0" },
          ]}
        >
          <View style={styles.chatInputWrapper}>
            <TextInput
              style={[
                styles.chatInput,
                {
                  backgroundColor: dark ? COLORS.dark3 : "#FFFFFF",
                  color: dark ? COLORS.white : COLORS.greyscale900,
                },
              ]}
              placeholder="Posez votre question..."
              placeholderTextColor={
                dark ? COLORS.greyscale500 : COLORS.greyscale400
              }
              value={currentMessage}
              onChangeText={setCurrentMessage}
              multiline
            />

            {currentMessage.trim() !== "" ? (
              <TouchableOpacity
                style={styles.sendButton}
                onPress={sendChatMessage}
              >
                <Ionicons name="send" size={20} color="#FFFFFF" />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={[
                  styles.micButton,
                  isRecording ? { backgroundColor: "#F44336" } : {},
                ]}
                onPress={() => setIsRecording(!isRecording)}
              >
                <Ionicons
                  name={isRecording ? "stop" : "mic"}
                  size={20}
                  color="#FFFFFF"
                />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  chatContainer: {
    flex: 1,
  },
  chatHeader: {
    paddingTop: Platform.OS === "ios" ? 44 : 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.1)",
  },
  chatHeaderTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  chatHeaderTitle: {
    flexDirection: "row",
    alignItems: "center",
  },
  chatHeaderText: {
    fontSize: 18,
    fontFamily: "bold",
    marginLeft: 10,
  },
  chatHeaderActions: {
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
  },
  questionDisplayContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.05)",
  },
  questionDisplayText: {
    fontSize: 15,
    fontFamily: "medium",
    lineHeight: 22,
  },
  chatBackground: {
    flex: 1,
  },
  messagesContainer: {
    flex: 1,
    padding: 16,
  },
  messagesContent: {
    paddingBottom: 16,
  },
  chatInputContainer: {
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.1)",
    padding: 12,
  },
  chatInputWrapper: {
    flexDirection: "row",
    alignItems: "center",
  },
  chatInput: {
    flex: 1,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    paddingRight: 40,
    fontSize: 16,
    maxHeight: 100,
  },
  sendButton: {
    position: "absolute",
    right: 0,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  micButton: {
    position: "absolute",
    right: 0,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default AiAssistantModal;
