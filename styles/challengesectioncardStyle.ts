import { StyleSheet } from "react-native";

import { COLORS } from "@/constants";
import { SIZES } from "@/constants/theme";


const challengesectioncardStyles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: COLORS.white,
        width: SIZES.width - 32,
        height: 72,
        marginVertical: 6,
        borderRadius: 12,
        paddingHorizontal: 12,
        elevation: 1,
        shadowColor: "#FAFAFA",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      viewLeft: {
        flexDirection: "row",
        alignItems: "center",
      },
      numContainer: {
        width: 42,
        height: 42,
        borderRadius: 31,
        backgroundColor: COLORS.transparentTertiary,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 16,
      },
      num: {
        fontSize: 16,
        fontFamily: "bold",
        color: COLORS.primary,
        textAlign: "center",
      },
      title: {
        fontSize: 14,
        fontFamily: "bold",
        color: COLORS.black,
        marginBottom: 4,
      },
      duration: {
        fontSize: 12,
        color: "gray",
      },
    });

export default challengesectioncardStyles; 