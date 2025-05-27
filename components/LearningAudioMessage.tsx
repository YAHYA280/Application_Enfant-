import type { AVPlaybackStatus  } from "expo-av";

import { Audio } from "expo-av";
import { COLORS } from "@/constants";
import { Ionicons } from "@expo/vector-icons";
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from "react-native";

type AudioMessageProps = {
  audioUri: string;
};

const AudioMessage: React.FC<AudioMessageProps> = ({ audioUri }) => {
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [position, setPosition] = useState(0);

  useEffect(() => {
    const loadSound = async () => {
      try {
        const { sound: audioSound } = await Audio.Sound.createAsync(
          { uri: audioUri },
          { shouldPlay: false },
          onPlaybackStatusUpdate
        );
        setSound(audioSound);

        // Obtenir la durée de l'audio
        const status = await audioSound.getStatusAsync();
        if (status.isLoaded) {
          setDuration(status.durationMillis || 0);
        }
      } catch (error) {
        console.error("Erreur de chargement audio", error);
      }
    };

    loadSound();

    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [audioUri, sound]);

  const onPlaybackStatusUpdate = (status: AVPlaybackStatus) => {
    if (!status.isLoaded) {
      // Handle error state if needed
      if (status.error) {
        console.error(`Erreur de lecture: ${status.error}`);
      }
      return;
    }

    setPosition(status.positionMillis || 0);
    setIsPlaying(status.isPlaying || false);
    
    if (status.didJustFinish) {
      setIsPlaying(false);
    }
  };

  const togglePlayPause = async () => {
    if (!sound) return;

    if (isPlaying) {
      await sound.pauseAsync();
      setIsPlaying(false);
    } else {
      await sound.playAsync();
      setIsPlaying(true);
    }
  };

  const formatTime = (milliseconds: number) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  return (
    <View style={styles.audioContainer}>
      <TouchableOpacity onPress={togglePlayPause} style={styles.playButton}>
        <Ionicons
          name={isPlaying ? "pause" : "play"}
          size={24}
          color={COLORS.primary}
        />
      </TouchableOpacity>

      <View style={styles.audioDetails}>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressIndicator,
              {
                width: `${duration > 0 ? (position / duration) * 100 : 0}%`,
                backgroundColor: COLORS.primary,
              },
            ]}
          />
        </View>
        <Text style={styles.durationText}>
          {formatTime(duration - position)}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  audioContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: Dimensions.get("window").width * 0.6,
  },
  playButton: {
    backgroundColor: "transparent",
    borderRadius: 25,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  audioDetails: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  progressBar: {
    flex: 1,
    height: 3,
    backgroundColor: "#E0E0E0",
    borderRadius: 5,
    marginRight: 10,
  },
  progressIndicator: {
    height: "100%",
    borderRadius: 5,
  },
  durationText: {
    color: COLORS.primary,
    fontSize: 12,
  },
});

export default AudioMessage;
