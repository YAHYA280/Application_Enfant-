import type { RouteProp, NavigationProp } from "@react-navigation/native";

import React, { useRef, useEffect } from "react";
import { LinearGradient } from "expo-linear-gradient";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { useRoute, useNavigation } from "@react-navigation/native";
import {
  View,
  Text,
  Easing,
  Animated,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from "react-native";

import type { Challenge } from "@/services/mock";

import { COLORS } from "@/constants";
import { useTheme } from "@/theme/ThemeProvider";
import ChallengeHeader from "@/components/challenge/ChallengeHeader";

type RootStackParamList = {
  ChallengeResultScreen: {
    challenge: Challenge;
    score: number;
    totalPossibleScore: number;
  };
  ChallengeDetailsScreen: {
    challenge: Challenge;
  };
  ChallengeListScreen: undefined;
};

const ChallengeResultScreen = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const route =
    useRoute<RouteProp<RootStackParamList, "ChallengeResultScreen">>();
  const { challenge, score, totalPossibleScore } = route.params;
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  const successThreshold = totalPossibleScore * 0.7;
  const isSuccess = score >= successThreshold;

  const message = isSuccess
    ? challenge.messageReuse // Success message
    : challenge.messageFailed; // Failure message

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.5)).current;
  const confettiAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Animate content
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();

    // Animate confetti for success
    if (isSuccess) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(confettiAnim, {
            toValue: 1,
            duration: 1500,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
          Animated.timing(confettiAnim, {
            toValue: 0,
            duration: 0,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [fadeAnim, scaleAnim, confettiAnim, isSuccess]);

  // Calculate score percentage
  const scorePercentage = Math.round((score / totalPossibleScore) * 100);

  // Get message and style based on score
  const getResultStyle = () => {
    if (scorePercentage >= 90) return { color: "#4CAF50", text: "Excellent!" };
    if (scorePercentage >= 70) return { color: "#8BC34A", text: "Très bien!" };
    if (scorePercentage >= 50) return { color: "#FFC107", text: "Bien!" };
    return { color: "#FF5722", text: "À améliorer" };
  };

  const resultStyle = getResultStyle();
  const bottomPadding = Math.max(insets.bottom, 16);

  // Calculate header height to add proper top padding
  const headerHeight =
    Platform.OS === "ios"
      ? insets.top + 8 + 44 + 12
      : Math.max(insets.top + 8, 32) + 44 + 12;

  const handleBackToChallenge = () => {
    // Reset navigation stack to avoid loops
    navigation.reset({
      index: 1,
      routes: [
        { name: "ChallengeListScreen" },
        { name: "ChallengeDetailsScreen", params: { challenge } },
      ],
    });
  };

  const handleBackToHome = () => {
    // Navigate to challenge list and reset stack
    navigation.reset({
      index: 0,
      routes: [{ name: "ChallengeListScreen" }],
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <ChallengeHeader
        title={challenge.nom}
        onBackPress={handleBackToChallenge}
      />

      {/* Main container with proper top padding */}
      <View
        style={[
          styles.mainContainer,
          {
            paddingTop: headerHeight,
            paddingBottom: bottomPadding,
          },
        ]}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: 160 + bottomPadding }, // Extra space for buttons
          ]}
          showsVerticalScrollIndicator={false}
        >
          {/* Success confetti animation (conditional) */}
          {isSuccess && (
            <View style={styles.confettiContainer}>
              {[...Array(20)].map((_, i) => {
                const randomLeft = Math.random() * 100;
                const randomSize = Math.random() * 15 + 5;
                const randomRotate = Math.random() * 360;
                const randomDelay = Math.random() * 2;
                const randomColor = [
                  "#FFC107",
                  "#FF5722",
                  "#8BC34A",
                  "#03A9F4",
                  "#E91E63",
                  "#9C27B0",
                  "#FFEB3B",
                  "#FF9800",
                ][Math.floor(Math.random() * 8)];

                return (
                  <Animated.View
                    key={i}
                    style={{
                      position: "absolute",
                      left: `${randomLeft}%`,
                      top: 0,
                      width: randomSize,
                      height: randomSize,
                      backgroundColor: randomColor,
                      borderRadius: randomSize / 2,
                      transform: [
                        {
                          translateY: confettiAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: [-50, 600 + randomDelay * 200],
                          }),
                        },
                        { rotate: `${randomRotate}deg` },
                      ],
                      opacity: confettiAnim.interpolate({
                        inputRange: [0, 0.6, 1],
                        outputRange: [1, 1, 0],
                      }),
                    }}
                  />
                );
              })}
            </View>
          )}

          {/* Main content */}
          <Animated.View
            style={[
              styles.contentContainer,
              {
                opacity: fadeAnim,
                transform: [{ scale: scaleAnim }],
              },
            ]}
          >
            {/* Avatar/Emoji */}
            <View
              style={[
                styles.emojiContainer,
                {
                  backgroundColor: isSuccess
                    ? "rgba(76, 175, 80, 0.1)"
                    : "rgba(255, 152, 0, 0.1)",
                },
              ]}
            >
              <Text style={styles.emojiText}>{isSuccess ? "🎉" : "💪"}</Text>
            </View>

            {/* Score display */}
            <View style={styles.scoreContainer}>
              <LinearGradient
                colors={[resultStyle.color, "#FFF"]}
                start={{ x: 0.5, y: 0 }}
                end={{ x: 0.5, y: 1 }}
                style={styles.scoreGradient}
              >
                <Text style={styles.scoreTitle}>{resultStyle.text}</Text>
                <Text style={styles.scoreValue}>
                  {score} / {totalPossibleScore}
                </Text>
                <Text style={styles.scorePercentage}>{scorePercentage}%</Text>
              </LinearGradient>
            </View>

            {/* Message */}
            <View style={styles.messageContainer}>
              <Text
                style={[styles.messageText, { color: COLORS.greyscale900 }]}
              >
                {message}
              </Text>
            </View>

            {/* Performance tips */}
            <View style={styles.tipsContainer}>
              <Text style={[styles.tipsTitle, { color: COLORS.greyscale900 }]}>
                {isSuccess
                  ? "Continuez comme ça!"
                  : "Conseils pour s'améliorer"}
              </Text>

              <View style={styles.tipsList}>
                {isSuccess ? (
                  <>
                    <View style={styles.tipItem}>
                      <Text
                        style={[
                          styles.tipText,
                          {
                            color: COLORS.greyscale600,
                          },
                        ]}
                      >
                        • Essayez d&apos;autres challenges pour continuer à
                        progresser
                      </Text>
                    </View>
                    <View style={styles.tipItem}>
                      <Text
                        style={[
                          styles.tipText,
                          {
                            color: COLORS.greyscale600,
                          },
                        ]}
                      >
                        • Partagez vos connaissances avec vos amis
                      </Text>
                    </View>
                  </>
                ) : (
                  <>
                    <View style={styles.tipItem}>
                      <Text
                        style={[
                          styles.tipText,
                          {
                            color: COLORS.greyscale600,
                          },
                        ]}
                      >
                        • Révisez les questions que vous avez manquées
                      </Text>
                    </View>
                    <View style={styles.tipItem}>
                      <Text
                        style={[
                          styles.tipText,
                          {
                            color: COLORS.greyscale600,
                          },
                        ]}
                      >
                        • Prenez votre temps pour bien lire les questions
                      </Text>
                    </View>
                    <View style={styles.tipItem}>
                      <Text
                        style={[
                          styles.tipText,
                          {
                            color: COLORS.greyscale600,
                          },
                        ]}
                      >
                        • N&apos;hésitez pas à réessayer pour améliorer votre
                        score
                      </Text>
                    </View>
                  </>
                )}
              </View>
            </View>
          </Animated.View>
        </ScrollView>

        {/* Action buttons */}
        <View style={[styles.buttonContainer, { bottom: bottomPadding }]}>
          <TouchableOpacity
            style={[styles.actionButton, styles.secondaryButton]}
            onPress={handleBackToHome}
          >
            <Text style={styles.secondaryButtonText}>
              Voir plus de challenges
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.primaryButton]}
            onPress={handleBackToChallenge}
          >
            <LinearGradient
              colors={["#ff6040", "#ff8e69"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.buttonGradient}
            >
              <Text style={styles.primaryButtonText}>Retour au challenge</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mainContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  confettiContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 10,
    pointerEvents: "none",
  },
  contentContainer: {
    flex: 1,
    alignItems: "center",
    paddingTop: 20,
  },
  emojiContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 30,
  },
  emojiText: {
    fontSize: 60,
  },
  scoreContainer: {
    width: "100%",
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    marginBottom: 30,
  },
  scoreGradient: {
    padding: 24,
    alignItems: "center",
  },
  scoreTitle: {
    fontSize: 24,
    fontFamily: "bold",
    color: "white",
    marginBottom: 12,
    textShadowColor: "rgba(0,0,0,0.2)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  scoreValue: {
    fontSize: 36,
    fontFamily: "bold",
    color: "white",
    marginBottom: 8,
    textShadowColor: "rgba(0,0,0,0.2)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 3,
  },
  scorePercentage: {
    fontSize: 20,
    fontFamily: "semiBold",
    color: "white",
    opacity: 0.9,
  },
  messageContainer: {
    width: "100%",
    padding: 20,
    marginBottom: 30,
  },
  messageText: {
    fontSize: 18,
    fontFamily: "medium",
    lineHeight: 28,
    textAlign: "center",
  },
  tipsContainer: {
    width: "100%",
    padding: 20,
  },
  tipsTitle: {
    fontSize: 20,
    fontFamily: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  tipsList: {
    width: "100%",
  },
  tipItem: {
    marginBottom: 12,
  },
  tipText: {
    fontSize: 16,
    fontFamily: "regular",
    lineHeight: 24,
  },
  buttonContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: "transparent",
  },
  actionButton: {
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 12,
  },
  primaryButton: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  secondaryButton: {
    backgroundColor: COLORS.tertiaryWhite,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.1)",
  },
  buttonGradient: {
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryButtonText: {
    fontSize: 18,
    fontFamily: "bold",
    color: COLORS.white,
  },
  secondaryButtonText: {
    fontSize: 16,
    fontFamily: "semiBold",
    color: COLORS.black,
    paddingVertical: 16,
    textAlign: "center",
  },
});

export default ChallengeResultScreen;
