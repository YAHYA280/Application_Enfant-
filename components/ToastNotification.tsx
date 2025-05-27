import { Ionicons } from "@expo/vector-icons";
import React, { useRef, useEffect, useCallback } from "react";
import { Text, Easing, Animated, StyleSheet } from "react-native";

import { COLORS } from "@/constants";
import { useTheme } from "@/theme/ThemeProvider";

type ToastActionType = "copy" | "like" | "dislike" | "speak" | "regenerate";

type IoniconName = React.ComponentProps<typeof Ionicons>["name"];

interface ToastNotificationProps {
  visible: boolean;
  message: string;
  action: ToastActionType;
  onHide: () => void;
}

const ICON_MAP: Record<ToastActionType, IoniconName> = {
  copy: "copy",
  like: "thumbs-up",
  dislike: "thumbs-down",
  speak: "volume-high",
  regenerate: "refresh",
};

const FALLBACK_ICON: IoniconName = "checkmark-circle";

const ToastNotification: React.FC<ToastNotificationProps> = ({
  visible,
  message,
  action,
  onHide,
}) => {
  const { dark } = useTheme();

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(20)).current;

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

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;

    if (visible) {
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

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [visible, fadeAnim, translateY, hideToast]);

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
