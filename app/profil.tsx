// app/profil.tsx
import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Platform,
  StatusBar,
  Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { ScrollView } from "react-native-virtualized-view";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

import { images } from "@/constants";
import { useTheme } from "@/theme/ThemeProvider";
import StatsCards from "@/components/profile/StatsCards";
import ProfileInfo from "@/components/profile/ProfileInfo";
import { launchImagePicker } from "@/utils/ImagePickerHelper";
// Import components
import ProfileHeader from "@/components/profile/ProfileHeader";
import BadgesSection from "@/components/profile/BadgesSection";
import GradesSection from "@/components/profile/GradesSection";
import ProgressSection from "@/components/profile/ProgressSection";
import SuggestionsSection from "@/components/profile/SuggestionsSection";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

// Mock data
const mockData = {
  id: "1",
  name: "Thomas Dubois",
  email: "Thomas.Dubois@gmail.com",
  grade: "CE2",
  avatar: images.user1,
  timeSpent: "24h",
  daysSpent: 15,
  xpEarned: 6919,
  ranking: 5,
  totalProgress: 75,
  subjectProgress: {
    math: 80,
    french: 65,
    science: 70,
    history: 25,
  },
};

const badgesData = [
  {
    id: 1,
    iconName: "ribbon",
    color: "#FFD700",
    label: "Top Performant",
  },
  {
    id: 2,
    iconName: "star",
    color: "#FFD700",
    label: "Excellence",
  },
  {
    id: 3,
    iconName: "trophy",
    color: "#FF4500",
    label: "Champion",
  },
];

const gradesData = [
  { id: 1, subject: "Mathématiques", grade: 16, evaluation: "Très bien" },
  { id: 2, subject: "Physique", grade: 14, evaluation: "Bien" },
  { id: 3, subject: "Français", grade: 12, evaluation: "Moyen" },
];

const performanceData = [
  "Votre note moyenne a augmenté de 15% ce mois-ci.",
  "Vous avez atteint un progrès global de 70% dans votre parcours d'apprentissage.",
  "Vous êtes dans le top 10 des élèves les plus actifs de votre classe.",
];

const ProfilePage = () => {
  const navigation = useNavigation();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const [userData, setUserData] = useState(mockData);
  const [image, setImage] = useState(userData.avatar);

  const pickImage = async () => {
    const tempUri = await launchImagePicker();
    if (!tempUri) return;
    setImage({ uri: tempUri });
  };

  const handleBackPress = () => {
    // Vérifiez si la méthode goBack existe, sinon utilisez une alternative
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      // Naviguer vers l'écran d'accueil si on ne peut pas revenir en arrière
      navigation.navigate("home" as never);
    }
  };

  // Calculate responsive padding
  const getResponsivePadding = () => {
    if (screenWidth < 350) return 12; // Small screens
    if (screenWidth < 400) return 16; // Medium screens
    return 20; // Large screens
  };

  const horizontalPadding = getResponsivePadding();

  // Calculate status bar height for Android
  const statusBarHeight =
    Platform.OS === "android" ? StatusBar.currentHeight || 0 : 0;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Status Bar Background for Android */}
      {Platform.OS === "android" && (
        <View
          style={[
            styles.statusBarBackground,
            {
              height: statusBarHeight,
              backgroundColor: colors.background,
            },
          ]}
        />
      )}

      <SafeAreaView
        style={[styles.safeArea, { backgroundColor: colors.background }]}
        edges={
          Platform.OS === "ios"
            ? ["top", "left", "right", "bottom"]
            : ["left", "right", "bottom"]
        }
      >
        <View
          style={[
            styles.innerContainer,
            { backgroundColor: colors.background },
          ]}
        >
          <ProfileHeader onBackPress={handleBackPress} />

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={[
              styles.scrollContainer,
              {
                paddingHorizontal: horizontalPadding,
                paddingBottom: Math.max(insets.bottom, 24),
              },
            ]}
            style={styles.scrollView}
          >
            <ProfileInfo
              image={image}
              identifiant={userData.id}
              name={userData.name}
              email={userData.email}
              classe={userData.grade}
              onPickImage={pickImage}
            />

            <StatsCards
              stats={{
                daysSpent: userData.daysSpent,
                timeSpent: userData.timeSpent,
                xpEarned: userData.xpEarned,
                ranking: userData.ranking,
              }}
            />

            <ProgressSection
              totalProgress={userData.totalProgress}
              subjectProgress={userData.subjectProgress}
            />

            <BadgesSection badges={badgesData} />

            <GradesSection grades={gradesData} />

            <SuggestionsSection suggestions={performanceData} />
          </ScrollView>
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  statusBarBackground: {
    width: "100%",
  },
  safeArea: {
    flex: 1,
  },
  innerContainer: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingTop: Platform.OS === "android" ? 8 : 0,
  },
});

export default ProfilePage;
