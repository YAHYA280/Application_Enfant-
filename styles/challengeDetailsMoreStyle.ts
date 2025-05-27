import { StyleSheet } from "react-native";

import { SIZES, COLORS } from "@/constants/theme";


const challengeDetailsMoreStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.white,
    },
    lessonImage: {
        width: SIZES.width,
        height: SIZES.width * 0.625,
    },
    headerContainer: {
        position: "absolute",
        top: 16,
        left: 16,
        zIndex: 999,
    },
    backIcon: {
        width: 24,
        height: 24,
        tintColor: COLORS.white,
    },
    titleContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    lessonName: {
        fontSize: 26,
        fontFamily: "bold",
        color: COLORS.black,
    },
    lessonInfoContainer: {
        padding: 16,
    },
    ratingContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 12,
    },
    categoryContainer: {
        paddingHorizontal: 6,
        paddingVertical: 4,
        borderRadius: 6,
        backgroundColor: COLORS.transparentTertiary,
    },
    categoryName: {
        fontSize: 12,
        fontFamily: "medium",
        color: COLORS.primary,
    },
    descriptionContainer: {
        marginVertical: 16,
    },
    descriptionText: {
        fontSize: 16,
        fontFamily: "regular",
        lineHeight: 24,
        color: COLORS.grayscale700,
    },
    lessonResumeContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginTop: 8,
    },
    lessonViewContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    lessonViewIcon: {
        width: 16,
        height: 16,
        tintColor: COLORS.primary,
    },
    lessonViewTitle: {
        fontSize: 16,
        fontFamily: "regular",
        color: COLORS.black,
        marginLeft: 6,
    },
    separateLine: {
        width: SIZES.width,
        height: 0.4,
        backgroundColor: COLORS.gray,
        marginTop: 16,
    },
    exercisesContainer: {
        marginTop: 16,
    },
    exercisesTitle: {
        fontSize: 20,
        fontFamily: "bold",
        marginBottom: 12,
    },
    });

export default challengeDetailsMoreStyles; 