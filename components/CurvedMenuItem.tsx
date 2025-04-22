import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Svg, { Path } from "react-native-svg";

type CurvedMenuItemProps = {
  icon: React.ReactNode;
  label: string;
  isFirst?: boolean;
  isLast?: boolean;
};

const CurvedMenuItem: React.FC<CurvedMenuItemProps> = ({
  icon,
  label,
  isFirst = false,
  isLast = false,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.svgWrapper}>
        <Svg
          width="100%"
          height="100%"
          viewBox="0 0 130 125"
          style={StyleSheet.absoluteFillObject}
        >
          <Path
            d={`
              M ${isFirst ? "15" : "0"},0
              Q 65,-40 ${isLast ? "115" : "130"},0
              L ${isLast ? "115" : "130"},100
              Q 65,125 ${isFirst ? "15" : "0"},100
              Z
            `}
            fill="#FFFFFF"
            stroke="#00000010"
            strokeWidth="1"
          />
        </Svg>
      </View>
      <View style={styles.iconWrapper}>{icon}</View>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 130,
    height: 125,
    alignItems: "center",
    justifyContent: "center",
  },
  svgWrapper: {
    ...StyleSheet.absoluteFillObject,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
    zIndex: -1,
  },
  iconWrapper: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
    backgroundColor: "#ff8e69",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  label: {
    fontSize: 14,
    fontWeight: "700",
    textAlign: "center",
  },
});

export default CurvedMenuItem;
