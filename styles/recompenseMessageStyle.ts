import { COLORS } from "@/constants";
import { StyleSheet } from "react-native";


const recomponseMessageStyles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: COLORS.white,
      },
      header: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingVertical: 12,
      },
      backButton: {
        marginRight: 16,
      },
      backIcon: {
        width: 24,
        height: 24,
      },
      headerTitle: {
        fontSize: 18,
        fontFamily: "bold",
      },
      scrollView: {
        flex: 1,
      },
      scrollContent: {
        flexGrow: 1,
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center',
      },
      emojiContainer: {
        marginBottom: 30,
        alignItems: 'center',
        justifyContent: 'center',
      },
      emojiText: {
        fontSize: 64,
        lineHeight: 80,
      },
      messageContainer: {
        width: '100%',
        padding: 20,
        backgroundColor: COLORS.white,
        borderRadius: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
        alignItems: 'center',
        marginBottom: 30,
      },
      resultTitle: {
        fontSize: 28,
        fontFamily: "bold",
        color: "#333333",
        marginBottom: 20,
        textAlign: 'center',
      },
      messageText: {
        fontSize: 18,
        fontFamily: "medium",
        color: "#555555",
        textAlign: 'center',
        lineHeight: 28,
      },
      continueButton: {
        backgroundColor: "#FF9B71",
        paddingVertical: 16,
        paddingHorizontal: 32,
        borderRadius: 12,
        alignItems: "center",
        marginTop: 20,
        width: '80%',
      },
      continueButtonText: {
        color: COLORS.white,
        fontSize: 18,
        fontFamily: "bold",
      },
    });

export default recomponseMessageStyles; 