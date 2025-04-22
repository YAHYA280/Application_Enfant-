import type { NavigationProp } from "@react-navigation/native";
import type { Message, ChatHistory } from "@/contexts/types/chat";

import { Audio } from "expo-av";
import React, { useState } from "react";
import { icons, COLORS } from "@/constants";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import * as DocumentPicker from "expo-document-picker";
import { useNavigation } from "@react-navigation/native";
import ConditionalComponent from "@/components/ConditionalComponent";
import { MOCK_AI_RESPONSES, MOCK_CHAT_HISTORY } from "@/data/_mock/_chat";
import {
  Text,
  View,
  Image,
  Modal,
  Platform,
  FlatList,
  TextInput,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  KeyboardAvoidingView,
} from "react-native";

import { useTheme } from "../theme/ThemeProvider";
import MessageBubble from "../components/MessageBubble";

export default function ChatAiRecherche() {
  const navigation = useNavigation<NavigationProp<any>>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const { colors, dark } = useTheme();

  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [audioRecording, setAudioRecording] = useState<Audio.Recording | null>(
    null
  );

  // New state for image preview
  const [imagePreviewUri, setImagePreviewUri] = useState<string | null>(null);

  // New state for document preview
  const [documentPreview, setDocumentPreview] = useState<{
    name: string;
    uri: string;
    type: "text" | "image" | "audio" | "pdf";
  } | null>(null);

  // New states for audio preview
  const [audioPreviewUri, setAudioPreviewUri] = useState<string | null>(null);
  const [audioLength, setAudioLength] = useState<number>(0);

  // Utiliser le mock d'historique
  const [chatHistory, setChatHistory] =
    useState<ChatHistory[]>(MOCK_CHAT_HISTORY);
  const generateUniqueId = () => {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 8);
    return `${timestamp}-${random}`;
  };
  const handleSendMessage = () => {
    if (
      inputText.trim() === "" &&
      !imagePreviewUri &&
      !documentPreview &&
      !audioPreviewUri
    )
      return;

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

    const matchedResponse = MOCK_AI_RESPONSES.find((resp) =>
      resp.question.toLowerCase().includes(inputText.toLowerCase())
    );

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

    setMessages((prev) => [...prev, childMessage, aiMessage]);

    // Reset all inputs and previews
    setInputText("");
    setImagePreviewUri(null);
    setDocumentPreview(null);
    setAudioPreviewUri(null);
    setAudioLength(0);
  };

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

  const removeDocumentPreview = () => {
    setDocumentPreview(null);
  };

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled) {
        // Set the image preview URI
        setImagePreviewUri(result.assets[0].uri);
      }
    } catch (err) {
      console.error("Image picking error:", err);
    }
  };

  const removeImagePreview = () => {
    setImagePreviewUri(null);
  };

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
  const removeAudioPreview = () => {
    setAudioPreviewUri(null);
    setAudioLength(0);
  };

  const loadChatHistory = (chat: ChatHistory) => {
    // Charger l'historique d'une discussion spécifique
    setMessages(chat.messages || []);
    setIsDrawerVisible(false);
  };

  // eslint-disable-next-line react/no-unstable-nested-components
  const HistoryDrawer = () => (
    <Modal
      animationType="slide"
      transparent
      visible={isDrawerVisible}
      onRequestClose={() => setIsDrawerVisible(false)}
    >
      <View style={styles.drawerOverlay}>
        <View
          style={[
            styles.drawerContainer,
            {
              backgroundColor: dark ? COLORS.dark1 : COLORS.white,
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
            <TouchableOpacity onPress={() => setIsDrawerVisible(false)}>
              <Ionicons
                name="close"
                size={24}
                color={dark ? COLORS.white : COLORS.greyscale900}
              />
            </TouchableOpacity>
          </View>

          <ScrollView>
            {chatHistory.map((chat, index) => (
              <TouchableOpacity
                key={chat.id || `chat-${index}`}
                style={styles.chatHistoryItem}
                onPress={() => loadChatHistory(chat)}
              >
                <View>
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
                  >
                    {chat.lastMessage}
                  </Text>
                </View>
                <Text
                  style={[
                    styles.chatHistoryDate,
                    { color: dark ? COLORS.gray : COLORS.greyscale900 },
                  ]}
                >
                  {chat.date}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <TouchableOpacity
            style={styles.newChatButton}
            onPress={() => {
              setMessages([]);
              setIsDrawerVisible(false);
            }}
          >
            <Ionicons name="add" size={24} color={COLORS.white} />
            <Text style={styles.newChatButtonText}>Nouvelle Discussion</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1, marginTop: 16 }}>
        <HistoryDrawer />

        <View
          style={[
            styles.header,
            { backgroundColor: dark ? COLORS.dark1 : COLORS.white },
          ]}
        >
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image
              source={icons.arrowLeft}
              style={[
                styles.headerIcon,
                {
                  tintColor: dark ? COLORS.white : COLORS.greyscale900,
                },
              ]}
            />
          </TouchableOpacity>
          <Text
            style={[
              styles.headerTitle,
              {
                color: dark ? COLORS.white : COLORS.greyscale900,
              },
            ]}
          >
            Assistant AI
          </Text>

          <TouchableOpacity
            style={styles.historyButton}
            onPress={() => setIsDrawerVisible(true)}
          >
            <Ionicons
              name="menu"
              size={24}
              color={dark ? COLORS.white : COLORS.greyscale900}
            />
          </TouchableOpacity>
        </View>

        <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <FlatList
            data={messages}
            renderItem={({ item }) => <MessageBubble message={item} />}
            keyExtractor={(item) =>
              item.id || `message-${Date.now()}-${Math.random()}`
            }
            contentContainerStyle={styles.messagesContainer}
          />

          {/* Image Preview Section */}
          <ConditionalComponent isValid={!!imagePreviewUri}>
            <View style={styles.imagePreviewContainer}>
              <View style={styles.imagePreviewWrapper}>
                <Image
                  source={
                    imagePreviewUri ? { uri: imagePreviewUri } : undefined
                  }
                  style={styles.imagePreview}
                />
                <TouchableOpacity
                  onPress={removeImagePreview}
                  style={styles.removeImageButton}
                >
                  <Ionicons name="close" size={16} color="white" />
                </TouchableOpacity>
              </View>
            </View>
          </ConditionalComponent>

          {/* Document Preview Section */}
          <ConditionalComponent isValid={!!documentPreview}>
            {documentPreview && (
              <View style={styles.documentPreviewContainer}>
                <View style={styles.documentPreviewWrapper}>
                  <View style={styles.documentPreviewContent}>
                    <Ionicons
                      name={
                        documentPreview.type === "pdf"
                          ? "document"
                          : documentPreview.type === "audio"
                            ? "musical-notes"
                            : "file-tray-full"
                      }
                      size={24}
                      color={COLORS.primary}
                    />
                    <Text style={styles.documentPreviewText} numberOfLines={1}>
                      {documentPreview.name}
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={removeDocumentPreview}
                    style={styles.removeDocumentButton}
                  >
                    <Ionicons name="close" size={16} color="white" />
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </ConditionalComponent>

          {/* Audio Preview Section */}
          <ConditionalComponent isValid={!!audioPreviewUri}>
            <View style={styles.audioPreviewContainer}>
              <View style={styles.audioPreviewWrapper}>
                <View style={styles.audioPreviewContent}>
                  <Ionicons
                    name="musical-notes"
                    size={24}
                    color={COLORS.primary}
                  />
                  <Text style={styles.audioPreviewText}>
                    Audio ({audioLength} sec)
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={removeAudioPreview}
                  style={styles.removeAudioButton}
                >
                  <Ionicons name="close" size={16} color="white" />
                </TouchableOpacity>
              </View>
            </View>
          </ConditionalComponent>

          <View style={styles.inputContainer}>
            <TouchableOpacity
              onPress={pickDocument}
              style={styles.attachButton}
            >
              <Ionicons name="attach" size={24} color={COLORS.primary} />
            </TouchableOpacity>
            <TouchableOpacity onPress={pickImage} style={styles.imageButton}>
              <Ionicons name="image" size={24} color={COLORS.primary} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={isRecording ? stopRecording : startRecording}
              style={styles.audioButton}
            >
              <Ionicons
                name={isRecording ? "stop" : "mic"}
                size={24}
                color={isRecording ? COLORS.primary : COLORS.primary}
              />
            </TouchableOpacity>
            <TextInput
              style={styles.input}
              value={inputText}
              onChangeText={setInputText}
              placeholder="Pose ta question ici..."
              multiline
            />
            <TouchableOpacity
              style={styles.sendButton}
              onPress={handleSendMessage}
            >
              <Ionicons name="send" size={24} color="white" />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  messagesContainer: {
    padding: 10,
    flexGrow: 1,
    justifyContent: "flex-end",
  },
  inputContainer: {
    flexDirection: "row",
    padding: 10,
    backgroundColor: "#F0F0F0",
    alignItems: "center",
  },
  input: {
    flex: 1,
    backgroundColor: "white",
    borderRadius: 20,
    paddingHorizontal: 15,
    marginRight: 10,
    minHeight: 50,
    maxHeight: 120,
  },
  sendButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 25,
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: COLORS.white,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: "semiBold",
    color: COLORS.black,
    flex: 1,
    textAlign: "center",
  },
  headerIcon: {
    height: 24,
    width: 24,
    tintColor: COLORS.black,
  },
  drawerOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  drawerContainer: {
    position: "absolute",
    right: 0,
    top: 0,
    bottom: 0,
    width: "80%",
    backgroundColor: "white",
    padding: 16,
  },
  drawerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  drawerHeaderTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  chatHistoryItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  chatHistoryTitle: {
    fontSize: 16,
    fontWeight: "600",
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
    padding: 12,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 16,
  },
  newChatButtonText: {
    color: "white",
    marginLeft: 8,
    fontWeight: "600",
  },
  historyButton: {
    marginLeft: "auto",
  },
  attachButton: {
    marginRight: 10,
  },
  imageButton: {
    marginRight: 10,
  },
  audioButton: {
    marginRight: 10,
  },
  // New styles for image preview
  imagePreviewContainer: {
    paddingHorizontal: 10,
    paddingBottom: 10,
    backgroundColor: "#F0F0F0",
  },
  imagePreviewWrapper: {
    position: "relative",
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  imagePreview: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  removeImageButton: {
    position: "absolute",
    top: -5,
    right: -5,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  documentPreviewContainer: {
    paddingHorizontal: 10,
    paddingBottom: 10,
    backgroundColor: "#F0F0F0",
  },
  documentPreviewWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 10,
    position: "relative",
  },
  documentPreviewContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  documentPreviewText: {
    marginLeft: 10,
    flex: 1,
  },
  removeDocumentButton: {
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  audioPreviewContainer: {
    paddingHorizontal: 10,
    paddingBottom: 10,
    backgroundColor: "#F0F0F0",
  },
  audioPreviewWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 10,
    position: "relative",
  },
  audioPreviewContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  audioPreviewText: {
    marginLeft: 10,
    flex: 1,
  },
  removeAudioButton: {
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
});
