import type { Module, Question, Exercise } from "@/data";
import type { NavigationProp } from "@react-navigation/native";
import type { MessageAssistantAi } from "@/constants/LearningChat";

import { Audio } from "expo-av";
import React, { useState } from "react";
import { useNavigation } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { useTheme } from "@/theme/ThemeProvider";
import * as DocumentPicker from "expo-document-picker";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import {
  View,
  Text,
  Modal,
  Image,
  Platform,
  TextInput,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
} from "react-native";

import { COLORS } from "../constants";
import ConditionalComponent from "./ConditionalComponent";
import LearningMessageBubble from "./LearningMessageBubble";

function isMultipleChoiceQuestion(
  question: Question
): question is MultipleChoiceQuestion {
  return question.type === "multipleChoice";
}

function isTrueOrFalseQuestion(
  question: Question
): question is TrueOrFalseQuestion {
  return question.type === "trueOrFalse";
}

function isFillInBlankQuestion(
  question: Question
): question is FillInBlankQuestion {
  return question.type === "fillInBlank";
}

function isShortAnswerQuestion(
  question: Question
): question is ShortAnswerQuestion {
  return question.type === "shortAnswer";
}

function isSpeakingQuestion(question: Question): question is SpeakingQuestion {
  return question.type === "speaking";
}

interface MultipleChoiceQuestion extends Question {
  type: "multipleChoice";
  options: { id: string; text: string }[];
  correctAnswer: string;
}

interface TrueOrFalseQuestion extends Question {
  type: "trueOrFalse";
  correctAnswer: boolean;
}

interface FillInBlankQuestion extends Question {
  type: "fillInBlank";
  correctAnswer: string;
}

interface ShortAnswerQuestion extends Question {
  type: "shortAnswer";
  expectedKeywords: string[];
}

interface SpeakingQuestion extends Question {
  type: "speaking";
  guidanceText: string;
}

interface ExerciseProps {
  exercice: Exercise;
  module: Module;
  questions: Question[];
  onSubmit: (results: boolean[]) => void;
}

