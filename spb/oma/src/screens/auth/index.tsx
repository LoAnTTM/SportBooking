import React, { FC } from 'react';

import ConfirmForgotPasswordScreen from '@/screens/auth/confirm_forgot_password';
import ConfirmResetPasswordScreen from '@/screens/auth/confirm_reset_password';
import ForgotPasswordScreen from '@/screens/auth/forgot_password';
import ResetPasswordScreen from '@/screens/auth/reset_password';
import AuthScreen from '@/screens/auth/tab';
import VerifyForgotPasswordScreen from '@/screens/auth/verify_forgot_password';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

export type AuthStackParamList = {
  Login: undefined;
  ForgotPassword: undefined;
  VerifyForgotPassword: { email: string };
  ConfirmForgotPassword: { email: string; token: number };
  ResetPassword: { email: string; token: number };
  ConfirmResetPassword: undefined;
};

export const RootScreens: Record<string, keyof AuthStackParamList> = {
  Login: 'Login',
  ForgotPassword: 'ForgotPassword',
  VerifyForgotPassword: 'VerifyForgotPassword',
  ConfirmForgotPassword: 'ConfirmForgotPassword',
  ResetPassword: 'ResetPassword',
  ConfirmResetPassword: 'ConfirmResetPassword',
};

const Stack = createNativeStackNavigator();

const AuthStack: FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName={RootScreens.Login}
    >
      <Stack.Screen
        name={RootScreens.Login}
        component={AuthScreen}
        options={{ animation: 'slide_from_right' }}
      />
      <Stack.Screen
        name={RootScreens.ForgotPassword}
        component={ForgotPasswordScreen}
        options={{ animation: 'slide_from_bottom' }}
      />
      <Stack.Screen
        name={RootScreens.VerifyForgotPassword}
        component={VerifyForgotPasswordScreen}
        options={{ animation: 'slide_from_right' }}
      />
      <Stack.Screen
        name={RootScreens.ConfirmForgotPassword}
        component={ConfirmForgotPasswordScreen}
        options={{ animation: 'slide_from_right' }}
      />
      <Stack.Screen
        name={RootScreens.ResetPassword}
        component={ResetPasswordScreen}
        options={{ animation: 'slide_from_right' }}
      />
      <Stack.Screen
        name={RootScreens.ConfirmResetPassword}
        component={ConfirmResetPasswordScreen}
        options={{ animation: 'slide_from_right' }}
      />
    </Stack.Navigator>
  );
};

export default AuthStack;
