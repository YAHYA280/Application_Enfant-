import { Image } from "expo-image";
import Header from "@/components/Header";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/theme/ThemeProvider";
import React, { useState, useEffect } from "react";
import { SIZES, COLORS, images } from "@/constants";
import { Picker } from "@react-native-picker/picker";
import { ScrollView } from "react-native-virtualized-view";
import NotificationBell from "@/components/notifications/NotificationBell";
import { SafeAreaView } from "react-native-safe-area-context";
import { launchImagePicker } from "@/utils/ImagePickerHelper";
import {
  View,
  Text,
  Modal,
  FlatList,
  Animated,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

const mockData = [
  {
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
  },
];

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
  "Votre note moyenne a augmenté de 15%.",
  "Vous avez atteint un progrès global de 70%.",
  "Vous êtes dans le top 10 de votre classe.",
];

interface ProgressBarProps {
  progress: number;
  color: string;
}

const ProgressBar = ({ progress, color }: ProgressBarProps) => (
  <View style={styles.progressBarContainer}>
    <View
      style={[
        styles.progressBar,
        { width: `${progress}%`, backgroundColor: color },
      ]}
    />
  </View>
);

const Profil = () => {
  const [childData] = useState(mockData[0]);
  const [image, setImage] = useState(childData.avatar);
  const [identifiant] = useState(childData.id);
  const [name] = useState(childData.name);
  const [email] = useState(childData.email);
  const [classe] = useState(childData.grade);
  const [modalVisible, setModalVisible] = useState(false);
  const [scale] = useState(new Animated.Value(1));
  const { dark, colors } = useTheme();
  const [selectedSubject, setSelectedSubject] = useState("Tous");
  const [sortedData, setSortedData] = useState(gradesData);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    console.log("Modal visibility changed:", modalVisible);
  }, [modalVisible]);

  const pickImage = async () => {
    const tempUri = await launchImagePicker();
    if (!tempUri) return;
    setImage({ uri: tempUri });
  };

  const getProgressColor = (value: number) => {
    if (value >= 75) return COLORS.greeen;
    if (value >= 50) return COLORS.primary;
    if (value >= 25) return COLORS.secondary;
    return COLORS.error;
  };

  const handlePress = () => {
    Animated.spring(scale, {
      toValue: 1.2,
      friction: 3,
      useNativeDriver: true,
    }).start(() => {
      Animated.spring(scale, {
        toValue: 1,
        friction: 3,
        useNativeDriver: true,
      }).start();
    });
  };

  const filterBySubject = (subject: string) => {
    setSelectedSubject(subject);
    if (subject === "Tous") {
      setSortedData(gradesData);
    } else {
      setSortedData(gradesData.filter((item) => item.subject === subject));
    }
  };

  const sortBy = (order: string) => {
    const sorted =
      order === "asc"
        ? [...sortedData].sort((a, b) => a.grade - b.grade)
        : [...sortedData].sort((a, b) => b.grade - a.grade);

    setSortedData(sorted);
    setShowDropdown(false);
  };

  // Modal is kept for future use, but not currently triggered
  const renderModalProfile = () => {
    return (
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View
            style={[
              styles.modalContent,
              { backgroundColor: dark ? COLORS.black : COLORS.white },
            ]}
          >
            <Text
              style={[
                styles.editTitle,
                { color: dark ? COLORS.white : COLORS.black },
              ]}
            >
              Modifier le profil
            </Text>
            <View
              style={[
                styles.separateLine,
                {
                  backgroundColor: dark
                    ? COLORS.greyScale800
                    : COLORS.grayscale200,
                },
              ]}
            />
            <View>
              <Image source={image} contentFit="cover" style={styles.image} />
              <TouchableOpacity onPress={pickImage} style={styles.editImage}>
                <Ionicons name="pencil" size={19} color={COLORS.white} />
              </TouchableOpacity>
            </View>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.saveButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.saveButtonText}>Enregistrer</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.cancelButton,
                  {
                    backgroundColor: dark
                      ? COLORS.dark3
                      : COLORS.tansparentPrimary,
                    borderColor: dark ? COLORS.dark3 : COLORS.tansparentPrimary,
                  },
                ]}
                onPress={() => setModalVisible(false)}
              >
                <Text
                  style={[
                    styles.cancelButtonText,
                    { color: dark ? COLORS.white : COLORS.primary },
                  ]}
                >
                  Annuler
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  const renderProfile = () => {
    return (
      <View style={styles.profileContainer}>
        <View>
          <Image source={image} contentFit="cover" style={styles.image} />
          <TouchableOpacity style={styles.editImage} onPress={pickImage}>
            <Ionicons name="pencil" size={19} color={COLORS.white} />
          </TouchableOpacity>
        </View>
        <View style={styles.label}>
          <Text
            style={[styles.bold, { color: dark ? COLORS.white : COLORS.black }]}
          >
            Identifiant :{" "}
          </Text>
          <Text style={{ color: dark ? COLORS.white : COLORS.black }}>
            {identifiant}
          </Text>
        </View>
        <View style={styles.label}>
          <Text
            style={[styles.bold, { color: dark ? COLORS.white : COLORS.black }]}
          >
            Nom Complet :{" "}
          </Text>
          <Text style={{ color: dark ? COLORS.white : COLORS.black }}>
            {name}
          </Text>
        </View>
        <View style={styles.label}>
          <Text
            style={[styles.bold, { color: dark ? COLORS.white : COLORS.black }]}
          >
            Email :{" "}
          </Text>
          <Text style={{ color: dark ? COLORS.white : COLORS.black }}>
            {email}
          </Text>
        </View>
        <View style={styles.label}>
          <Text
            style={[styles.bold, { color: dark ? COLORS.white : COLORS.black }]}
          >
            Classe :{" "}
          </Text>
          <Text style={{ color: dark ? COLORS.white : COLORS.black }}>
            {classe}
          </Text>
        </View>
        <View
          style={[
            styles.profileSeparatorLine,
            {
              backgroundColor: dark ? COLORS.greyScale800 : COLORS.grayscale200,
            },
          ]}
        />
      </View>
    );
  };

  // Updated header similar to your Defi code header
  const renderHeader = () => {
    return (
      <View style={styles.headerContainer}>
        <View style={styles.headerLeft}>
          <Header title="Mon Profil" />
        </View>
        <View style={styles.headerRight}>
          <NotificationBell style={styles.notificationBell} />
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.area, { backgroundColor: colors.background }]}>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        {renderHeader()}
        <ScrollView showsVerticalScrollIndicator={false}>
          {renderProfile()}
          <View
            style={[
              styles.performanceContainer,
              { backgroundColor: colors.background },
            ]}
          >
            <View style={styles.cardsContainer}>
              <View
                style={[
                  styles.card,
                  { backgroundColor: dark ? COLORS.dark2 : COLORS.white },
                ]}
              >
                <Ionicons
                  name="calendar"
                  size={36}
                  color="#FF4500"
                  style={styles.icon}
                />
                <Text
                  style={[
                    styles.cardValue,
                    { color: dark ? COLORS.white : COLORS.black },
                  ]}
                >
                  {childData.daysSpent}
                </Text>
                <Text style={styles.cardLabel}>Jour d&apos;activité</Text>
              </View>
              <View
                style={[
                  styles.card,
                  { backgroundColor: dark ? COLORS.dark2 : COLORS.white },
                ]}
              >
                <Ionicons
                  name="time"
                  size={36}
                  color="#FF1493"
                  style={styles.icon}
                />
                <Text
                  style={[
                    styles.cardValue,
                    { color: dark ? COLORS.white : COLORS.black },
                  ]}
                >
                  {childData.timeSpent}
                </Text>
                <Text style={styles.cardLabel}>Temps passé</Text>
              </View>
              <View
                style={[
                  styles.card,
                  { backgroundColor: dark ? COLORS.dark2 : COLORS.white },
                ]}
              >
                <Ionicons
                  name="flash"
                  size={36}
                  color="#FFA500"
                  style={styles.icon}
                />
                <Text
                  style={[
                    styles.cardValue,
                    { color: dark ? COLORS.white : COLORS.black },
                  ]}
                >
                  {childData.xpEarned}
                </Text>
                <Text style={styles.cardLabel}>XP gagnés</Text>
              </View>
              <View
                style={[
                  styles.card,
                  { backgroundColor: dark ? COLORS.dark2 : COLORS.white },
                ]}
              >
                <Ionicons
                  name="ribbon"
                  size={36}
                  color="#DAA520"
                  style={styles.icon}
                />
                <Text
                  style={[
                    styles.cardValue,
                    { color: dark ? COLORS.white : COLORS.black },
                  ]}
                >
                  {childData.ranking}
                </Text>
                <Text style={styles.cardLabel}>Classement</Text>
              </View>
            </View>
            {/* Progrès global */}
            <View
              style={[
                styles.section,
                { backgroundColor: dark ? COLORS.dark2 : COLORS.white },
              ]}
            >
              <Text
                style={[
                  styles.sectionTitle,
                  { color: dark ? COLORS.white : COLORS.black },
                ]}
              >
                Progrès global
              </Text>
              <View style={styles.progressRow}>
                <Text style={styles.progressLabel}>
                  Taux de réussite global
                </Text>
                <Text
                  style={[
                    styles.progressValue,
                    { color: getProgressColor(childData.totalProgress) },
                  ]}
                >
                  {childData.totalProgress}%
                </Text>
              </View>
              <ProgressBar
                progress={childData.totalProgress}
                color={getProgressColor(childData.totalProgress)}
              />
            </View>
            {/* Progrès par matière */}
            <View
              style={[
                styles.section,
                { backgroundColor: dark ? COLORS.dark2 : COLORS.white },
              ]}
            >
              <Text
                style={[
                  styles.sectionTitle,
                  { color: dark ? COLORS.white : COLORS.black },
                ]}
              >
                Progrès par matière
              </Text>
              {Object.entries(childData.subjectProgress).map(
                ([subject, progress]) => (
                  <View key={subject} style={styles.subjectProgressContainer}>
                    <View style={styles.progressRow}>
                      <Text style={styles.progressLabel}>
                        {subject.charAt(0).toUpperCase() + subject.slice(1)}
                      </Text>
                      <Text
                        style={[
                          styles.progressValue,
                          { color: getProgressColor(progress) },
                        ]}
                      >
                        {progress}%
                      </Text>
                    </View>
                    <ProgressBar
                      progress={progress}
                      color={getProgressColor(progress)}
                    />
                  </View>
                )
              )}
            </View>
          </View>
          {/* Section des badges */}
          <View style={styles.badgeSection}>
            <Text
              style={[
                styles.sectionTitle,
                { color: dark ? COLORS.white : COLORS.black },
              ]}
            >
              Récompenses et Distinctions
            </Text>
            <FlatList
              data={badgesData}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.badgeContainer,
                    { backgroundColor: dark ? COLORS.black : COLORS.white },
                  ]}
                  onPress={() => handlePress()}
                >
                  <View style={styles.badgeCard}>
                    <Ionicons
                      name={item.iconName as any}
                      size={60}
                      color={item.color}
                      style={styles.badgeIcon}
                    />
                    <Text
                      style={[
                        styles.badgeLabel,
                        { color: dark ? COLORS.white : COLORS.black },
                      ]}
                    >
                      {item.label}
                    </Text>
                  </View>
                </TouchableOpacity>
              )}
              keyExtractor={(item) => item.id.toString()}
              numColumns={3}
              contentContainerStyle={styles.listContainer}
            />
          </View>
          {/* Section des notes et évaluations */}
          <View style={styles.gradeSection}>
            <Text
              style={[
                styles.sectionTitle,
                { color: dark ? COLORS.white : COLORS.black },
              ]}
            >
              Notes et Évaluations
            </Text>
            <View style={styles.filters}>
              <View
                style={[
                  styles.pickerContainer,
                  { backgroundColor: dark ? "#333" : "#fff" },
                ]}
              >
                <Picker
                  selectedValue={selectedSubject}
                  style={[
                    styles.picker,
                    { color: dark ? COLORS.white : COLORS.black },
                  ]}
                  dropdownIconColor={dark ? COLORS.white : COLORS.black}
                  onValueChange={(itemValue: string) =>
                    filterBySubject(itemValue)
                  }
                >
                  <Picker.Item label="Toutes les matières" value="Tous" />
                  <Picker.Item label="Mathématiques" value="Mathématiques" />
                  <Picker.Item label="Physique" value="Physique" />
                  <Picker.Item label="Français" value="Français" />
                </Picker>
              </View>
              <View style={styles.dropdownWrapper}>
                <TouchableOpacity
                  style={styles.sortButton}
                  onPress={() => setShowDropdown(!showDropdown)}
                >
                  <Ionicons name="funnel" size={24} color="white" />
                  <Text style={styles.sortText}>Trier</Text>
                </TouchableOpacity>
                {showDropdown && (
                  <View style={styles.dropdown}>
                    <TouchableOpacity
                      style={styles.dropdownItem}
                      onPress={() => sortBy("asc")}
                    >
                      <Text style={styles.dropdownText}>Croissante</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.dropdownItem}
                      onPress={() => sortBy("desc")}
                    >
                      <Text style={styles.dropdownText}>Décroissante</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </View>
            <FlatList
              data={sortedData}
              ListHeaderComponent={
                <View style={styles.tableHeader}>
                  <Text style={[styles.headerText, styles.subjectColumn]}>
                    Matière
                  </Text>
                  <Text style={[styles.headerText, styles.gradeColumn]}>
                    Note
                  </Text>
                  <Text style={[styles.headerText, styles.evaluationColumn]}>
                    Évaluation
                  </Text>
                </View>
              }
              renderItem={({ item }) => (
                <View style={styles.gradeItem}>
                  <Text
                    style={[
                      styles.columnText,
                      styles.subjectColumn,
                      { color: dark ? COLORS.white : COLORS.black },
                    ]}
                  >
                    {item.subject}
                  </Text>
                  <Text
                    style={[
                      styles.columnText,
                      styles.gradeColumn,
                      { color: dark ? COLORS.white : COLORS.black },
                    ]}
                  >
                    {item.grade}/20
                  </Text>
                  <Text
                    style={[
                      styles.columnText,
                      styles.evaluationColumn,
                      { color: dark ? COLORS.white : COLORS.black },
                    ]}
                  >
                    {item.evaluation}
                  </Text>
                </View>
              )}
              keyExtractor={(item) => item.id.toString()}
            />
          </View>
          {/* Section des suggestions et conseils */}
          <View
            style={[
              styles.performanceSection,
              { backgroundColor: dark ? COLORS.dark2 : COLORS.white },
            ]}
          >
            <Text
              style={[
                styles.sectionTitle,
                { color: dark ? COLORS.white : COLORS.black },
              ]}
            >
              Suggestions et Conseils
            </Text>
            <View style={styles.bulletList}>
              {performanceData.map((item, index) => (
                <View key={index} style={styles.bulletItemContainer}>
                  <View
                    style={[
                      styles.bulletPoint,
                      { backgroundColor: dark ? COLORS.white : COLORS.black },
                    ]}
                  />
                  <Text
                    style={[
                      styles.bulletItem,
                      { color: dark ? COLORS.white : COLORS.black },
                    ]}
                  >
                    {item}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </ScrollView>
        {renderModalProfile()}
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
    marginBottom: 20,
    padding: 16,
  },
  // Header container split into left and right portions
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  headerLeft: {
    flex: 1,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  notificationBell: {
    marginLeft: 12,
  },
  performanceContainer: {
    backgroundColor: COLORS.white,
    marginBottom: 20,
    padding: 1,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
    marginTop: 19,
  },
  label: {
    flexDirection: "row",
    fontSize: 14,
    marginBottom: 5,
  },
  bold: {
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: COLORS.white,
    padding: 20,
    paddingTop: 10,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
    zIndex: 100,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 20,
  },
  saveButton: {
    backgroundColor: COLORS.primary,
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginRight: 5,
  },
  saveButtonText: {
    color: COLORS.white,
    textAlign: "center",
    fontWeight: "bold",
  },
  cancelButton: {
    backgroundColor: COLORS.tansparentPrimary,
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginLeft: 5,
  },
  cancelButtonText: {
    color: COLORS.primary,
    textAlign: "center",
    fontWeight: "bold",
  },
  profileContainer: {
    alignItems: "center",
    borderBottomColor: COLORS.grayscale400,
    paddingVertical: 20,
  },
  editImage: {
    width: 20,
    height: 20,
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.primary,
    position: "absolute",
    right: 0,
    bottom: 12,
  },
  editTitle: {
    fontSize: 24,
    fontFamily: "semiBold",
    color: COLORS.black,
    textAlign: "center",
    marginTop: 0,
  },
  separateLine: {
    width: SIZES.width,
    height: 1,
    backgroundColor: COLORS.grayscale200,
    marginTop: 12,
  },
  profileSeparatorLine: {
    width: "90%",
    height: 1,
    backgroundColor: COLORS.grayscale200,
    marginTop: 25,
  },
  section: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  progressRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 14,
    color: COLORS.gray,
    fontFamily: "medium",
  },
  progressValue: {
    fontSize: 14,
    fontFamily: "bold",
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: COLORS.grayscale200,
    borderRadius: 4,
    marginBottom: 12,
  },
  progressBar: {
    height: "100%",
    borderRadius: 4,
  },
  subjectProgressContainer: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontFamily: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  cardsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  card: {
    width: "48%",
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    paddingVertical: 20,
    paddingHorizontal: 10,
    marginBottom: 15,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  icon: {
    marginBottom: 10,
  },
  cardValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  cardLabel: {
    fontSize: 14,
    color: "#666",
    marginTop: 5,
  },
  badgeSection: {
    marginBottom: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  listContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  badgeContainer: {
    flex: 1,
    borderRadius: 10,
    padding: 11,
    backgroundColor: "#f0f0f0",
    margin: 6,
  },
  badgeCard: {
    alignItems: "center",
    justifyContent: "center",
  },
  badgeIcon: {
    marginBottom: 6,
  },
  badgeLabel: {
    fontSize: 15,
    fontWeight: "normal",
    color: "#333",
    textAlign: "center",
  },
  gradeSection: {
    marginBottom: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  filters: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  pickerContainer: {
    width: 220,
    borderWidth: 2,
    borderColor: COLORS.grayscale200,
    borderRadius: 10,
    backgroundColor: COLORS.white,
    overflow: "hidden",
    marginLeft: 10,
  },
  picker: {
    height: 49,
    width: "100%",
    paddingHorizontal: 10,
    paddingVertical: 0,
    fontSize: 14,
    textAlignVertical: "center",
  },
  gradeItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 15,
    borderWidth: 1,
    borderColor: COLORS.grayscale200,
  },
  columnText: {
    textAlign: "center",
  },
  tableHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#ddd",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  headerText: {
    fontSize: 16,
    fontWeight: "bold",
    flex: 1,
    textAlign: "center",
  },
  subjectColumn: {
    flex: 2,
    textAlign: "left",
  },
  gradeColumn: {
    flex: 1,
  },
  evaluationColumn: {
    flex: 2,
    textAlign: "right",
  },
  performanceSection: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    marginTop: 20,
    borderWidth: 1,
    borderStyle: "solid",
  },
  bulletList: {
    marginRight: 10,
  },
  bulletItemContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  bulletPoint: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#000",
    marginRight: 10,
  },
  bulletItem: {
    fontSize: 16,
    color: "#555",
  },
  dropdownWrapper: {
    position: "relative",
    alignSelf: "flex-start",
    marginTop: 4,
    marginRight: 7,
  },
  sortButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.primary,
    padding: 10,
    borderRadius: 8,
  },
  sortText: {
    color: "white",
    marginLeft: 8,
  },
  dropdown: {
    position: "absolute",
    top: 60,
    right: 1,
    backgroundColor: COLORS.white,
    padding: 10,
    borderRadius: 8,
    width: 180,
    elevation: 4,
    zIndex: 10,
  },
  dropdownItem: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  dropdownText: {
    color: COLORS.black,
    fontSize: 16,
  },
});

export default Profil;
