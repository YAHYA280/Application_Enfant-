import React, { useEffect, useRef, useCallback } from "react";
import { Text, StyleSheet, Animated, Easing } from "react-native";
import { COLORS } from "@/constants";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/theme/ThemeProvider";

/** ---- TYPES ---------------------------------------------------------------- */

type ToastActionType = "copy" | "like" | "dislike" | "speak" | "regenerate";

/** Extract the Ionicons name union from the component’s props */
type IoniconName = React.ComponentProps<typeof Ionicons>["name"];

interface ToastNotificationProps {
  visible: boolean;
  message: string;
  action: ToastActionType;
  onHide: () => void;
}

/** ---- ICON MAP ------------------------------------------------------------- */

const ICON_MAP: Record<ToastActionType, IoniconName> = {
  copy: "copy",
  like: "thumbs-up",
  dislike: "thumbs-down",
  speak: "volume-high",
  regenerate: "refresh",
};

const FALLBACK_ICON: IoniconName = "checkmark-circle";

/** ---- COMPONENT ------------------------------------------------------------ */

const ToastNotification: React.FC<ToastNotificationProps> = ({
  visible,
  message,
  action,
  onHide,
}) => {
  const { dark } = useTheme();

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(20)).current;

  /* ------------------------ hide animation ------------------------ */
  const hideToast = useCallback(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 20,
        duration: 300,
        easing: Easing.in(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start(onHide);
  }, [fadeAnim, translateY, onHide]);

  /* ----------------------- show & auto-hide ----------------------- */
  useEffect(() => {
    let timer: NodeJS.Timeout | undefined;

    if (visible) {
      // show animation
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: 300,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
      ]).start();

      // auto-hide
      timer = setTimeout(hideToast, 2000);
    }

    // ✅ always return a cleanup function (does nothing when timer is undefined)
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [visible, fadeAnim, translateY, hideToast]);

  /* ---------------------------- render ---------------------------- */
  if (!visible) return null;

  const iconName = ICON_MAP[action] ?? FALLBACK_ICON;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: fadeAnim,
          transform: [{ translateY }],
          backgroundColor: dark ? "rgba(40,40,40,0.9)" : "rgba(60,60,60,0.9)",
        },
      ]}
    >
      <Ionicons
        name={iconName}
        size={20}
        color={COLORS.primary}
        style={styles.icon}
      />
      <Text style={styles.message}>{message}</Text>
    </Animated.View>
  );
};

/** ---- STYLES --------------------------------------------------------------- */

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 100,
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
    maxWidth: "80%",
    zIndex: 1000,
  },
  icon: {
    marginRight: 8,
  },
  message: {
    color: "white",
    fontSize: 14,
    fontWeight: "500",
  },
});

export default ToastNotification;
