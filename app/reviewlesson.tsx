import type { Module } from "@/data";
import type { AVPlaybackStatus } from "expo-av";
import type { RouteProp, NavigationProp } from "@react-navigation/native";

import { Video, ResizeMode } from "expo-av";
import React, { useRef, useState } from "react";
import { icons, SIZES, COLORS } from "@/constants";
import { ScrollView } from "react-native-virtualized-view";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRoute, useTheme, useNavigation } from "@react-navigation/native";
import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

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
  },
  {
    id: "2",
    type: "image",
    title: "Diagram 1: System Architecture",
    size: "1.1 MB",
    icon: icons.image,
  },
  {
    id: "3",
    type: "doc",
    title: "Exercise Instructions",
    size: "540 KB",
    icon: icons.document,
  },
  {
    id: "4",
    type: "pdf",
    title: "Reference Guide",
    size: "3.7 MB",
    icon: icons.pdf,
  },
  {
    id: "5",
    type: "image",
    title: "Diagram 2: Process Flow",
    size: "890 KB",
    icon: icons.image,
  },
  {
    id: "6",
    type: "pdf",
    title: "Additional Resources",
    size: "1.8 MB",
    icon: icons.pdf,
  },
];

type MaterialItem = {
  id: string;
  type: string;
  title: string;
  size: string;
  icon: any;
};

const ReviewLesson = () => {
  const route = useRoute<RouteProp<{ params: { module: Module } }>>();
  const { module } = route.params;
  const navigation = useNavigation<NavigationProp<any>>();
  const videoRef = useRef<Video>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const { colors, dark } = useTheme();

  const renderHeader = () => {
    return (
      <View style={styles.headerContainer}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image
              source={icons.back}
              resizeMode="contain"
              style={[
                styles.backIcon,
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
            {module.name} - Exercice
          </Text>
        </View>
      </View>
    );
  };

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
    <TouchableOpacity style={styles.materialItem}>
      <View style={styles.materialIconContainer}>
        <Image
          source={item.icon}
          style={styles.materialIcon}
          resizeMode="contain"
        />
      </View>
      <View style={styles.materialInfo}>
        <Text style={styles.materialTitle}>{item.title}</Text>
        <Text style={styles.materialMeta}>
          {item.type.toUpperCase()} • {item.size}
        </Text>
      </View>
      <TouchableOpacity style={styles.downloadButton}>
        <Image
          source={icons.download}
          style={styles.downloadIcon}
          resizeMode="contain"
        />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.area, { backgroundColor: colors.background }]}>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        {renderHeader()}

        <View style={styles.contentContainer}>
          <Text style={styles.moduleTitle}>{module.name}</Text>
          <Text style={styles.moduleDescription}>{module.description}</Text>
        </View>

        <View style={styles.videoWrapper}>
          <View style={styles.videoContainer}>
            <Video
              ref={videoRef}
              style={styles.video}
              source={{ uri: videoUrl }}
              resizeMode={ResizeMode.CONTAIN}
              isLooping={false}
              onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
              useNativeControls
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
                    <Image
                      source={icons.play}
                      resizeMode="contain"
                      style={styles.playIcon}
                    />
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ) : (
              <></>
            )}
          </View>
        </View>
        <Text style={styles.sectionTitle}>Supports de cours</Text>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollViewContent}
        >
          {/* Lessons documents */}
          <View style={styles.additionalContent}>
            <View style={styles.materialsWrapper}>
              <FlatList
                data={lessonMaterials}
                renderItem={renderMaterialItem}
                keyExtractor={(item) => item.id}
                scrollEnabled
                ItemSeparatorComponent={() => <View style={styles.separator} />}
                showsVerticalScrollIndicator
                nestedScrollEnabled
                contentContainerStyle={styles.materialsListContent}
              />
            </View>
          </View>
        </ScrollView>
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
    padding: 16,
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingBottom: 32,
  },
  headerContainer: {
    flexDirection: "row",
    width: SIZES.width - 32,
    justifyContent: "space-between",
    marginBottom: 16,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  backIcon: {
    width: 24,
    height: 24,
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  contentContainer: {
    padding: 16,
    marginBottom: 16,
  },
  moduleTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 8,
  },
  moduleDescription: {
    fontSize: 16,
    color: "gray",
    lineHeight: 22,
  },
  videoWrapper: {
    padding: 12,
    backgroundColor: "rgba(0, 0, 0, 0.03)",
    borderRadius: 12,
    marginHorizontal: 0,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  videoContainer: {
    width: "100%",
    aspectRatio: 16 / 9,
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: COLORS.black,
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
    backgroundColor: "rgba(0, 0, 0, 0.2)",
  },
  playButton: {
    width: 40,
    height: 40,
    borderRadius: 35,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  playIcon: {
    width: 30,
    height: 30,
    tintColor: COLORS.primary,
  },
  additionalContent: {
    padding: 0,
    marginBottom: 45,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  materialsWrapper: {
    padding: 12,
    backgroundColor: "rgba(0, 0, 0, 0.03)",
    borderRadius: 12,
    marginBottom: 40,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    height: 400,
    width: "100%",
  },
  materialItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 8,
    backgroundColor: COLORS.white,
  },
  materialIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: "rgba(0, 0, 0, 0.05)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  materialsListContent: {
    paddingBottom: 16,
  },
  materialIcon: {
    width: 24,
    height: 24,
    tintColor: COLORS.primary,
  },
  materialInfo: {
    flex: 1,
  },
  materialTitle: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 4,
  },
  materialMeta: {
    fontSize: 12,
    color: "gray",
  },
  downloadButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(0, 0, 0, 0.05)",
    justifyContent: "center",
    alignItems: "center",
  },
  downloadIcon: {
    width: 18,
    height: 18,
    tintColor: COLORS.primary,
  },
  separator: {
    height: 1,
    backgroundColor: "rgba(0, 0, 0, 0.05)",
    marginVertical: 8,
  },
});

export default ReviewLesson;