const ExerciseComponent: React.FC<ExerciseProps> = ({
  exercice,
  module,
  questions,
  onSubmit,
}) => {
  const navigation = useNavigation<NavigationProp<any>>();
  const { dark, colors } = useTheme();
  const [userAnswers, setUserAnswers] = useState<
    (string | boolean | undefined)[]
  >(questions.map(() => undefined));
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isQuestionVisible, setIsQuestionVisible] = useState(false);
  const [isSummaryOpen, setIsSummaryOpen] = useState(false);
  const [attachments, setAttachments] = useState<{
    images: string[];
    audioRecording?: string;
    documents?: { name: string; uri: string }[];
  }>({
    images: [],
    audioRecording: undefined,
    documents: [],
  });
  const [isRecording, setIsRecording] = useState(false);
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const insets = useSafeAreaInsets();

  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<MessageAssistantAi[]>([]);
  const [currentMessage, setCurrentMessage] = useState("");

  // Document Picker Handler
  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: [
          "application/pdf",
          "application/msword",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          "text/plain",
        ],
        copyToCacheDirectory: true,
      });

      if (result.assets && result.assets.length > 0) {
        const file = result.assets[0];
        setAttachments((prev) => ({
          ...prev,
          documents: [
            ...(prev.documents || []),
            {
              name: file.name,
              uri: file.uri,
            },
          ],
        }));
      }
    } catch (error) {
      console.error("Erreur lors de la sélection du document :", error);
      alert("Impossible de sélectionner le document.");
    }
  };

  // Image Picker Handler
  const pickImage = async () => {
    try {
      // Request permission
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        alert(
          "Désolé, nous avons besoin des autorisations de pellicule pour que cela fonctionne!"
        );
        return;
      }

      // Launch image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        quality: 1,
      });

      if (!result.canceled) {
        const newImages = result.assets.map((asset) => asset.uri);
        setAttachments((prev) => ({
          ...prev,
          images: [...prev.images, ...newImages],
        }));
      }
    } catch (error) {
      console.error("Erreur de sélection d'image :", error);
      alert("Impossible de choisir l'image.");
    }
  };

  // Audio Recording Handlers
  const startRecording = async () => {
    try {
      // Request audio recording permissions
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== "granted") {
        alert(
          "Désolé, nous avons besoin des autorisations d'enregistrement audio pour que cela fonctionne!"
        );
        return;
      }

      // Prepare recording
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const recordingOptions: Audio.RecordingOptions = {
        android: {
          extension: ".m4a",
          outputFormat: Audio.AndroidOutputFormat.MPEG_4,
          audioEncoder: Audio.AndroidAudioEncoder.AAC,
          sampleRate: 44100,
          numberOfChannels: 2,
          bitRate: 128000,
        },
        ios: {
          extension: ".m4a",
          audioQuality: Audio.IOSAudioQuality.HIGH,
          sampleRate: 44100,
          numberOfChannels: 2,
          bitRate: 128000,
        },
        web: {
          mimeType: "audio/webm",
          bitsPerSecond: 128000,
        },
      };

      const recordingInstance = new Audio.Recording();
      await recordingInstance.prepareToRecordAsync(recordingOptions);
      await recordingInstance.startAsync();
      setRecording(recordingInstance);
      setIsRecording(true);
    } catch (error) {
      console.error("Échec du démarrage de l'enregistrement", error);
      alert("Échec du démarrage de l'enregistrement.");
    }
  };

  const stopRecording = async () => {
    try {
      if (!recording) return;

      setIsRecording(false);
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();

      if (uri) {
        setAttachments((prev) => ({
          ...prev,
          audioRecording: uri,
        }));
      }

      setRecording(null);
    } catch (error) {
      console.error("Impossible d'arrêter l'enregistrement", error);
    }
  };

  // Render Attachments Preview
  const renderAttachments = () => {
    if (
      attachments.images.length === 0 &&
      !attachments.audioRecording &&
      !attachments.documents?.length
    ) {
      return null;
    }

    return (
      <View style={styles.attachmentsContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.attachmentsScrollContent}
        >
          {/* Image attachments */}
          {attachments.images.map((uri, index) => (
            <View key={index} style={styles.attachmentItem}>
              <Image source={{ uri }} style={styles.attachmentImage} />
              <TouchableOpacity
                style={styles.removeImageAttachmentButton}
                onPress={() => {
                  const newImages = [...attachments.images];
                  newImages.splice(index, 1);
                  setAttachments({ ...attachments, images: newImages });
                }}
              >
                <Feather name="x" size={16} color={COLORS.white} />
              </TouchableOpacity>
            </View>
          ))}

          {/* Document attachments */}
          {attachments.documents?.map((doc, index) => (
            <View key={`doc-${index}`} style={styles.attachmentItem}>
              <View style={styles.documentAttachment}>
                <Feather name="file" size={24} color={COLORS.primary} />
                <Text
                  style={[
                    styles.documentAttachmentText,
                    { color: dark ? COLORS.white : COLORS.primary },
                  ]}
                  numberOfLines={1}
                >
                  {doc.name}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.removeAttachmentButton}
                onPress={() => {
                  const newDocuments = [...(attachments.documents || [])];
                  newDocuments.splice(index, 1);
                  setAttachments({
                    ...attachments,
                    documents: newDocuments,
                  });
                }}
              >
                <Feather name="x" size={16} color={COLORS.white} />
              </TouchableOpacity>
            </View>
          ))}

          {/* Audio recording attachment */}
          {attachments.audioRecording && (
            <View style={styles.attachmentItem}>
              <View style={styles.audioAttachment}>
                <MaterialCommunityIcons
                  name="podcast"
                  size={24}
                  color={COLORS.primary}
                />
                <Text
                  style={[
                    styles.audioAttachmentText,
                    { color: dark ? COLORS.white : COLORS.primary },
                  ]}
                >
                  Audio
                </Text>
              </View>
              <TouchableOpacity
                style={styles.removeAttachmentButton}
                onPress={() => {
                  setAttachments({ ...attachments, audioRecording: undefined });
                }}
              >
                <Feather name="x" size={16} color={COLORS.white} />
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </View>
    );
  };

  const renderMultipleChoice = (
    question: MultipleChoiceQuestion,
    index: number
  ) => (
    <View style={styles.questionContainer}>
      <Text
        style={[
          styles.questionText,
          { color: dark ? COLORS.white : COLORS.greyscale900 },
        ]}
      >
        {question.text}
      </Text>
      {question.options.map((option) => (
        <TouchableOpacity
          key={option.id}
          style={[
            styles.optionButton,
            // userAnswers[index] === option.id && styles.selectedOption,
            {
              borderColor: dark ? COLORS.grayscale700 : COLORS.gray,
              backgroundColor:
                dark && userAnswers[index] === option.id
                  ? COLORS.primary
                  : dark
                    ? COLORS.greyScale800
                    : userAnswers[index] === option.id
                      ? COLORS.primary
                      : "transparent",
            },
          ]}
          onPress={() => {
            const newAnswers = [...userAnswers];
            newAnswers[index] = option.id;
            setUserAnswers(newAnswers);
          }}
        >
          <Text
            style={[
              styles.optionText,
              {
                color:
                  userAnswers[index] === option.id
                    ? COLORS.white
                    : dark
                      ? COLORS.white
                      : COLORS.greyscale900,
              },
            ]}
          >
            {option.text}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderTrueOrFalse = (question: TrueOrFalseQuestion, index: number) => (
    <View style={styles.questionContainer}>
      <Text
        style={[
          styles.questionText,
          { color: dark ? COLORS.white : COLORS.greyscale900 },
        ]}
      >
        {question.text}
      </Text>
      <View style={styles.booleanContainer}>
        <TouchableOpacity
          style={[
            styles.booleanButton,
            {
              borderColor: dark ? COLORS.grayscale700 : COLORS.gray,
              backgroundColor:
                dark && userAnswers[index] === true
                  ? COLORS.primary
                  : dark
                    ? COLORS.greyScale800
                    : userAnswers[index] === true
                      ? COLORS.primary
                      : "transparent",
            },
          ]}
          onPress={() => {
            const newAnswers = [...userAnswers];
            newAnswers[index] = true;
            setUserAnswers(newAnswers);
          }}
        >
          <Text
            style={[
              styles.optionText,
              {
                color:
                  userAnswers[index] === true
                    ? COLORS.white
                    : dark
                      ? COLORS.white
                      : COLORS.greyscale900,
              },
            ]}
          >
            True
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.booleanButton,
            {
              borderColor: dark ? COLORS.grayscale700 : COLORS.gray,
              backgroundColor:
                dark && userAnswers[index] === false
                  ? COLORS.primary
                  : dark
                    ? COLORS.greyScale800
                    : userAnswers[index] === false
                      ? COLORS.primary
                      : "transparent",
            },
          ]}
          onPress={() => {
            const newAnswers = [...userAnswers];
            newAnswers[index] = false;
            setUserAnswers(newAnswers);
          }}
        >
          <Text
            style={[
              styles.optionText,
              {
                color:
                  userAnswers[index] === false
                    ? COLORS.white
                    : dark
                      ? COLORS.white
                      : COLORS.greyscale900,
              },
            ]}
          >
            False
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderFillInBlank = (question: FillInBlankQuestion, index: number) => (
    <View style={styles.questionContainer}>
      <Text
        style={[
          styles.questionText,
          { color: dark ? COLORS.white : COLORS.greyscale900 },
        ]}
      >
        {question.text}
      </Text>
      <TextInput
        style={[
          styles.textInput,
          {
            borderColor: dark ? COLORS.grayscale700 : COLORS.gray,
            backgroundColor: dark ? COLORS.greyScale800 : COLORS.white,
            color: dark ? COLORS.white : COLORS.greyscale900,
          },
        ]}
        placeholder="Tapez votre réponse ici"
        value={
          typeof userAnswers[index] === "string"
            ? (userAnswers[index] as string)
            : ""
        }
        onChangeText={(text) => {
          const newAnswers = [...userAnswers];
          newAnswers[index] = text;
          setUserAnswers(newAnswers);
        }}
      />
    </View>
  );

  const renderShortAnswer = (question: ShortAnswerQuestion, index: number) => (
    <View style={styles.questionContainer}>
      <Text
        style={[
          styles.questionText,
          { color: dark ? COLORS.white : COLORS.greyscale900 },
        ]}
      >
        {question.text}
      </Text>
      <TextInput
        style={[
          styles.textInput,
          {
            borderColor: dark ? COLORS.grayscale700 : COLORS.gray,
            backgroundColor: dark ? COLORS.greyScale800 : COLORS.white,
            color: dark ? COLORS.white : COLORS.greyscale900,
          },
        ]}
        placeholder="Tapez votre réponse ici"
        multiline
        value={
          typeof userAnswers[index] === "string"
            ? (userAnswers[index] as string)
            : ""
        }
        onChangeText={(text) => {
          const newAnswers = [...userAnswers];
          newAnswers[index] = text;
          setUserAnswers(newAnswers);
        }}
      />
    </View>
  );

  const renderSpeaking = (question: SpeakingQuestion) => (
    <View style={styles.questionContainer}>
      <Text
        style={[
          styles.questionText,
          { color: dark ? COLORS.white : COLORS.greyscale900 },
        ]}
      >
        {question.text}
      </Text>
      <Text
        style={[
          styles.guidanceText,
          { color: dark ? COLORS.greyscale500 : COLORS.grayscale700 },
        ]}
      >
        {question.guidanceText}
      </Text>
      <TouchableOpacity style={styles.recordButton}>
        <Text style={styles.recordButtonText}>🎤 enregistrer</Text>
      </TouchableOpacity>
    </View>
  );

  const handleAIHint = () => {
    // Placeholder for AI hint generation
    const currentQuestion = questions[currentQuestionIndex];
    let hint = "";

    switch (currentQuestion.type) {
      case "multipleChoice":
        hint =
          "Analysons soigneusement les options. Cherchez des mots-clés ou des expressions qui pourraient vous donner un indice.";
        break;
      case "trueOrFalse":
        hint =
          "Examinez attentivement l'énoncé. Cherchez des termes absolus qui pourraient le rendre faux.";
        break;
      case "fillInBlank":
        hint =
          "Réfléchissez au contexte de la phrase. Quel mot complèterait logiquement le sens?";
        break;
      case "shortAnswer":
        hint =
          "Décomposez la question en éléments clés. Quels renseignements précis sont demandés?";
        break;
      case "speaking":
        hint =
          "Prenez un moment pour organiser vos pensées. Entraînez-vous à parler clairement et en toute confiance.";
        break;
      default:
        hint = "Prenez votre temps et lisez attentivement la question.";
    }

    setChatMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        text: hint,
        sender: "ai",
        timestamp: Date.now(),
        mediaType: "text",
        status: "sent",
        liked: "none",
        metadata: {
          questionId: currentQuestion.id,
        },
      },
    ]);
  };

  const sendChatMessage = () => {
    if (
      currentMessage.trim() === "" &&
      attachments.images.length === 0 &&
      !attachments.audioRecording &&
      !attachments.documents?.length
    )
      return;
    const newMessages = [...chatMessages];

    const generateUniqueId = () =>
      `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    if (currentMessage.trim() !== "") {
      newMessages.push({
        id: generateUniqueId(),
        text: currentMessage,
        sender: "user",
        timestamp: Date.now(),
        mediaType: "text",
        status: "sent",
        liked: "none",
      });
    }

    // Add attachments as separate messages
    if (attachments.images.length > 0) {
      newMessages.push({
        id: generateUniqueId(),
        text: JSON.stringify({ images: attachments.images }),
        sender: "user",
        timestamp: Date.now(),
        mediaType: "image",
        isAttachment: true,
        status: "sent",
        liked: "none",
        mediaUrl: attachments.images[0],
      });
    }

    if (attachments.audioRecording) {
      newMessages.push({
        id: generateUniqueId(),
        text: JSON.stringify({ audioRecording: attachments.audioRecording }),
        sender: "user",
        timestamp: Date.now(),
        mediaType: "audio",
        isAttachment: true,
        status: "sent",
        liked: "none",
        mediaUrl: attachments.audioRecording,
      });
    }

    if (attachments.documents?.length) {
      attachments.documents.forEach((doc) => {
        newMessages.push({
          id: generateUniqueId(),
          text: JSON.stringify({
            documents: [{ name: doc.name, uri: doc.uri }],
          }),
          sender: "user",
          timestamp: Date.now(),
          mediaType: "document",
          isAttachment: true,
          status: "sent",
          liked: "none",
          mediaUrl: doc.uri,
        });
      });
    }

    setChatMessages(newMessages);
    setCurrentMessage("");
    setAttachments({ images: [], audioRecording: undefined, documents: [] });

    handleAIHint();
  };

  const renderChatInput = () => (
    <View style={styles.chatInputWrapper}>
      {/* Render attachments preview */}
      {renderAttachments()}

      <View style={styles.chatInputInnerContainer}>
        <TextInput
          style={[
            styles.chatInput,
            {
              borderColor: dark ? COLORS.grayscale700 : COLORS.gray2,
              backgroundColor: dark ? COLORS.greyScale800 : COLORS.white,
              color: dark ? COLORS.white : COLORS.greyscale900,
            },
          ]}
          value={currentMessage}
          onChangeText={setCurrentMessage}
          placeholder="Demandez un indice ou l'aide..."
          placeholderTextColor={
            dark ? COLORS.greyscale500 : COLORS.grayscale700
          }
          multiline
          maxLength={500}
          textAlignVertical="top"
        />

        {/* Image picker button at the end of input */}
        <TouchableOpacity
          onPress={pickImage}
          style={styles.imageAttachmentButton}
        >
          <Feather name="image" size={24} color={COLORS.primary} />
        </TouchableOpacity>

        {/* Document picker button */}
        <TouchableOpacity
          onPress={pickDocument}
          style={styles.documentAttachmentButton}
        >
          <Feather name="file" size={24} color={COLORS.primary} />
        </TouchableOpacity>

        {/* Show microphone button when input is empty, otherwise show send button */}
        {currentMessage.trim() === "" &&
        attachments.images.length === 0 &&
        !attachments.audioRecording &&
        !attachments.documents?.length ? (
          <TouchableOpacity
            style={styles.microContainer}
            onPress={isRecording ? stopRecording : startRecording}
          >
            <MaterialCommunityIcons
              name={isRecording ? "stop" : "microphone"}
              size={24}
              color={COLORS.white}
            />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.sendButton}
            onPress={() => {
              sendChatMessage();
            }}
            disabled={
              currentMessage.trim() === "" &&
              attachments.images.length === 0 &&
              !attachments.audioRecording &&
              !attachments.documents?.length
            }
          >
            <MaterialCommunityIcons
              name="send"
              size={24}
              color={COLORS.white}
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  const renderChatModal = () => {
    return (
      <Modal
        animationType="slide"
        transparent={false}
        visible={isChatOpen}
        onRequestClose={() => setIsChatOpen(false)}
      >
        <View
          style={{
            flex: 1,
            paddingTop: insets.top,
            paddingBottom: insets.bottom,
            backgroundColor: dark ? COLORS.greyscale900 : COLORS.white,
          }}
        >
          <View style={styles.chatHeader}>
            <View
              style={[
                styles.chatHeaderTitleContainer,
                {
                  borderBottomColor: dark
                    ? COLORS.grayscale700
                    : COLORS.primary,
                },
              ]}
            >
              <View style={styles.aiAssistantTitleWrapper}>
                <Text style={styles.aiAssistantIcon}>🤖</Text>
                <Text
                  style={[
                    styles.chatHeaderText,
                    { color: dark ? COLORS.white : COLORS.greyscale900 },
                  ]}
                >
                  Assistant IA
                </Text>
              </View>
              <View style={styles.headerButtonsContainer}>
                <TouchableOpacity
                  style={[styles.headerButton, styles.toggleQuestionButton]}
                  onPress={() => setIsQuestionVisible(!isQuestionVisible)}
                >
                  <Text style={styles.headerButtonText}>
                    {isQuestionVisible
                      ? "Cacher la question"
                      : "Afficher la question"}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.headerButton,
                    styles.closeButton,
                    {
                      borderColor: dark ? COLORS.grayscale700 : COLORS.primary,
                    },
                  ]}
                  onPress={() => setIsChatOpen(false)}
                >
                  <Text
                    style={[
                      styles.headerButtonText,
                      { color: dark ? COLORS.white : COLORS.primary },
                    ]}
                  >
                    Fermer
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Question display area */}
            <ConditionalComponent isValid={isQuestionVisible}>
              <View
                style={[
                  styles.questionDisplayContainer,
                  {
                    backgroundColor: dark
                      ? COLORS.greyScale800
                      : COLORS.grayscale100,
                    borderBottomColor: dark
                      ? COLORS.grayscale700
                      : COLORS.primary,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.questionDisplayText,
                    { color: dark ? COLORS.white : COLORS.greyscale900 },
                  ]}
                >
                  {questions[currentQuestionIndex].text}
                </Text>
              </View>
            </ConditionalComponent>

            <KeyboardAvoidingView
              style={styles.chatKeyboardContainer}
              behavior={Platform.OS === "ios" ? "padding" : "height"}
              keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
            >
              <ScrollView
                style={styles.chatMessagesContainer}
                ref={(ref) => {
                  // Auto-scroll to bottom when messages update
                  if (ref) {
                    ref.scrollToEnd({ animated: true });
                  }
                }}
                contentContainerStyle={styles.chatMessagesContentContainer}
                keyboardShouldPersistTaps="handled"
              >
                {chatMessages.map((msg) => (
                  <LearningMessageBubble
                    key={msg.id}
                    message={msg}
                    onToggleLike={(messageId: string, action: string) => {
                      setChatMessages((prev) =>
                        prev.map((m) =>
                          m.id === messageId
                            ? {
                                ...m,
                                liked:
                                  action === "like"
                                    ? m.liked === "like"
                                      ? "none"
                                      : "like"
                                    : m.liked === "dislike"
                                      ? "none"
                                      : "dislike",
                              }
                            : m
                        )
                      );
                    }}
                    onRegenerate={() => {
                      if (msg.sender === "ai") {
                        handleAIHint();
                      }
                    }}
                  />
                ))}
              </ScrollView>
              {renderChatInput()}
            </KeyboardAvoidingView>
          </View>
        </View>
      </Modal>
    );
  };

  const formatUserAnswer = (question: Question, answer: any): string => {
    if (answer === undefined || answer === null) return "Pas de réponse";

    if (isMultipleChoiceQuestion(question)) {
      const selectedOption = question.options.find((opt) => opt.id === answer);
      return selectedOption ? selectedOption.text : "Sélection invalide";
    }

    if (isTrueOrFalseQuestion(question)) {
      return answer ? "Vrai" : "Faux";
    }

    if (isFillInBlankQuestion(question) || isShortAnswerQuestion(question)) {
      return answer.toString();
    }

    if (isSpeakingQuestion(question)) {
      return "Réponse audio enregistrée";
    }

    return answer.toString();
  };

  const renderSummaryModal = () => {
    return (
      <Modal
        animationType="slide"
        transparent={false}
        visible={isSummaryOpen}
        onRequestClose={() => setIsSummaryOpen(false)}
      >
        <View
          style={[
            styles.modalContainer,
            {
              paddingTop: insets.top,
              backgroundColor: dark ? COLORS.greyscale900 : COLORS.white,
            },
          ]}
        >
          <View
            style={[
              styles.modalHeader,
              {
                borderBottomColor: dark ? COLORS.grayscale700 : COLORS.primary,
              },
            ]}
          >
            <Text
              style={[
                styles.modalTitle,
                { color: dark ? COLORS.white : COLORS.greyscale900 },
              ]}
            >
              Résumé de l&apos;exercice
            </Text>
            <TouchableOpacity
              style={styles.closeModalButton}
              onPress={() => setIsSummaryOpen(false)}
            >
              <Text
                style={[
                  styles.closeModalText,
                  {
                    borderColor: dark ? COLORS.white : COLORS.primary,
                  },
                ]}
              >
                Fermer
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            style={[
              styles.summaryContent,
              { backgroundColor: dark ? COLORS.greyscale900 : COLORS.white },
            ]}
          >
            <Text
              style={[
                styles.summaryText,
                { color: dark ? COLORS.white : COLORS.greyscale900 },
              ]}
            >
              Vous avez répondu{" "}
              {userAnswers.filter((a) => a !== undefined).length} de{" "}
              {questions.length} questions.
            </Text>

            {questions.map((question, index) => (
              <View
                key={index}
                style={[
                  styles.summaryQuestion,
                  {
                    borderBottomColor: dark
                      ? COLORS.grayscale700
                      : COLORS.primary,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.summaryQuestionText,
                    { color: dark ? COLORS.white : COLORS.greyscale900 },
                  ]}
                >
                  Q{index + 1}: {question.text}
                </Text>
                <Text
                  style={[
                    styles.summaryAnswerStatus,
                    userAnswers[index] === undefined
                      ? [
                          styles.unanswered,
                          { color: dark ? COLORS.error : COLORS.error },
                        ]
                      : [
                          styles.answered,
                          { color: dark ? COLORS.success : COLORS.success },
                        ],
                  ]}
                >
                  {userAnswers[index] === undefined
                    ? "Pas de réponse"
                    : `Votre Réponse: ${formatUserAnswer(question, userAnswers[index])}`}
                </Text>
              </View>
            ))}
          </ScrollView>
        </View>
      </Modal>
    );
  };

  const renderQuestion = (question: Question, index: number) => {
    switch (question.type) {
      case "multipleChoice":
        return renderMultipleChoice(question as MultipleChoiceQuestion, index);
      case "trueOrFalse":
        return renderTrueOrFalse(question as TrueOrFalseQuestion, index);
      case "fillInBlank":
        return renderFillInBlank(question as FillInBlankQuestion, index);
      case "shortAnswer":
        return renderShortAnswer(question as ShortAnswerQuestion, index);
      case "speaking":
        return renderSpeaking(question as SpeakingQuestion);
      default:
        return null;
    }
  };

  return (
    <ScrollView
      style={[
        styles.container,
        { backgroundColor: dark ? COLORS.greyscale900 : COLORS.white },
      ]}
    >
      {/* AI Chat and Summary Buttons */}
      <View style={styles.topButtonsContainer}>
        <TouchableOpacity
          style={[styles.topButton, styles.aiChatButton]}
          onPress={() => setIsChatOpen(true)}
        >
          <Text style={styles.topButtonText}>🤖 Assistant IA</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.topButton, styles.summaryButton]}
          onPress={() => setIsSummaryOpen(true)}
        >
          <Text style={styles.topButtonText}>📊 Vos réponses</Text>
        </TouchableOpacity>
      </View>

      {/* Second Row - Réviser */}
      <View style={styles.bottomButtonContainer}>
        <TouchableOpacity
          style={[styles.reviserButton]}
          onPress={() => navigation.navigate("reviewlesson", { module })}
        >
          <Text style={styles.buttonText}>Réviser</Text>
        </TouchableOpacity>
      </View>

      {/* Render AI Chat Modal */}
      {renderChatModal()}

      {/* Render Summary Modal */}
      {renderSummaryModal()}

      {questions && questions.length > 0 ? (
        renderQuestion(questions[currentQuestionIndex], currentQuestionIndex)
      ) : (
        <Text style={{ color: dark ? COLORS.white : COLORS.greyscale900 }}>
          Pas de questions disponibles pour ce sujet.
        </Text>
      )}

      <View style={styles.navigationContainer}>
        <ConditionalComponent isValid={currentQuestionIndex > 0}>
          <TouchableOpacity
            style={[
              styles.navigationButton,
              { borderColor: dark ? COLORS.white : COLORS.primary },
            ]}
            onPress={() => setCurrentQuestionIndex(currentQuestionIndex - 1)}
          >
            <Text
              style={[
                styles.navigationButtonText,
                { color: dark ? COLORS.white : COLORS.primary },
              ]}
            >
              Précédent
            </Text>
          </TouchableOpacity>
        </ConditionalComponent>

        {currentQuestionIndex < questions.length - 1 ? (
          <View style={{ alignItems: "flex-end", flex: 1 }}>
            <TouchableOpacity
              style={styles.nextNavigationButton}
              onPress={() => setCurrentQuestionIndex(currentQuestionIndex + 1)}
            >
              <Text style={styles.nextButtonText}>Suivant</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            style={styles.submitButton}
            onPress={() => setIsChatOpen(true)}
          >
            <Text style={styles.submitButtonText}>Enregistrer</Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: COLORS.white,
  },
  bottomButtonContainer: {
    alignItems: "center",
    marginBottom: 16,
  },
  reviserButton: {
    width: "50%",
    padding: 12,
    borderRadius: 8,
    backgroundColor: COLORS.primary,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  questionContainer: {
    marginBottom: 20,
  },
  questionText: {
    fontSize: 18,
    fontFamily: "bold",
    marginBottom: 10,
  },
  optionButton: {
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS.gray,
    borderRadius: 8,
    marginVertical: 5,
  },
  documentAttachmentButton: {
    position: "absolute",
    right: 110,
    top: 0,
    padding: 8,
  },
  documentAttachment: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.grayscale100,
    padding: 10,
    borderRadius: 10,
  },
  documentAttachmentText: {
    marginLeft: 10,
    color: COLORS.primary,
    maxWidth: 100,
  },
  optionText: {
    textAlign: "center",
    fontFamily: "medium",
  },
  booleanContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  booleanButton: {
    flex: 0.48,
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS.gray,
    borderRadius: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: COLORS.gray,
    borderRadius: 8,
    padding: 10,
    minHeight: 100,
  },
  guidanceText: {
    fontStyle: "italic",
    color: COLORS.grayscale700,
    marginVertical: 10,
  },
  recordButton: {
    backgroundColor: COLORS.primary,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  recordButtonText: {
    color: COLORS.white,
    fontFamily: "bold",
  },
  navigationContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  navigationButton: {
    borderWidth: 2,
    borderColor: COLORS.primary,
    padding: 12,
    borderRadius: 8,
    backgroundColor: "transparent",
    flex: 0.48,
  },
  nextNavigationButton: {
    padding: 12,
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    minWidth: 150,
    alignItems: "center",
  },
  navigationButtonText: {
    textAlign: "center",
    fontFamily: "bold",
    color: COLORS.primary,
    fontWeight: "bold",
  },
  nextButtonText: {
    color: COLORS.white,
    textAlign: "center",
    fontFamily: "bold",
    fontWeight: "bold",
  },
  submitButton: {
    backgroundColor: COLORS.primary,
    padding: 12,
    borderRadius: 8,
    flex: 0.48,
  },
  submitButtonText: {
    color: COLORS.white,
    textAlign: "center",
    fontFamily: "bold",
    fontWeight: "bold",
  },
  aiChatButton: {
    backgroundColor: COLORS.primary,
  },
  chatHeader: {
    flex: 1,
  },
  chatHeaderTitleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.primary,
  },
  aiAssistantTitleWrapper: {
    flexDirection: "row",
    alignItems: "center",
  },
  aiAssistantIcon: {
    fontSize: 24,
    marginRight: 10,
  },
  chatHeaderText: {
    fontSize: 18,
    fontFamily: "bold",
    color: COLORS.greyscale900,
  },
  chatMessagesContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingBottom: 10,
  },
  chatMessagesContentContainer: {
    paddingVertical: 16,
    paddingBottom: 20,
  },
  chatInputWrapper: {
    borderTopWidth: 1,
    borderTopColor: COLORS.primary,
    paddingTop: 20,
    backgroundColor: COLORS.white,
  },
  chatKeyboardContainer: {
    flex: 1,
  },
  chatInputInnerContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingBottom: 10,
  },
  chatInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: COLORS.gray2,
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    paddingRight: 40,
    marginLeft: 8,
    marginRight: 8,
    maxHeight: 100,
  },
  imageAttachmentButton: {
    position: "absolute",
    right: 70,
    top: 0,
    padding: 8,
  },
  attachmentsScrollContent: {
    alignItems: "center",
  },
  attachmentItem: {
    position: "relative",
    marginRight: 10,
  },
  removeImageAttachmentButton: {
    position: "absolute",
    top: 0,
    right: 1,
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  removeAttachmentButton: {
    position: "absolute",
    top: 0,
    right: -12,
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  sendButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 50,
    padding: 8,
    marginLeft: 8,
  },
  headerButtonsContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginLeft: 8,
  },
  toggleQuestionButton: {
    backgroundColor: COLORS.secondary,
  },
  closeButton: {
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  headerButtonText: {
    fontFamily: "medium",
    fontSize: 12,
  },
  questionDisplayContainer: {
    padding: 16,
    backgroundColor: COLORS.grayscale100,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.primary,
  },
  questionDisplayText: {
    fontFamily: "medium",
    fontSize: 16,
    color: COLORS.greyscale900,
  },
  topButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
    gap: 10,
  },
  topButton: {
    flex: 1,
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 5,
    minHeight: 30,
  },
  topButtonText: {
    color: COLORS.white,
    fontWeight: "bold",
  },
  summaryButton: {
    backgroundColor: COLORS.secondary,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.primary,
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: "bold",
    color: COLORS.greyscale900,
  },
  closeModalButton: {
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: COLORS.primary,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  closeModalText: {
    color: COLORS.primary,
    fontFamily: "medium",
    fontSize: 14,
  },
  summaryContent: {
    padding: 16,
  },
  summaryText: {
    fontSize: 16,
    fontFamily: "medium",
    marginBottom: 20,
    color: COLORS.greyscale900,
  },
  summaryQuestion: {
    marginBottom: 15,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.primary,
  },
  summaryQuestionText: {
    fontSize: 16,
    fontFamily: "medium",
    marginBottom: 5,
    color: COLORS.greyscale900,
  },
  summaryAnswerStatus: {
    fontSize: 14,
    fontFamily: "medium",
    flexShrink: 1,
  },
  answered: {
    color: COLORS.success,
  },
  unanswered: {
    color: COLORS.error,
  },
  microContainer: {
    backgroundColor: COLORS.primary,
    borderRadius: 50,
    padding: 8,
    marginLeft: 8,
  },
  attachmentsContainer: {
    maxHeight: 100,
    paddingHorizontal: 10,
    marginBottom: 5,
  },
  attachmentImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 10,
  },
  audioAttachment: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.grayscale100,
    padding: 10,
    borderRadius: 10,
  },
  audioAttachmentText: {
    marginLeft: 10,
    color: COLORS.primary,
  },
});

export default ExerciseComponent;
