import React, { useRef, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Platform,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { Video, ResizeMode } from "expo-av";
import { LinearGradient } from "expo-linear-gradient";
import { COLORS } from "@/constants";
import type { Module } from "@/data";
import type { AVPlaybackStatus } from "expo-av";

interface VideoContentProps {
  module: Module;
  dark: boolean;
}

const videoUrl =
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";
const thumbnailUrl =
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/BigBuckBunny.jpg";

const VideoContent: React.FC<VideoContentProps> = ({ module, dark }) => {
  const videoRef = useRef<Video>(null);
  const [isPlaying, setIsPlaying] = useState(false);

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

  return (
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
                <LinearGradient
                  colors={["rgba(0,0,0,0.3)", "rgba(0,0,0,0.6)"]}
                  style={styles.gradientOverlay}
                />
                <TouchableOpacity
                  style={styles.playButton}
                  onPress={togglePlayPause}
                >
                  <LinearGradient
                    colors={["#ff6040", "#ff8e69"]}
                    style={styles.playButtonGradient}
                  >
                    <Feather name="play" size={24} color="#FFFFFF" />
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      <View
        style={[
          styles.videoInfoContainer,
          { backgroundColor: dark ? COLORS.dark2 : "#FFFFFF" },
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
            { color: dark ? COLORS.greyscale500 : COLORS.greyScale800 },
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
            <Feather name="calendar" size={16} color={COLORS.primary} />
            <Text style={styles.videoMetaText}>21 Avril 2025</Text>
          </View>
        </View>
      </View>

      <View style={styles.actionButtonsContainer}>
        <TouchableOpacity
          style={[
            styles.actionButton,
            { backgroundColor: dark ? COLORS.dark2 : "#FFFFFF" },
          ]}
        >
          <LinearGradient
            colors={dark ? ["#333", "#444"] : ["#f5f5f5", "#e0e0e0"]}
            style={styles.actionButtonGradient}
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
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.actionButton,
            { backgroundColor: dark ? COLORS.dark2 : "#FFFFFF" },
          ]}
        >
          <LinearGradient
            colors={dark ? ["#333", "#444"] : ["#f5f5f5", "#e0e0e0"]}
            style={styles.actionButtonGradient}
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
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.actionButton,
            { backgroundColor: dark ? COLORS.dark2 : "#FFFFFF" },
          ]}
        >
          <LinearGradient
            colors={dark ? ["#333", "#444"] : ["#f5f5f5", "#e0e0e0"]}
            style={styles.actionButtonGradient}
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
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* Related videos section */}
      <View style={styles.relatedVideosSection}>
        <Text
          style={[
            styles.sectionTitle,
            { color: dark ? COLORS.white : COLORS.greyscale900 },
          ]}
        >
          Vidéos supplémentaires
        </Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.relatedVideosContainer}
        >
          {[1, 2, 3].map((item) => (
            <TouchableOpacity
              key={item}
              style={[
                styles.relatedVideoItem,
                { backgroundColor: dark ? COLORS.dark2 : "#FFFFFF" },
              ]}
              activeOpacity={0.8}
            >
              <Image
                source={{ uri: thumbnailUrl }}
                style={styles.relatedVideoThumbnail}
              />
              <View style={styles.relatedVideoOverlay}>
                <Feather name="play-circle" size={28} color="#FFFFFF" />
              </View>
              <Text
                style={[
                  styles.relatedVideoTitle,
                  { color: dark ? COLORS.white : COLORS.greyscale900 },
                ]}
                numberOfLines={2}
              >
                {module.name} - Partie {item}
              </Text>
              <Text style={styles.relatedVideoDuration}>
                5:{item * 10 + 30}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  videoTabContent: {
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
  },
  gradientOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  playButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  playButtonGradient: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
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
    marginBottom: 24,
  },
  actionButton: {
    flex: 1,
    borderRadius: 12,
    marginHorizontal: 4,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  actionButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
  },
  actionButtonText: {
    fontSize: 12,
    fontFamily: "medium",
    marginLeft: 6,
  },
  relatedVideosSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: "bold",
    marginBottom: 16,
  },
  relatedVideosContainer: {
    paddingBottom: 8,
    paddingRight: 16,
  },
  relatedVideoItem: {
    width: 200,
    marginRight: 12,
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  relatedVideoThumbnail: {
    width: "100%",
    height: 120,
  },
  relatedVideoOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 120,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  relatedVideoTitle: {
    fontSize: 14,
    fontFamily: "medium",
    padding: 12,
  },
  relatedVideoDuration: {
    position: "absolute",
    bottom: 128,
    right: 8,
    backgroundColor: "rgba(0,0,0,0.7)",
    color: "#FFFFFF",
    fontSize: 10,
    padding: 4,
    borderRadius: 4,
  },
});

export default VideoContent;
