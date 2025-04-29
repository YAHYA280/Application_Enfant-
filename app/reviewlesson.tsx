import type { Module } from "@/data";
import type { RouteProp, NavigationProp } from "@react-navigation/native";

import React, { useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRoute, useTheme, useNavigation } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";
import {
  View,
  Text,
  Animated,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

// Import composants
import HeaderTabs from "@/components/reviewlesson/HeaderTabs";
import VideoContent from "@/components/reviewlesson/VideoContent";
import MaterialsContent from "@/components/reviewlesson/MaterialsContent";
import { COLORS } from "@/constants";

type RootStackParamList = {
  reviewlesson: { module: Module };
};

const ReviewLesson = () => {
  const route = useRoute<RouteProp<RootStackParamList, "reviewlesson">>();
  const { module } = route.params;
  const navigation = useNavigation<NavigationProp<any>>();
  const { colors, dark } = useTheme();
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

  return (
    <SafeAreaView style={[styles.area, { backgroundColor: colors.background }]}>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        {/* Animated Header */}
        <Animated.View
          style={[
            styles.headerBackground,
            {
              opacity: headerOpacity,
              backgroundColor: dark ? COLORS.dark1 : "#FFFFFF",
            },
          ]}
        >
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButtonFixed}
          >
            <Feather
              name="arrow-left"
              size={24}
              color={dark ? COLORS.white : COLORS.black}
            />
          </TouchableOpacity>
          <Text
            style={[
              styles.headerTitle,
              { color: dark ? COLORS.white : COLORS.black },
            ]}
          >
            {module.name} - Réviser
          </Text>
        </Animated.View>

        <Animated.ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: false }
          )}
          scrollEventThrottle={16}
        >
          {/* Header */}
          <View style={styles.heroContainer}>
            <LinearGradient
              colors={dark ? ["#ff6040", "#ff8e69"] : ["#ff6040", "#ff8e69"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.heroGradient}
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

          <View
            style={[
              styles.contentContainer,
              { backgroundColor: dark ? COLORS.dark1 : "#FFFFFF" },
            ]}
          >
            {/* Tab Navigation */}
            <HeaderTabs
              selectedTab={selectedTab}
              setSelectedTab={setSelectedTab}
              dark={dark}
            />

            {/* Tab Content */}
            {selectedTab === "video" ? (
              <VideoContent module={module} dark={dark} />
            ) : (
              <MaterialsContent dark={dark} />
            )}
          </View>
        </Animated.ScrollView>

        {/* Enhanced Floating Action Button with text */}
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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  area: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  headerBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 60,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    zIndex: 100,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: "bold",
    marginLeft: 32,
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
    paddingTop: 60,
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
  },
  floatingButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
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
