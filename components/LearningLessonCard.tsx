import type { ImageSourcePropType } from 'react-native';

import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';

import { SIZES, COLORS } from '../constants';
import { useTheme } from '../theme/ThemeProvider';
import LessonProgressBar from './LessonProgressBar';
import ConditionalComponent from './ConditionalComponent';

interface LessonCardProps {
  name: string;
  image: ImageSourcePropType;
  category: string;
  numberOfLessonsCompleted?: number;
  totalNumberOfLessons?: number;
  onPress: () => void;
}

const LearningLessonCard: React.FC<LessonCardProps> = ({
  name,
  image,
  category,
  numberOfLessonsCompleted = 0,
  totalNumberOfLessons = 0,
  onPress
}) => {
  const { colors, dark } = useTheme();

  return (
    <TouchableOpacity 
      onPress={onPress} 
      style={[styles.container, { 
        backgroundColor: dark ? COLORS.dark2 : COLORS.white
      }]}>
      <Image
        source={image}
        resizeMode="cover"
        style={styles.lessonImage}
      />
      <View style={{ flex: 1 }}>
        <Text style={[styles.name, { 
          color: dark ? COLORS.white : COLORS.greyscale900
        }]}>{name}</Text>
        <View style={styles.topContainer}>
          <View style={styles.categoryContainer}>
            <Text style={styles.categoryName}>{category}</Text>
          </View>
        </View>
        <ConditionalComponent isValid={totalNumberOfLessons > 0}>
          <LessonProgressBar
            numberOfLessonsCompleted={numberOfLessonsCompleted}
            totalNumberOfLessons={totalNumberOfLessons}
          />
        </ConditionalComponent>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: SIZES.width - 32,
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    height: 'auto',
    backgroundColor: COLORS.white,
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 0,
    marginVertical: 8
  },
  lessonImage: {
    width: 124,
    height: 124,
    borderRadius: 16,
    marginRight: 16,
  },
  topContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  categoryContainer: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: COLORS.transparentTertiary,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryName: {
    fontSize: 14,
    fontFamily: 'semiBold',
    color: COLORS.primary
  },
  name: {
    fontSize: 16,
    fontFamily: 'bold',
    color: COLORS.black,
    marginVertical: 10,
  },
});

export default LearningLessonCard;
