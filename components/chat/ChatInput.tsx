import React from "react";
import { Ionicons } from "@expo/vector-icons";
import {
  View,
  Image,
  Keyboard,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

import { COLORS } from "@/constants";
import { useTheme } from "@/theme/ThemeProvider";
import ConditionalComponent from "@/components/ConditionalComponent";

interface ChatInputProps {
  inputText: string;
  setInputText: (text: string) => void;
  handleSendMessage: () => void;
  pickDocument: () => void;
  pickImage: () => void;
  isRecording: boolean;
  startRecording: () => void;
  stopRecording: () => void;
  imagePreviewUri: string | null;
  removeImagePreview: () => void;
  documentPreview: {
    name: string;
    uri: string;
    type: "text" | "image" | "audio" | "pdf";
  } | null;
  removeDocumentPreview: () => void;
  audioPreviewUri: string | null;
  audioLength: number;
  removeAudioPreview: () => void;
  customPlaceholder?: string; // New optional prop for custom placeholder
}

const ChatInput: React.FC<ChatInputProps> = ({
  inputText,
  setInputText,
  handleSendMessage,
  pickDocument,
  pickImage,
  isRecording,
  startRecording,
  stopRecording,
  imagePreviewUri,
  removeImagePreview,
  documentPreview,
  removeDocumentPreview,
  audioPreviewUri,
  audioLength,
  removeAudioPreview,
  customPlaceholder, // Added custom placeholder
}) => {
  const { dark } = useTheme();

  const onSend = () => {
    Keyboard.dismiss();
    handleSendMessage();
  };

  // Default placeholder text if no custom one is provided
  const placeholderText = customPlaceholder || "Pose ta question ici...";

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: dark ? COLORS.dark2 : "#F0F0F0" },
      ]}
    >
      {/* Image Preview Section */}
      <ConditionalComponent isValid={!!imagePreviewUri}>
        <View style={styles.imagePreviewContainer}>
          <View style={styles.imagePreviewWrapper}>
            <Image
              source={imagePreviewUri ? { uri: imagePreviewUri } : undefined}
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
                <TextInput style={styles.documentPreviewText} numberOfLines={1}>
                  {documentPreview.name}
                </TextInput>
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
              <Ionicons name="musical-notes" size={24} color={COLORS.primary} />
              <TextInput style={styles.audioPreviewText}>
                Audio ({audioLength} sec)
              </TextInput>
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

      <View
        style={[
          styles.inputContainer,
          { backgroundColor: dark ? COLORS.dark2 : "#F0F0F0" },
        ]}
      >
        {/* Document picker on the left */}
        <TouchableOpacity onPress={pickDocument} style={styles.attachButton}>
          <Ionicons
            name="attach"
            size={24}
            color={dark ? COLORS.primary : COLORS.primary}
          />
        </TouchableOpacity>

        {/* Text input in the middle with custom placeholder */}
        <TextInput
          style={[
            styles.input,
            { backgroundColor: dark ? COLORS.dark3 : "white" },
          ]}
          value={inputText}
          onChangeText={setInputText}
          placeholder={placeholderText}
          placeholderTextColor={dark ? "#999" : COLORS.gray}
          multiline
        />

        {/* Media buttons on the right */}
        <View style={styles.rightButtonsContainer}>
          <TouchableOpacity onPress={pickImage} style={styles.mediaButton}>
            <Ionicons name="image" size={22} color={COLORS.primary} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={isRecording ? stopRecording : startRecording}
            style={[
              styles.mediaButton,
              isRecording
                ? { backgroundColor: "rgba(255, 142, 105, 0.2)" }
                : {},
            ]}
          >
            <Ionicons
              name={isRecording ? "stop" : "mic"}
              size={22}
              color={COLORS.primary}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.sendButton,
              !inputText.trim() &&
              !imagePreviewUri &&
              !documentPreview &&
              !audioPreviewUri
                ? styles.sendButtonDisabled
                : {},
            ]}
            onPress={onSend}
            disabled={
              !inputText.trim() &&
              !imagePreviewUri &&
              !documentPreview &&
              !audioPreviewUri
            }
          >
            <Ionicons name="send" size={22} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#F0F0F0",
  },
  inputContainer: {
    flexDirection: "row",
    padding: 10,
    backgroundColor: "#F0F0F0",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
  },
  input: {
    flex: 1,
    backgroundColor: "white",
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    minHeight: 40,
    maxHeight: 120,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    color: "#000",
  },
  rightButtonsContainer: {
    flexDirection: "row",
    marginLeft: 8,
    alignItems: "center",
  },
  mediaButton: {
    padding: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  sendButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 25,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  sendButtonDisabled: {
    backgroundColor: COLORS.gray,
    opacity: 0.7,
  },
  attachButton: {
    marginRight: 10,
    padding: 8,
    borderRadius: 20,
  },
  // Image preview styling
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
    marginTop: 10,
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
  // Document preview styling
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
    marginTop: 10,
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
  // Audio preview styling
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
    marginTop: 10,
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

export default ChatInput;
