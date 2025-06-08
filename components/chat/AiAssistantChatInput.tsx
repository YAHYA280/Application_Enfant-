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

interface AiAssistantChatInputProps {
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
const PREVIEW_SIZE = Math.min(70, SCREEN_WIDTH * 0.18);

const AiAssistantChatInput: React.FC<AiAssistantChatInputProps> = ({
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

  const placeholderText = customPlaceholder || "Posez votre question...";
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
              <Ionicons name="close" size={12} color="white" />
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
                  size={18}
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
                <Ionicons name="close" size={12} color="white" />
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
              <Ionicons name="musical-notes" size={18} color={COLORS.primary} />
              <Text style={styles.previewText}>Audio ({audioLength} sec)</Text>
            </View>
            <TouchableOpacity
              onPress={removeAudioPreview}
              style={styles.removeButton}
              hitSlop={{ top: 5, bottom: 5, left: 5, right: 5 }}
            >
              <Ionicons name="close" size={12} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </ConditionalComponent>

      <View style={styles.inputContainer}>
        {/* Document picker on the left */}
        <TouchableOpacity
          onPress={pickDocument}
          style={styles.attachButton}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons name="attach" size={20} color={COLORS.primary} />
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
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons name="image" size={18} color={COLORS.primary} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={isRecording ? stopRecording : startRecording}
            style={[styles.mediaButton, isRecording && styles.recordingButton]}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons
              name={isRecording ? "stop" : "mic"}
              size={18}
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
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons name="send" size={16} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.greyscale300,
    paddingBottom: Platform.OS === "ios" ? 8 : 6,
  },
  inputContainer: {
    flexDirection: "row",
    paddingHorizontal: 10,
    paddingVertical: Platform.OS === "ios" ? 10 : 8,
    alignItems: "flex-end",
    minHeight: Platform.OS === "ios" ? 56 : 52,
  },
  input: {
    flex: 1,
    backgroundColor: COLORS.greyscale100,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: Platform.OS === "ios" ? 10 : 8,
    minHeight: 40,
    maxHeight: 100,
    borderWidth: 1,
    borderColor: COLORS.greyscale300,
    color: COLORS.greyscale900,
    fontSize: 14,
    lineHeight: 18,
    marginHorizontal: 6,
  },
  rightButtonsContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  mediaButton: {
    padding: 8,
    borderRadius: 18,
    backgroundColor: "rgba(255, 142, 105, 0.1)",
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  recordingButton: {
    backgroundColor: "rgba(255, 0, 0, 0.15)",
  },
  sendButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 18,
    width: 36,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
  },
  sendButtonDisabled: {
    backgroundColor: COLORS.gray,
    opacity: 0.6,
  },
  attachButton: {
    padding: 8,
    borderRadius: 18,
    backgroundColor: "rgba(255, 142, 105, 0.1)",
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  // Preview styling - more compact for modal
  imagePreviewContainer: {
    paddingHorizontal: 10,
    paddingTop: 8,
  },
  imagePreviewWrapper: {
    position: "relative",
    borderRadius: 8,
  },
  imagePreview: {
    borderRadius: 8,
  },
  removeButton: {
    position: "absolute",
    top: -5,
    right: -5,
    backgroundColor: "rgba(0,0,0,0.7)",
    borderRadius: 8,
    width: 16,
    height: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  previewContainer: {
    paddingHorizontal: 10,
    paddingTop: 8,
  },
  previewWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.greyscale100,
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: COLORS.greyscale300,
  },
  previewContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  previewText: {
    marginLeft: 8,
    flex: 1,
    fontSize: 13,
    color: COLORS.greyscale900,
  },
});

export default AiAssistantChatInput;
