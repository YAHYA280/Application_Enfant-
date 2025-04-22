
import { COLORS } from "@/constants";
import { Dimensions, StyleSheet } from "react-native";

const { width } = Dimensions.get('window');

const questionComponentStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: COLORS.white,
  },
  mediaContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  mediaImage: {
    width: width - 64,
    height: 200,
    borderRadius: 8,
  },
  questionContainer: {
    marginBottom: 20,
  },
  questionText: {
    fontSize: 18,
    fontFamily: "bold",
    marginBottom: 10,
  },
  optionButton: {
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS.gray,
    borderRadius: 8,
    marginVertical: 5,
  },
  selectedOption: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  optionText: {
    textAlign: "center",
    fontFamily: "medium",
  },
  textInput: {
    borderWidth: 1,
    borderColor: COLORS.gray,
    borderRadius: 8,
    padding: 10,
    minHeight: 100,
  },
  submitButton: {
    backgroundColor: COLORS.primary,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  submitButtonText: {
    color: COLORS.white,
    textAlign: "center",
    fontFamily: "bold",
  },
});

export default questionComponentStyles; 