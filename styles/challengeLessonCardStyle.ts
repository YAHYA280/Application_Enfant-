import { StyleSheet } from "react-native";
import { SIZES, COLORS } from "@/constants/theme";


const challengeLessonCardStyles = StyleSheet.create({
      container: {
        width: SIZES.width - 32,
        borderRadius: 16,
        paddingVertical: 12,
        paddingHorizontal: 10,
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
      contentContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
      },
      lessonImage: {
        width: 124,
        height: 124,
        borderRadius: 16,
        marginRight: 16,
      },
      textContentContainer: {
        flex: 1,
        justifyContent: 'space-between',
        height: 124,
        paddingVertical: 4,
      },
      nameAndIconContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
      },
      infoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap',
        marginVertical: 8,
        gap: 8,
      },
      progressBarContainer: {
        marginTop: 'auto',
      },
      progressText: {
        fontSize: 12,
        fontFamily: 'medium',
        color: COLORS.gray,
        textAlign: 'right',
        marginTop: 4,
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
        flex: 1,
        marginRight: 8,
      },
      tentativesContainer: {
        paddingHorizontal: 10,
        paddingVertical: 6,
        backgroundColor: COLORS.transparentTertiary,
        borderRadius: 4,
        alignItems: 'center',
        justifyContent: 'center',
      },
      tentativesText: {
        fontSize: 12,
        fontFamily: 'medium',
        color: COLORS.primary,
      },
    });
    

export default challengeLessonCardStyles; 