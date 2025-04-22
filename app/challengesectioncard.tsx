import type { GestureResponderEvent } from "react-native";

import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons, SimpleLineIcons } from "@expo/vector-icons";
import challengesectioncardStyles from "@/styles/challengesectioncardStyle";

import type { Exercice } from "../services/mock";

import {COLORS } from "../constants";
import { useTheme } from "../theme/ThemeProvider";

interface ChallengesectioncardProps {
  exercice: Exercice;
  isCompleted: boolean;
  onPress: (event: GestureResponderEvent) => void;
}

const Challengesectioncard: React.FC<ChallengesectioncardProps> = ({
  exercice,
  isCompleted,
  onPress,
}) => {
  const { dark } = useTheme();

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        challengesectioncardStyles.container,
        {
          backgroundColor: dark ? COLORS.dark2 : COLORS.white,
        },
      ]}
    >
      <View style={challengesectioncardStyles.viewLeft}>
        <View style={challengesectioncardStyles.numContainer}>
          <Text style={challengesectioncardStyles.num}>{exercice.id.toString().slice(-2)}</Text>
        </View>
        <View>
          <Text
            style={[
              challengesectioncardStyles.title,
              {
                color: dark ? COLORS.white : COLORS.dark1,
              },
            ]}
          >
            {exercice.titre}
          </Text>
          <Text style={challengesectioncardStyles.duration}>{exercice.dureeQuestion} sec</Text>
        </View>
      </View>
      <TouchableOpacity>
        {isCompleted ? (
          <Ionicons name="play-circle-sharp" size={24} color={COLORS.primary} />
        ) : (
          <SimpleLineIcons name="lock" size={20} color={COLORS.gray} />
        )}
      </TouchableOpacity>
    </TouchableOpacity>
  );
};
  

export default Challengesectioncard;