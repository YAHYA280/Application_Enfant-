import type { RouteProp, NavigationProp } from "@react-navigation/native";

import React, { useEffect, useRef } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRoute, useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Easing,
} from "react-native";

import type { Challenge } from "@/services/mock";

import { icons, COLORS } from "@/constants";
import { useTheme } from "@/theme/ThemeProvider";
import ChallengeHeader from "@/components/challenge/ChallengeHeader";

type RootStackParamList = {
  recompenseMessage: {
    challenge: Challenge;
    score: number;
    totalPossibleScore: number;
  };
  challengedetailsmore: {
    challenge: Challenge;
  };
};

const RecompenseMessage = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, "recompenseMessage">>();
  const { challenge, score, totalPossibleScore } = route.params;
  const { colors, dark } = useTheme();

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

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      {/* Header */}
      <ChallengeHeader
        title={challenge.nom}
        onBackPress={() =>
          navigation.navigate("challengedetailsmore", { challenge })
        }
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
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
              colors={[resultStyle.color, dark ? colors.background : "#FFF"]}
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
              style={[
                styles.messageText,
                { color: dark ? COLORS.white : COLORS.greyscale900 },
              ]}
            >
              {message}
            </Text>
          </View>

          {/* Performance tips */}
          <View style={styles.tipsContainer}>
            <Text
              style={[
                styles.tipsTitle,
                { color: dark ? COLORS.white : COLORS.greyscale900 },
              ]}
            >
              {isSuccess ? "Continuez comme ça!" : "Conseils pour s'améliorer"}
            </Text>

            <View style={styles.tipsList}>
              {isSuccess ? (
                <>
                  <View style={styles.tipItem}>
                    <Text
                      style={[
                        styles.tipText,
                        {
                          color: dark
                            ? COLORS.greyscale500
                            : COLORS.greyscale600,
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
                          color: dark
                            ? COLORS.greyscale500
                            : COLORS.greyscale600,
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
                          color: dark
                            ? COLORS.greyscale500
                            : COLORS.greyscale600,
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
                          color: dark
                            ? COLORS.greyscale500
                            : COLORS.greyscale600,
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
                          color: dark
                            ? COLORS.greyscale500
                            : COLORS.greyscale600,
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

      {/* Continue button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.continueButton}
          onPress={() =>
            navigation.navigate("challengedetailsmore", { challenge })
          }
        >
          <LinearGradient
            colors={["#ff6040", "#ff8e69"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.buttonGradient}
          >
            <Text style={styles.continueButtonText}>Retour au challenge</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingBottom: 100,
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
  continueButton: {
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  buttonGradient: {
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  continueButtonText: {
    fontSize: 18,
    fontFamily: "bold",
    color: COLORS.white,
  },
});

export default RecompenseMessage;
