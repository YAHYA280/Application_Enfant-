import React from 'react';
import { Ionicons, SimpleLineIcons } from '@expo/vector-icons';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import challengeLessonCardStyles from '@/styles/challengeLessonCardStyle';

import { COLORS } from '../constants';
import { useTheme } from '../theme/ThemeProvider';
import ChallengeProgressBar from './ChallengeProgressBar';
import { type Challenge, challengeExerciceMap} from '../services/mock';

interface LessonCardProps {
  challenge: Challenge;
  onPress: () => void;
}

const ChallengeLessonCard: React.FC<LessonCardProps> = ({
  challenge,
  onPress
}) => {
  const { dark } = useTheme();

  const totalExercices = challengeExerciceMap[challenge.id]?.length || 0;
  const completedExercices = Math.floor(challenge.pourcentageReussite / 100 * totalExercices);
  
  const handleCardPress = () => {
    if (challenge.accessible) {
      onPress();
    }
  };
  
  return (
    <TouchableOpacity 
      onPress={handleCardPress} 
      disabled={!challenge.accessible}
      style={[
        challengeLessonCardStyles.container, 
        { 
          backgroundColor: dark ? COLORS.dark2 : COLORS.white,
          opacity: challenge.accessible ? 1 : 0.8
        }
      ]}>
      <View style={challengeLessonCardStyles.contentContainer}>
        <Image
          source={challenge.media}
          resizeMode="cover"
          style={challengeLessonCardStyles.lessonImage}
        />
        
        <View style={challengeLessonCardStyles.textContentContainer}>
          <View style={challengeLessonCardStyles.nameAndIconContainer}>
            <Text 
              style={[challengeLessonCardStyles.name, { 
                color: dark ? COLORS.white : COLORS.greyscale900
              }]}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {challenge.nom}
            </Text>
            
            <TouchableOpacity>
              {challenge.accessible ? (
                <Ionicons name="play-circle-sharp" size={24} color={COLORS.primary} />
              ) : (
                <SimpleLineIcons name="lock" size={20} color={COLORS.gray} />
              )}
            </TouchableOpacity>
          </View>
          
          <View style={challengeLessonCardStyles.infoContainer}>
            <View style={challengeLessonCardStyles.categoryContainer}>
              <Text style={challengeLessonCardStyles.categoryName}>{challenge.difficulte}</Text>
            </View>
            
            <View style={challengeLessonCardStyles.tentativesContainer}>
              <Text style={challengeLessonCardStyles.tentativesText}>
                {challenge.nombreTentatives} tentative{challenge.nombreTentatives !== 1 ? 's' : ''}
              </Text>
            </View>
          </View>
  
          {totalExercices > 0 ? (
            <View style={challengeLessonCardStyles.progressBarContainer}>
              <ChallengeProgressBar
                numberOfLessonsCompleted={completedExercices}
                totalNumberOfLessons={totalExercices}
              />
            </View>
          ):(
            <>
            </>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default ChallengeLessonCard;