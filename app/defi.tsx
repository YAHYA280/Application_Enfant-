import type { NavigationProp } from "@react-navigation/native";

import React, { useState } from "react";
import { StyleSheet } from 'react-native';
import defiStyles from "@/styles/defiStyle";
import { useNavigation } from "@react-navigation/native";
import { ScrollView } from "react-native-virtualized-view";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
} from "react-native";

import type { Challenge} from "../services/mock";

import { icons, COLORS } from "../constants";
import { mockChallenges } from "../services/mock";
import { useTheme } from "../theme/ThemeProvider";
import ChallengeLessonCard from "../components/ChallengeLessonCard";

interface DefiProps {
  navigation: {
    goBack: () => void;
    navigate: (screen: string, params?: any) => void;
  };
}

const Defi: React.FC<DefiProps> = () => {
  const navigation = useNavigation<NavigationProp<any>>();
  const { colors, dark } = useTheme();
  const [selectedCategories] = useState<string[]>(["all"]);

  const filteredChallenges = mockChallenges.filter(
    (challenge) =>
      selectedCategories.includes("all") ||
      selectedCategories.includes(challenge.difficulte)
  );

  const renderHeader = () => {
    return (
      <View style={defiStyles.headerContainer}>
        <View style={defiStyles.headerLeft}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image
              source={icons.back}
              resizeMode="contain"
              style={[
                defiStyles.backIcon,
                {
                  tintColor: dark ? COLORS.white : COLORS.greyscale900,
                },
              ]}
            />
          </TouchableOpacity>
          <Text
            style={[
              defiStyles.headerTitle,
              {
                color: dark ? COLORS.white : COLORS.greyscale900,
              },
            ]}
          >
            Challenge
          </Text>
        </View>

        <View style={styles.headerRight}>
          <View style={defiStyles.gradeContainer}>
            <Text style={defiStyles.gradeText}>CE2</Text>
          </View>
        </View>
      </View>
    );
  };


  const renderChallengeItem = ({ item }: { item: Challenge }) => (
    <ChallengeLessonCard
      challenge={item}
      onPress={() => navigation.navigate("challengedetailsmore", { challenge: item })}
    />
  );

  return (
    <SafeAreaView style={[defiStyles.area, { backgroundColor: colors.background }]}>
      <View style={[defiStyles.container, { backgroundColor: colors.background }]}>
        {renderHeader()}
        <ScrollView showsVerticalScrollIndicator={false}>
          <FlatList
            data={filteredChallenges}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderChallengeItem}
          />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default Defi;