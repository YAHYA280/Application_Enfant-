import type { NavigationProp } from "@react-navigation/native";

import { Audio } from "expo-av";
import * as ImagePicker from "expo-image-picker";
import * as DocumentPicker from "expo-document-picker";
import { useNavigation } from "@react-navigation/native";
import React, { useRef, useState, useEffect } from "react";
import {
  View,
  FlatList,
  Platform,
  Keyboard,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
} from "react-native";

import type { Message, ChatHistory } from "@/contexts/types/chat";

import { icons, COLORS } from "@/constants";
import { MOCK_AI_RESPONSES, MOCK_CHAT_HISTORY } from "@/data/_mock/_chat";

import { useTheme } from "../theme/ThemeProvider";
import ChatInput from "../components/chat/ChatInput";
import ChatHeader from "../components/chat/ChatHeader";
import MessageBubble from "../components/MessageBubble";
import ChatAiWelcome from "../components/chat/ChatAiWelcome";
import ChatBackground from "../components/chat/ChatBackground";
import ChatHistoryDrawer from "../components/chat/ChatHistoryDrawer";

export default function ChatAiAcceuil() {
  const navigation = useNavigation<NavigationProp<any>>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const { colors } = useTheme();
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const flatListRef = useRef<FlatList | null>(null);

  // Drawer state
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);

  // Recording state
  const [isRecording, setIsRecording] = useState(false);
  const [audioRecording, setAudioRecording] = useState<Audio.Recording | null>(
    null
  );

  // Preview states
  const [imagePreviewUri, setImagePreviewUri] = useState<string | null>(null);
  const [documentPreview, setDocumentPreview] = useState<{
    name: string;
    uri: string;
    type: "text" | "image" | "audio" | "pdf";
  } | null>(null);
  const [audioPreviewUri, setAudioPreviewUri] = useState<string | null>(null);
  const [audioLength, setAudioLength] = useState<number>(0);

  // Chat history
  const [chatHistory, setChatHistory] =
    useState<ChatHistory[]>(MOCK_CHAT_HISTORY);

  // Effect to hide welcome message after first interaction
  useEffect(() => {
    if (messages.length > 0 && isFirstLoad) {
      setIsFirstLoad(false);
    }
  }, [messages, isFirstLoad]);

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
      text: "Voici une réponse régénérée à ta question. J'espère que celle-ci est plus claire !",
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

    // Match response from mock data
    const matchedResponse = MOCK_AI_RESPONSES.find((resp) =>
      resp.question.toLowerCase().includes(inputText.toLowerCase())
    );

    // Create AI response
    const aiMessage: Message = matchedResponse
      ? {
          id: matchedResponse.id,
          text: matchedResponse.answer,
          sender: "ai",
          timestamp: Date.now(),
          mediaType: matchedResponse.illustration ? "image" : "text",
          mediaUrl: matchedResponse.illustration,
        }
      : {
          id: generateUniqueId(),
          text: "Je n'ai pas compris ta question. Peux-tu la reformuler ?",
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

  // Document picker function
  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync();
      if (!result.canceled && result.assets.length > 0) {
        const fileName = result.assets[0].name;
        setDocumentPreview({
          name: fileName,
          uri: result.assets[0].uri,
          type: result.assets[0].uri.toLowerCase().endsWith(".pdf")
            ? "pdf"
            : result.assets[0].uri.toLowerCase().match(/\.(mp3|wav|m4a)$/)
              ? "audio"
              : result.assets[0].uri
                    .toLowerCase()
                    .match(/\.(jpg|jpeg|png|gif|bmp|webp)$/)
                ? "image"
                : "text",
        });
      }
    } catch (err) {
      console.error("Document picking error:", err);
    }
  };

  // Remove document preview
  const removeDocumentPreview = () => {
    setDocumentPreview(null);
  };

  // Image picker function
  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled) {
        setImagePreviewUri(result.assets[0].uri);
      }
    } catch (err) {
      console.error("Image picking error:", err);
    }
  };

  // Remove image preview
  const removeImagePreview = () => {
    setImagePreviewUri(null);
  };

  // Start audio recording
  const startRecording = async () => {
    try {
      // Request audio recording permission
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== "granted") {
        alert("Permission d'enregistrement audio refusée");
        return;
      }

      // Create and prepare the recording
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );

      setAudioRecording(recording);
      setIsRecording(true);
    } catch (err) {
      console.error("Erreur de démarrage de l'enregistrement:", err);
      alert("Impossible de démarrer l'enregistrement");
    }
  };

  // Stop audio recording
  const stopRecording = async () => {
    if (!audioRecording) return;

    try {
      // Stop and unload the recording
      await audioRecording.stopAndUnloadAsync();
      const uri = audioRecording.getURI();

      if (uri) {
        // Get audio duration
        const { sound } = await Audio.Sound.createAsync({ uri });
        const duration = await sound.getStatusAsync();

        if (duration.isLoaded && duration.durationMillis !== undefined) {
          setAudioLength(Math.round(duration.durationMillis / 1000));
        }

        // Set preview URI instead of sending directly
        setAudioPreviewUri(uri);
      }

      // Reset recording states
      setIsRecording(false);
      setAudioRecording(null);
    } catch (err) {
      console.error("Erreur d'arrêt de l'enregistrement:", err);
      alert("Impossible d'arrêter l'enregistrement");
    }
  };

  // Remove audio preview
  const removeAudioPreview = () => {
    setAudioPreviewUri(null);
    setAudioLength(0);
  };

  // Load chat history
  const loadChatHistory = (chat: ChatHistory) => {
    setMessages(chat.messages || []);
    setIsDrawerVisible(false);
    setIsFirstLoad(false);
  };

  // Start new chat
  const startNewChat = () => {
    setMessages([]);
    setIsDrawerVisible(false);
    setIsFirstLoad(true);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
      <View style={{ flex: 1 }}>
        {/* Chat History Drawer */}
        <ChatHistoryDrawer
          isVisible={isDrawerVisible}
          onClose={() => setIsDrawerVisible(false)}
          chatHistory={chatHistory}
          loadChatHistory={loadChatHistory}
          startNewChat={startNewChat}
        />

        {/* Chat Header */}
        <ChatHeader
          title="AI Devoir"
          navigation={navigation}
          onShowHistory={() => setIsDrawerVisible(true)}
          icons={icons}
        />

        {/* Main Chat Area */}
        <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 48 : 0}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={{ flex: 1 }}>
              {/* Decorative Background */}
              <ChatBackground>
                {/* Welcome component for first load */}
                {isFirstLoad && messages.length === 0 && <ChatAiWelcome />}

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
                  ]}
                  showsVerticalScrollIndicator={false}
                  keyboardShouldPersistTaps="handled"
                  removeClippedSubviews={false}
                />
              </ChatBackground>
            </View>
          </TouchableWithoutFeedback>

          {/* Chat Input Component */}
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
          />
        </KeyboardAvoidingView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "transparent",
  },
  messagesContainer: {
    padding: 10,
    flexGrow: 1,
    justifyContent: "flex-end",
  },
});
