import { COLORS } from "@/constants";
import { Dimensions, StyleSheet } from "react-native";

const { width } = Dimensions.get('window');


const questionviewsreenStyles = StyleSheet.create({
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
  exerciseContainer: {
    flex: 1,
    padding: 16,
  },
  exerciseTitle: {
    fontSize: 22,
    fontFamily: "bold",
    marginBottom: 16,
  },
  mediaContainer: {
    alignItems: 'center',
    marginVertical: 10,
  },
  mediaImage: {
    width: width - 64,
    height: 150,
    borderRadius: 8,
  },
  resultsContainer: {
    flex: 1,
    padding: 16,
  },
  resultsTitle: {
    fontSize: 32,
    fontFamily: "medium",
    marginBottom: 10,
    color: "#FF9B71",
    textAlign: "center",
  },
  scoreText: {
    fontSize: 22,
    fontFamily: "bold",
    marginBottom: 30,
    textAlign: "center",
    color: "#333333",
  },
  resultsStats: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 30,
    padding: 20,
    backgroundColor: COLORS.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#EEEEEE",
  },
  statsItem: {
    alignItems: "center",
  },
  statsNumber: {
    fontSize: 28,
    fontFamily: "bold",
    marginBottom: 5,
    color: "#333333",
  },
  statsLabel: {
    fontSize: 16,
    color: "#999999",
    fontFamily: "medium",
  },
  resultsSectionTitle: {
    fontSize: 20,
    fontFamily: "bold",
    marginBottom: 15,
    color: "#333333",
  },
  resultsList: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  resultItemContainer: {
    padding: 16,
    marginBottom: 15,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  resultItemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  resultItemTitle: {
    fontSize: 16,
    fontFamily: "bold",
    color: "#333333",
  },
  resultItemStatus: {
    fontSize: 16,
    fontFamily: "bold",
  },
  resultItemQuestion: {
    fontSize: 16,
    marginBottom: 12,
    color: "#333333",
    fontFamily: "medium",
  },
  resultItemAnswer: {
    fontSize: 16,
    fontStyle: "italic",
    color: "#666666",
    fontFamily: "medium",
    marginBottom: 8,
  },
  resultItemCorrectAnswer: {
    fontSize: 16,
    fontStyle: "italic",
    color: "#669966",
    fontFamily: "medium",
  },
  doneButton: {
    backgroundColor: "#FF9B71",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 20,
  },
  doneButtonText: {
    color: COLORS.white,
    fontSize: 18,
    fontFamily: "bold",
  },
});

export default questionviewsreenStyles; 