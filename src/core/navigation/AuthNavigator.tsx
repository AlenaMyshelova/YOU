/**
 * Auth navigation stack — Login + Register.
 */
import React from "react";
import { Platform } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createStackNavigator } from "@react-navigation/stack";
import { LoginScreen, RegisterScreen } from "@features/auth";

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

const Stack =
  Platform.OS === "web"
    ? createStackNavigator<AuthStackParamList>()
    : createNativeStackNavigator<AuthStackParamList>();

export function AuthNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
      }}
    >
      <Stack.Screen name="Login">
        {({ navigation }) => (
          <LoginScreen onNavigateToRegister={() => navigation.navigate("Register")} />
        )}
      </Stack.Screen>
      <Stack.Screen name="Register">
        {({ navigation }) => (
          <RegisterScreen onNavigateToLogin={() => navigation.navigate("Login")} />
        )}
      </Stack.Screen>
    </Stack.Navigator>
  );
}
