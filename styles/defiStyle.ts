import { StyleSheet } from "react-native";

import { COLORS } from "@/constants";
import { SIZES } from "@/constants/theme";



const defiStyles = StyleSheet.create({
    area: {
      flex: 1,
      backgroundColor: COLORS.white,
    },
    container: {
      flex: 1,
      backgroundColor: COLORS.white,
      padding: 16,
    },
    headerContainer: {
      flexDirection: "row",
      width: SIZES.width - 32,
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 16,
    },
    headerLeft: {
      flexDirection: "row",
      alignItems: "center",
    },
    backIcon: {
      height: 24,
      width: 24,
      tintColor: COLORS.black,
    },
    headerTitle: {
      fontSize: 20,
      fontFamily: "bold",
      color: COLORS.black,
      marginLeft: 16,
    },
    gradeContainer: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      backgroundColor: COLORS.tansparentPrimary,
      borderRadius: 8,
      alignItems: "center",
      justifyContent: "center",
    },
    gradeText: {
      fontSize: 14,
      fontFamily: "semiBold",
      color: COLORS.primary,
    },
  });
export default defiStyles; 