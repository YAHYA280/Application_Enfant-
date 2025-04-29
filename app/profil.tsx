import { images } from "@/constants";
// app/profil.tsx
import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { useTheme } from "@/theme/ThemeProvider";
import { useNavigation } from "@react-navigation/native";
import StatsCards from "@/components/profile/StatsCards";
import { ScrollView } from "react-native-virtualized-view";
import ProfileInfo from "@/components/profile/ProfileInfo";
import { SafeAreaView } from "react-native-safe-area-context";
import { launchImagePicker } from "@/utils/ImagePickerHelper";
// Import components
import ProfileHeader from "@/components/profile/ProfileHeader";
import BadgesSection from "@/components/profile/BadgesSection";
import GradesSection from "@/components/profile/GradesSection";
import ProgressSection from "@/components/profile/ProgressSection";
import SuggestionsSection from "@/components/profile/SuggestionsSection";

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
  const { dark, colors } = useTheme();
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

  return (
    <SafeAreaView style={[styles.area, { backgroundColor: colors.background }]}>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <ProfileHeader dark={dark} onBackPress={handleBackPress} />

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContainer}
        >
          <ProfileInfo
            dark={dark}
            image={image}
            identifiant={userData.id}
            name={userData.name}
            email={userData.email}
            classe={userData.grade}
            onPickImage={pickImage}
          />

          <StatsCards
            dark={dark}
            stats={{
              daysSpent: userData.daysSpent,
              timeSpent: userData.timeSpent,
              xpEarned: userData.xpEarned,
              ranking: userData.ranking,
            }}
          />

          <ProgressSection
            dark={dark}
            totalProgress={userData.totalProgress}
            subjectProgress={userData.subjectProgress}
          />

          <BadgesSection dark={dark} badges={badgesData} />

          <GradesSection dark={dark} grades={gradesData} />

          <SuggestionsSection dark={dark} suggestions={performanceData} />
        </ScrollView>
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
  scrollContainer: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
});

export default ProfilePage;
