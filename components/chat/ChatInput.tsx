import React from "react";
import { Ionicons } from "@expo/vector-icons";
import {
  View,
  Image,
  Keyboard,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Dimensions,
  Text,
} from "react-native";

import { COLORS } from "@/constants";
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
  customPlaceholder?: string;
}

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const PREVIEW_SIZE = Math.min(80, SCREEN_WIDTH * 0.2);

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
  customPlaceholder,
}) => {
  const onSend = () => {
    Keyboard.dismiss();
    handleSendMessage();
  };

  const placeholderText = customPlaceholder || "Pose ta question ici...";
  const hasContent =
    inputText.trim() || imagePreviewUri || documentPreview || audioPreviewUri;

  return (
    <View style={styles.container}>
      {/* Image Preview Section */}
      <ConditionalComponent isValid={!!imagePreviewUri}>
        <View style={styles.imagePreviewContainer}>
          <View
            style={[
              styles.imagePreviewWrapper,
              { width: PREVIEW_SIZE, height: PREVIEW_SIZE },
            ]}
          >
            <Image
              source={imagePreviewUri ? { uri: imagePreviewUri } : undefined}
              style={[
                styles.imagePreview,
                { width: PREVIEW_SIZE, height: PREVIEW_SIZE },
              ]}
            />
            <TouchableOpacity
              onPress={removeImagePreview}
              style={styles.removeButton}
              hitSlop={{ top: 5, bottom: 5, left: 5, right: 5 }}
            >
              <Ionicons name="close" size={14} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </ConditionalComponent>

      {/* Document Preview Section */}
      <ConditionalComponent isValid={!!documentPreview}>
        {documentPreview && (
          <View style={styles.previewContainer}>
            <View style={styles.previewWrapper}>
              <View style={styles.previewContent}>
                <Ionicons
                  name={
                    documentPreview.type === "pdf"
                      ? "document"
                      : documentPreview.type === "audio"
                        ? "musical-notes"
                        : "file-tray-full"
                  }
                  size={20}
                  color={COLORS.primary}
                />
                <Text style={styles.previewText} numberOfLines={1}>
                  {documentPreview.name}
                </Text>
              </View>
              <TouchableOpacity
                onPress={removeDocumentPreview}
                style={styles.removeButton}
                hitSlop={{ top: 5, bottom: 5, left: 5, right: 5 }}
              >
                <Ionicons name="close" size={14} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ConditionalComponent>

      {/* Audio Preview Section */}
      <ConditionalComponent isValid={!!audioPreviewUri}>
        <View style={styles.previewContainer}>
          <View style={styles.previewWrapper}>
            <View style={styles.previewContent}>
              <Ionicons name="musical-notes" size={20} color={COLORS.primary} />
              <Text style={styles.previewText}>Audio ({audioLength} sec)</Text>
            </View>
            <TouchableOpacity
              onPress={removeAudioPreview}
              style={styles.removeButton}
              hitSlop={{ top: 5, bottom: 5, left: 5, right: 5 }}
            >
              <Ionicons name="close" size={14} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </ConditionalComponent>

      <View style={styles.inputContainer}>
        {/* Document picker on the left */}
        <TouchableOpacity
          onPress={pickDocument}
          style={styles.attachButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="attach" size={22} color={COLORS.primary} />
        </TouchableOpacity>

        {/* Text input in the middle */}
        <TextInput
          style={styles.input}
          value={inputText}
          onChangeText={setInputText}
          placeholder={placeholderText}
          placeholderTextColor={COLORS.gray}
          multiline
          maxLength={1000}
          textAlignVertical="center"
        />

        {/* Media buttons on the right */}
        <View style={styles.rightButtonsContainer}>
          <TouchableOpacity
            onPress={pickImage}
            style={styles.mediaButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="image" size={20} color={COLORS.primary} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={isRecording ? stopRecording : startRecording}
            style={[styles.mediaButton, isRecording && styles.recordingButton]}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons
              name={isRecording ? "stop" : "mic"}
              size={20}
              color={isRecording ? COLORS.error : COLORS.primary}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.sendButton,
              !hasContent && styles.sendButtonDisabled,
            ]}
            onPress={onSend}
            disabled={!hasContent}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="send" size={18} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.greyscale100,
    borderTopWidth: 1,
    borderTopColor: COLORS.greyscale300,
  },
  inputContainer: {
    flexDirection: "row",
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === "ios" ? 12 : 10,
    alignItems: "flex-end",
    minHeight: Platform.OS === "ios" ? 60 : 56,
  },
  input: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: Platform.OS === "ios" ? 12 : 10,
    minHeight: 44,
    maxHeight: 120,
    borderWidth: 1,
    borderColor: COLORS.greyscale300,
    color: COLORS.greyscale900,
    fontSize: 15,
    lineHeight: 20,
    marginHorizontal: 8,
  },
  rightButtonsContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  mediaButton: {
    padding: 10,
    borderRadius: 22,
    backgroundColor: "rgba(255, 142, 105, 0.1)",
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  recordingButton: {
    backgroundColor: "rgba(255, 0, 0, 0.15)",
  },
  sendButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  sendButtonDisabled: {
    backgroundColor: COLORS.gray,
    opacity: 0.6,
  },
  attachButton: {
    padding: 10,
    borderRadius: 22,
    backgroundColor: "rgba(255, 142, 105, 0.1)",
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  // Preview styling
  imagePreviewContainer: {
    paddingHorizontal: 12,
    paddingTop: 10,
  },
  imagePreviewWrapper: {
    position: "relative",
    borderRadius: 10,
  },
  imagePreview: {
    borderRadius: 10,
  },
  removeButton: {
    position: "absolute",
    top: -6,
    right: -6,
    backgroundColor: "rgba(0,0,0,0.7)",
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  previewContainer: {
    paddingHorizontal: 12,
    paddingTop: 10,
  },
  previewWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS.greyscale300,
  },
  previewContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  previewText: {
    marginLeft: 10,
    flex: 1,
    fontSize: 14,
    color: COLORS.greyscale900,
  },
});

export default ChatInput;
