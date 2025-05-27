// components/profile/ProfileInfo.tsx
import React from "react";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

import { COLORS } from "@/constants";

interface ProfileInfoProps {
  dark: boolean;
  image: any;
  identifiant: string;
  name: string;
  email: string;
  classe: string;
  onPickImage: () => void;
}

const ProfileInfo: React.FC<ProfileInfoProps> = ({
  dark,
  image,
  identifiant,
  name,
  email,
  classe,
  onPickImage,
}) => {
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={
          dark
            ? ["rgba(255,96,64,0.2)", "rgba(255,142,105,0.1)"]
            : ["rgba(255,96,64,0.1)", "rgba(255,142,105,0.05)"]
        }
        style={styles.gradientBackground}
      >
        <View style={styles.imageContainer}>
          <View
            style={[
              styles.imageWrapper,
              { borderColor: dark ? COLORS.dark3 : COLORS.white },
            ]}
          >
            <Image source={image} contentFit="cover" style={styles.image} />
          </View>
          <TouchableOpacity style={styles.editButton} onPress={onPickImage}>
            <LinearGradient
              colors={[COLORS.primary, "#ff8e69"]}
              style={styles.editButtonGradient}
            >
              <Ionicons name="pencil" size={16} color={COLORS.white} />
            </LinearGradient>
          </TouchableOpacity>
        </View>

        <View style={styles.infoContainer}>
          <InfoItem
            label="Identifiant"
            value={identifiant}
            dark={dark}
            icon="finger-print"
          />
          <InfoItem
            label="Nom Complet"
            value={name}
            dark={dark}
            icon="person"
          />
          <InfoItem label="Email" value={email} dark={dark} icon="mail" />
          <InfoItem label="Classe" value={classe} dark={dark} icon="school" />
        </View>
      </LinearGradient>
    </View>
  );
};

interface InfoItemProps {
  label: string;
  value: string;
  dark: boolean;
  icon: string;
}

const InfoItem: React.FC<InfoItemProps> = ({ label, value, dark, icon }) => (
  <View style={styles.infoItem}>
    <View
      style={[
        styles.iconContainer,
        { backgroundColor: dark ? COLORS.dark3 : "rgba(255,255,255,0.8)" },
      ]}
    >
      <Ionicons name={icon as any} size={16} color={COLORS.primary} />
    </View>
    <View style={styles.textContainer}>
      <Text
        style={[
          styles.label,
          { color: dark ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.6)" },
        ]}
      >
        {label}
      </Text>
      <Text
        style={[styles.value, { color: dark ? COLORS.white : COLORS.black }]}
      >
        {value}
      </Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
    borderRadius: 20,
    overflow: "hidden",
  },
  gradientBackground: {
    padding: 20,
    alignItems: "center",
  },
  imageContainer: {
    position: "relative",
    marginBottom: 24,
  },
  imageWrapper: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 8,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  editButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    overflow: "hidden",
  },
  editButtonGradient: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  infoContainer: {
    width: "100%",
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  label: {
    fontSize: 12,
    fontFamily: "medium",
    marginBottom: 2,
  },
  value: {
    fontSize: 16,
    fontFamily: "semiBold",
  },
});

export default ProfileInfo;
