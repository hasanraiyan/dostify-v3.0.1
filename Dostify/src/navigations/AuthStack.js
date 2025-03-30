import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/AuthScreens/LoginScreen';

import SplashScreen from '../screens/AuthScreens/SplashScreen';
import SignupScreen from '../screens/AuthScreens/SignupScreen';
import ForgotPasswordScreen from '../screens/AuthScreens/ForgotPasswordScreen';
const Stack = createNativeStackNavigator();

const AuthStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="SplashScreen" component={SplashScreen} />
      <Stack.Screen name="LoginScreen" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
      <Stack.Screen name="ForgotPasswordScreen" component={ForgotPasswordScreen} />
    </Stack.Navigator>
  );
};

export default AuthStack;
