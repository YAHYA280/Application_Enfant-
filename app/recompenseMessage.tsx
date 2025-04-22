import type { RouteProp, NavigationProp } from "@react-navigation/native";

import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRoute, useNavigation } from "@react-navigation/native";
import recomponseMessageStyles from "@/styles/recompenseMessageStyle";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
} from "react-native";

import type { Challenge } from "../services/mock";

import { icons, COLORS } from "../constants";
import { useTheme } from "../theme/ThemeProvider";

type RootStackParamList = {
  recompenseMessage: {
    challenge: Challenge;
    score: number;
    totalPossibleScore: number;
  };
  challengedetailsmore: { 
    challenge: Challenge;
  };
};

const RecompenseMessage = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, "recompenseMessage">>();
  const { challenge, score, totalPossibleScore } = route.params;
  const { colors, dark } = useTheme();
  
  const successThreshold = totalPossibleScore * 0.7;
  const isSuccess = score >= successThreshold;
  
  const message = isSuccess 
    ? challenge.messageFailed
    : challenge.messageReuse;

  return (
    <SafeAreaView style={[recomponseMessageStyles.container, { backgroundColor: colors.background }]}>
      <View style={recomponseMessageStyles.header}>
        <TouchableOpacity 
          style={recomponseMessageStyles.backButton}
          onPress={() => navigation.navigate("challengedetailsmore", { challenge })}
        >
          <Image
            source={icons.back}
            resizeMode="contain"
            style={[recomponseMessageStyles.backIcon, { tintColor: dark ? COLORS.white : COLORS.greyscale900 }]}
          />
        </TouchableOpacity>
        <Text style={[recomponseMessageStyles.headerTitle, { color: dark ? COLORS.white : COLORS.greyscale900 }]}>
          {challenge.nom}
        </Text>
      </View>
      
      <ScrollView style={recomponseMessageStyles.scrollView} contentContainerStyle={recomponseMessageStyles.scrollContent}>
        <View style={recomponseMessageStyles.emojiContainer}>
          <Text style={recomponseMessageStyles.emojiText}>
            {isSuccess ? "🎉🏆👏" : "💪🚀🔥"}
          </Text>
        </View>
        
        <View style={recomponseMessageStyles.messageContainer}>
          <Text style={recomponseMessageStyles.resultTitle}>
            {isSuccess ? "Félicitations!" : "Continuez d'apprendre!"}
          </Text>
          
          <Text style={recomponseMessageStyles.messageText}>
            {message}
          </Text>
        </View>
        
        <TouchableOpacity 
          style={recomponseMessageStyles.continueButton}
          onPress={() => navigation.navigate("challengedetailsmore", { challenge })}
        >
          <Text style={recomponseMessageStyles.continueButtonText}>Retour au challenge</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};
  

export default RecompenseMessage;