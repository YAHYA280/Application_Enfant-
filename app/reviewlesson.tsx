import type { Module } from "@/data";
import type { AVPlaybackStatus } from "expo-av";
import type { RouteProp, NavigationProp } from "@react-navigation/native";

import { Video, ResizeMode } from "expo-av";
import { icons, COLORS } from "@/constants";
import { Feather } from "@expo/vector-icons";
import React, { useRef, useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRoute, useTheme, useNavigation } from "@react-navigation/native";
import {
  View,
  Text,
  Image,
  FlatList,
  Animated,
  Platform,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from "react-native";

const { width } = Dimensions.get("window");

const videoUrl =
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";
const thumbnailUrl =
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/BigBuckBunny.jpg";

const lessonMaterials = [
  {
    id: "1",
    type: "pdf",
    title: "Lesson Notes",
    size: "2.4 MB",
    icon: icons.pdf,
    description: "Detailed notes covering all key concepts from this lesson",
  },
  {
    id: "2",
    type: "image",
    title: "Diagram 1: System Architecture",
    size: "1.1 MB",
    icon: icons.image,
    description: "Visual representation of the system architecture",
  },
  {
    id: "3",
    type: "doc",
    title: "Exercise Instructions",
    size: "540 KB",
    icon: icons.document,
    description: "Step-by-step instructions for completing practice exercises",
  },
  {
    id: "4",
    type: "pdf",
    title: "Reference Guide",
    size: "3.7 MB",
    icon: icons.pdf,
    description: "Comprehensive reference material for advanced study",
  },
  {
    id: "5",
    type: "image",
    title: "Diagram 2: Process Flow",
    size: "890 KB",
    icon: icons.image,
    description: "Visualization of the key processes and workflows",
  },
  {
    id: "6",
    type: "pdf",
    title: "Additional Resources",
    size: "1.8 MB",
    icon: icons.pdf,
    description: "Supplementary materials for further learning",
  },
];

type MaterialItem = {
  id: string;
  type: string;
  title: string;
  size: string;
  icon: any;
  description: string;
};

const ReviewLesson = () => {
  const route = useRoute<RouteProp<{ params: { module: Module } }>>();
  const { module } = route.params;
  const navigation = useNavigation<NavigationProp<any>>();
  const videoRef = useRef<Video>(null);
  const [isPlaying, setIsPlaying] = useState(false);
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

  const togglePlayPause = async () => {
    if (isPlaying) {
      await videoRef.current?.pauseAsync();
    } else {
      await videoRef.current?.playAsync();
    }
  };

  const handlePlaybackStatusUpdate = (status: AVPlaybackStatus) => {
    if (!status.isLoaded) return;
    setIsPlaying(status.isPlaying);
  };

  const renderMaterialItem = ({ item }: { item: MaterialItem }) => (
    <View
      style={[
        styles.materialItem,
        { backgroundColor: dark ? COLORS.dark2 : COLORS.white },
      ]}
    >
      <View style={styles.materialItemContent}>
        <View
          style={[
            styles.materialIconContainer,
            {
              backgroundColor: dark
                ? "rgba(255, 142, 105, 0.2)"
                : "rgba(255, 142, 105, 0.1)",
            },
          ]}
        >
          <Image
            source={item.icon}
            style={[styles.materialIcon, { tintColor: COLORS.primary }]}
            resizeMode="contain"
          />
        </View>

        <View style={styles.materialInfo}>
          <Text
            style={[
              styles.materialTitle,
              { color: dark ? COLORS.white : COLORS.greyscale900 },
            ]}
          >
            {item.title}
          </Text>
          <Text
            style={[
              styles.materialDescription,
              { color: dark ? COLORS.greyscale500 : COLORS.greyScale800 },
            ]}
            numberOfLines={2}
          >
            {item.description}
          </Text>
          <Text style={styles.materialMeta}>
            {item.type.toUpperCase()} • {item.size}
          </Text>
        </View>

        <TouchableOpacity
          style={[
            styles.downloadButton,
            { backgroundColor: dark ? COLORS.dark3 : "rgba(0,0,0,0.05)" },
          ]}
        >
          <Feather name="download" size={20} color={COLORS.primary} />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={[styles.area, { backgroundColor: colors.background }]}>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        {/* Animated Header */}
        <Animated.View
          style={[
            styles.headerBackground,
            {
              opacity: headerOpacity,
              backgroundColor: dark ? COLORS.dark1 : COLORS.white,
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
              colors={dark ? ["#336699", "#4477aa"] : ["#4477aa", "#5588bb"]}
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
                  <Text style={styles.lessonTitle}>Matériaux de révision</Text>
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
            <View style={styles.tabContainer}>
              <TouchableOpacity
                style={[
                  styles.tabButton,
                  selectedTab === "video" && styles.activeTabButton,
                  {
                    borderBottomColor:
                      selectedTab === "video" ? COLORS.primary : "transparent",
                  },
                ]}
                onPress={() => setSelectedTab("video")}
              >
                <Feather
                  name="video"
                  size={20}
                  color={
                    selectedTab === "video"
                      ? COLORS.primary
                      : dark
                        ? COLORS.greyscale500
                        : COLORS.greyScale800
                  }
                />
                <Text
                  style={[
                    styles.tabText,
                    selectedTab === "video" && styles.activeTabText,
                    {
                      color:
                        selectedTab === "video"
                          ? COLORS.primary
                          : dark
                            ? COLORS.greyscale500
                            : COLORS.greyScale800,
                    },
                  ]}
                >
                  Vidéo de cours
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.tabButton,
                  selectedTab === "materials" && styles.activeTabButton,
                  {
                    borderBottomColor:
                      selectedTab === "materials"
                        ? COLORS.primary
                        : "transparent",
                  },
                ]}
                onPress={() => setSelectedTab("materials")}
              >
                <Feather
                  name="file-text"
                  size={20}
                  color={
                    selectedTab === "materials"
                      ? COLORS.primary
                      : dark
                        ? COLORS.greyscale500
                        : COLORS.greyScale800
                  }
                />
                <Text
                  style={[
                    styles.tabText,
                    selectedTab === "materials" && styles.activeTabText,
                    {
                      color:
                        selectedTab === "materials"
                          ? COLORS.primary
                          : dark
                            ? COLORS.greyscale500
                            : COLORS.greyScale800,
                    },
                  ]}
                >
                  Supports de cours
                </Text>
              </TouchableOpacity>
            </View>

            {/* Tab Content */}
            {selectedTab === "video" ? (
              <View style={styles.videoTabContent}>
                <View style={styles.videoWrapper}>
                  <View style={styles.videoContainer}>
                    <Video
                      ref={videoRef}
                      style={styles.video}
                      source={{ uri: videoUrl }}
                      resizeMode={ResizeMode.CONTAIN}
                      isLooping={false}
                      onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
                      useNativeControls={Platform.OS !== "web"}
                    />

                    {!isPlaying ? (
                      <TouchableOpacity
                        style={styles.thumbnailContainer}
                        onPress={togglePlayPause}
                        activeOpacity={0.9}
                      >
                        <Image
                          source={{ uri: thumbnailUrl }}
                          style={styles.thumbnail}
                          resizeMode="cover"
                        />
                        <View style={styles.playButtonOverlay}>
                          <TouchableOpacity
                            style={styles.playButton}
                            onPress={togglePlayPause}
                          >
                            <Feather
                              name="play"
                              size={24}
                              color={COLORS.primary}
                            />
                          </TouchableOpacity>
                        </View>
                      </TouchableOpacity>
                    ) : null}
                  </View>
                </View>

                <View
                  style={[
                    styles.videoInfoContainer,
                    { backgroundColor: dark ? COLORS.dark2 : COLORS.white },
                  ]}
                >
                  <Text
                    style={[
                      styles.videoTitle,
                      { color: dark ? COLORS.white : COLORS.greyscale900 },
                    ]}
                  >
                    {module.name} - Vidéo explicative
                  </Text>

                  <Text
                    style={[
                      styles.videoDescription,
                      {
                        color: dark ? COLORS.greyscale500 : COLORS.greyScale800,
                      },
                    ]}
                  >
                    {module.description ||
                      `Cette vidéo couvre les concepts clés de ${module.name}, avec des exemples pratiques et des explications détaillées pour faciliter votre apprentissage.`}
                  </Text>

                  <View style={styles.videoMetaContainer}>
                    <View style={styles.videoMetaItem}>
                      <Feather name="clock" size={16} color={COLORS.primary} />
                      <Text style={styles.videoMetaText}>12:34</Text>
                    </View>

                    <View style={styles.videoMetaItem}>
                      <Feather name="eye" size={16} color={COLORS.primary} />
                      <Text style={styles.videoMetaText}>274 vues</Text>
                    </View>

                    <View style={styles.videoMetaItem}>
                      <Feather
                        name="calendar"
                        size={16}
                        color={COLORS.primary}
                      />
                      <Text style={styles.videoMetaText}>21 Avril 2025</Text>
                    </View>
                  </View>
                </View>

                <View style={styles.actionButtonsContainer}>
                  <TouchableOpacity
                    style={[
                      styles.actionButton,
                      { backgroundColor: dark ? COLORS.dark2 : COLORS.white },
                    ]}
                  >
                    <Feather name="bookmark" size={20} color={COLORS.primary} />
                    <Text
                      style={[
                        styles.actionButtonText,
                        { color: dark ? COLORS.white : COLORS.greyscale900 },
                      ]}
                    >
                      Sauvegarder
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.actionButton,
                      { backgroundColor: dark ? COLORS.dark2 : COLORS.white },
                    ]}
                  >
                    <Feather name="share-2" size={20} color={COLORS.primary} />
                    <Text
                      style={[
                        styles.actionButtonText,
                        { color: dark ? COLORS.white : COLORS.greyscale900 },
                      ]}
                    >
                      Partager
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.actionButton,
                      { backgroundColor: dark ? COLORS.dark2 : COLORS.white },
                    ]}
                  >
                    <Feather name="download" size={20} color={COLORS.primary} />
                    <Text
                      style={[
                        styles.actionButtonText,
                        { color: dark ? COLORS.white : COLORS.greyscale900 },
                      ]}
                    >
                      Télécharger
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <View style={styles.materialsTabContent}>
                <FlatList
                  data={lessonMaterials}
                  renderItem={renderMaterialItem}
                  keyExtractor={(item) => item.id}
                  scrollEnabled={false}
                  ItemSeparatorComponent={() => (
                    <View
                      style={[
                        styles.separator,
                        {
                          backgroundColor: dark
                            ? "rgba(255,255,255,0.05)"
                            : "rgba(0,0,0,0.05)",
                        },
                      ]}
                    />
                  )}
                  contentContainerStyle={styles.materialsListContent}
                  ListHeaderComponent={
                    <View style={styles.materialsHeaderContainer}>
                      <Text
                        style={[
                          styles.materialsHeaderTitle,
                          { color: dark ? COLORS.white : COLORS.greyscale900 },
                        ]}
                      >
                        Supports de cours disponibles
                      </Text>
                      <Text
                        style={[
                          styles.materialsHeaderSubtitle,
                          {
                            color: dark
                              ? COLORS.greyscale500
                              : COLORS.greyScale800,
                          },
                        ]}
                      >
                        Téléchargez ces ressources pour approfondir votre
                        apprentissage
                      </Text>
                    </View>
                  }
                />
              </View>
            )}
          </View>
        </Animated.ScrollView>

        {/* Floating Action Button */}
        <TouchableOpacity style={styles.floatingButton}>
          <LinearGradient
            colors={["#ff6040", "#ff8e69"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.floatingButtonGradient}
          >
            <Feather name="arrow-right" size={24} color="#FFFFFF" />
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  area: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
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
    overflow: "hidden",
  },
  tabContainer: {
    flexDirection: "row",
    marginBottom: 20,
    borderRadius: 10,
    backgroundColor: "transparent",
  },
  tabButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderBottomWidth: 3,
  },
  activeTabButton: {
    borderBottomColor: COLORS.primary,
  },
  tabText: {
    fontSize: 14,
    fontFamily: "medium",
    marginLeft: 8,
  },
  activeTabText: {
    color: COLORS.primary,
    fontFamily: "bold",
  },
  videoTabContent: {
    marginBottom: 40,
  },
  materialsTabContent: {
    marginBottom: 40,
  },
  videoWrapper: {
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  videoContainer: {
    width: "100%",
    aspectRatio: 16 / 9,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  video: {
    width: "100%",
    height: "100%",
  },
  thumbnailContainer: {
    position: "absolute",
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  thumbnail: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  playButtonOverlay: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.3)",
  },
  playButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  videoInfoContainer: {
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  videoTitle: {
    fontSize: 18,
    fontFamily: "bold",
    marginBottom: 8,
  },
  videoDescription: {
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 16,
  },
  videoMetaContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  videoMetaItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
    marginBottom: 8,
  },
  videoMetaText: {
    fontSize: 12,
    color: COLORS.primary,
    marginLeft: 6,
  },
  actionButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    marginHorizontal: 4,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  actionButtonText: {
    fontSize: 12,
    fontFamily: "medium",
    marginLeft: 6,
  },
  materialsHeaderContainer: {
    marginBottom: 20,
  },
  materialsHeaderTitle: {
    fontSize: 18,
    fontFamily: "bold",
    marginBottom: 8,
  },
  materialsHeaderSubtitle: {
    fontSize: 14,
    lineHeight: 20,
  },
  materialsListContent: {
    paddingBottom: 20,
  },
  materialItem: {
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    overflow: "hidden",
  },
  materialItemContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  materialIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  materialIcon: {
    width: 24,
    height: 24,
  },
  materialInfo: {
    flex: 1,
    marginRight: 10,
  },
  materialTitle: {
    fontSize: 16,
    fontFamily: "medium",
    marginBottom: 4,
  },
  materialDescription: {
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 6,
  },
  materialMeta: {
    fontSize: 10,
    color: COLORS.primary,
    fontFamily: "medium",
  },
  downloadButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  separator: {
    height: 1,
    marginVertical: 8,
  },
  floatingButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  floatingButtonGradient: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default ReviewLesson;
