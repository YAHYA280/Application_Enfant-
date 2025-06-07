import type { RouteProp, NavigationProp } from "@react-navigation/native";

import React, { useState } from "react";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { useRoute, useNavigation } from "@react-navigation/native";
import {
  View,
  Text,
  Animated,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Platform,
} from "react-native";

import type { Module } from "@/data";

import { COLORS } from "@/constants";
// Import composants
import HeaderTabs from "@/components/reviewlesson/HeaderTabs";
import VideoContent from "@/components/reviewlesson/VideoContent";
import MaterialsContent from "@/components/reviewlesson/MaterialsContent";

type RootStackParamList = {
  reviewlesson: { module: Module };
};

const ReviewLesson = () => {
  const route = useRoute<RouteProp<RootStackParamList, "reviewlesson">>();
  const { module } = route.params;
  const navigation = useNavigation<NavigationProp<any>>();
  const insets = useSafeAreaInsets();
  const [selectedTab, setSelectedTab] = useState<"video" | "materials">(
    "video"
  );

  // Animation value for header
  const scrollY = React.useRef(new Animated.Value(0)).current;
  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 60],
    outputRange: [0, 1],
    extrapolate: "clamp",
  });

  // Calculate header height including safe area
  const headerHeight = 60;
  const totalHeaderHeight = headerHeight + insets.top;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />

      {/* Animated Header */}
      <Animated.View
        style={[
          styles.headerBackground,
          {
            opacity: headerOpacity,
            backgroundColor: COLORS.white,
            height: totalHeaderHeight,
            paddingTop: insets.top,
          },
        ]}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButtonFixed}
          >
            <Feather name="arrow-left" size={24} color={COLORS.greyscale900} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{module.name} - Réviser</Text>
        </View>
      </Animated.View>

      <Animated.ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: Math.max(insets.bottom, 100) },
        ]}
      >
        {/* Header */}
        <View style={styles.heroContainer}>
          <LinearGradient
            colors={["#ff6040", "#ff8e69"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[
              styles.heroGradient,
              {
                paddingTop: insets.top + 60, // Account for status bar + extra padding
              },
            ]}
          >
            <View style={styles.heroContent}>
              <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={styles.backButton}
              >
                <Feather name="arrow-left" size={24} color="#FFFFFF" />
              </TouchableOpacity>

              <View>
                <Text style={styles.moduleTitle}>{module.name}</Text>
                <Text style={styles.lessonTitle}>Matérial de révision</Text>
              </View>

              <View style={styles.progressIndicator}>
                <Text style={styles.progressText}>
                  6 ressources disponibles
                </Text>
              </View>
            </View>
          </LinearGradient>
        </View>

        <View style={styles.contentContainer}>
          {/* Tab Navigation */}
          <HeaderTabs
            selectedTab={selectedTab}
            setSelectedTab={setSelectedTab}
          />

          {/* Tab Content */}
          {selectedTab === "video" ? (
            <VideoContent module={module} />
          ) : (
            <MaterialsContent />
          )}
        </View>
      </Animated.ScrollView>

      {/* Enhanced Floating Action Button with text */}
      <View
        style={[
          styles.floatingButtonContainer,
          { bottom: Math.max(insets.bottom, 20) },
        ]}
      >
        <TouchableOpacity style={styles.floatingButton}>
          <LinearGradient
            colors={["#ff6040", "#ff8e69"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.floatingButtonGradient}
          >
            <Text style={styles.floatingButtonText}>Continuer</Text>
            <Feather name="arrow-right" size={20} color="#FFFFFF" />
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  headerBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5,
  },
  headerContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    height: 60,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: "bold",
    marginLeft: 32,
    color: COLORS.greyscale900,
    flex: 1,
  },
  backButtonFixed: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  heroContainer: {
    width: "100%",
    overflow: "hidden",
  },
  heroGradient: {
    paddingBottom: 30,
  },
  heroContent: {
    paddingHorizontal: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  moduleTitle: {
    color: "rgba(255,255,255,0.9)",
    fontSize: 16,
    fontFamily: "medium",
    marginBottom: 8,
  },
  lessonTitle: {
    color: "#FFFFFF",
    fontSize: 24,
    fontFamily: "bold",
    marginBottom: 20,
  },
  progressIndicator: {
    marginTop: 15,
  },
  progressText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontFamily: "medium",
    textAlign: "right",
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 16,
    marginTop: -20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: COLORS.white,
  },
  floatingButtonContainer: {
    position: "absolute",
    right: 20,
  },
  floatingButton: {
    borderRadius: 28,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  floatingButtonGradient: {
    flexDirection: "row",
    paddingVertical: 14,
    paddingHorizontal: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  floatingButtonText: {
    color: "#FFFFFF",
    fontFamily: "bold",
    fontSize: 16,
    marginRight: 8,
  },
});

export default ReviewLesson;
