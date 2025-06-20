import { Image } from "expo-image";
import Checkbox from "expo-checkbox";
import { useNavigation } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useState, useEffect, useReducer, useCallback } from "react";
import {
  View,
  Text,
  Alert,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";

import Input from "@/components/Input";

import Header from "../components/Header";
import Button from "../components/Button";
import { useTheme } from "../theme/ThemeProvider";
import { reducer } from "../utils/reducers/formReducers";
import { SIZES, icons, COLORS, images } from "../constants";
import { validateInput } from "../utils/actions/formActions";

type Nav = {
  navigate: (value: string) => void;
};

const isTestMode = true;

const initialState = {
  inputValues: {
    email: isTestMode ? "example@gmail.com" : "",
  },
  inputValidities: {
    email: false,
  },
  formIsValid: false,
};
// Forgot password email screen
const ForgotPasswordEmail = () => {
  const { navigate } = useNavigation<Nav>();
  const [formState, dispatchFormState] = useReducer(reducer, initialState);
  const [error] = useState(null);
  const [isChecked, setChecked] = useState(false);
  const { colors } = useTheme();

  const inputChangedHandler = useCallback(
    (inputId: string, inputValue: string) => {
      const result = validateInput(inputId, inputValue);
      dispatchFormState({
        inputId,
        validationResult: result,
        inputValue,
      });
    },
    [dispatchFormState]
  );

  useEffect(() => {
    if (error) {
      Alert.alert("An error occured", error);
    }
  }, [error]);

  return (
    <SafeAreaView style={[styles.area, { backgroundColor: colors.background }]}>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Header title="Mot de passe oublié" />
        <ScrollView
          style={{ marginVertical: 54 }}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.logoContainer}>
            <Image
              source={images.logo}
              contentFit="contain"
              style={styles.logo}
            />
          </View>
          <Text
            style={[
              styles.title,
              {
                color: COLORS.black,
              },
            ]}
          >
            Entrez votre adresse email
          </Text>
          <Input
            id="email"
            onInputChanged={inputChangedHandler}
            errorText={formState.inputValidities.email}
            placeholder="Email"
            placeholderTextColor={COLORS.black}
            icon={icons.email}
            keyboardType="email-address"
          />
          <View style={styles.checkBoxContainer}>
            <View style={{ flexDirection: "row" }}>
              <Checkbox
                style={styles.checkbox}
                value={isChecked}
                color={isChecked ? COLORS.primary : "gray"}
                onValueChange={setChecked}
              />
              <View style={{ flex: 1 }}>
                <Text
                  style={[
                    styles.privacy,
                    {
                      color: COLORS.black,
                    },
                  ]}
                >
                  Se souvenir de moi
                </Text>
              </View>
            </View>
          </View>
          <Button
            title="Réinitialiser le mot de passe"
            filled
            onPress={() => navigate("otpverification")}
            style={styles.button}
          />
          <TouchableOpacity onPress={() => navigate("login")}>
            <Text style={styles.forgotPasswordBtnText}>
              Vous vous souvenez du mot de passe ?
            </Text>
          </TouchableOpacity>
          <View />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  area: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: COLORS.white,
  },
  logo: {
    width: 100,
    height: 100,
  },
  logoContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 32,
  },
  title: {
    fontSize: 24,
    fontFamily: "bold",
    color: COLORS.black,
    textAlign: "center",
    marginBottom: 16,
  },
  checkBoxContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 18,
  },
  checkbox: {
    marginRight: 8,
    height: 16,
    width: 16,
    borderRadius: 4,
    borderColor: COLORS.primary,
    borderWidth: 2,
  },
  privacy: {
    fontSize: 12,
    fontFamily: "regular",
    color: COLORS.black,
  },
  button: {
    marginVertical: 6,
    width: SIZES.width - 32,
    borderRadius: 30,
  },
  forgotPasswordBtnText: {
    fontSize: 16,
    fontFamily: "semiBold",
    color: COLORS.primary,
    textAlign: "center",
    marginTop: 12,
  },
});

export default ForgotPasswordEmail;
