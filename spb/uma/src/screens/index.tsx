import React from 'react';

import useFirstLaunch from '@/hooks/useFirstLaunch';
import useHardwareBack from '@/hooks/useHardwareBack';
import ConfirmForgotPasswordScreen from '@/screens/auth/confirm_forgot_password';
import ConfirmResetPasswordScreen from '@/screens/auth/confirm_reset_password';
import ForgotPasswordScreen from '@/screens/auth/forgot_password';
import ResetPasswordScreen from '@/screens/auth/reset_password';
import AuthScreen from '@/screens/auth/tab';
import VerifyForgotPasswordScreen from '@/screens/auth/verify_forgot_password';
import VerifyRegisterScreen from '@/screens/auth/verify_register';
import OnBoardingScreen from '@/screens/onboarding';
import TabStack from '@/screens/tabs';
import { useAuthStore } from '@/zustand';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

export type ParamList = {
  Onboarding: undefined;
  Auth: undefined;
  VerifyRegister: { email: string };
  Tabs: undefined;
  ForgotPassword: undefined;
  VerifyForgotPassword: { email: string };
  ConfirmForgotPassword: { email: string; token: number };
  ResetPassword: { email: string; token: number };
  ConfirmResetPassword: undefined;
};

export const RootScreens: Record<string, keyof ParamList> = {
  Onboarding: 'Onboarding',
  Auth: 'Auth',
  Tabs: 'Tabs',
  VerifyRegister: 'VerifyRegister',
  ForgotPassword: 'ForgotPassword',
  VerifyForgotPassword: 'VerifyForgotPassword',
  ConfirmForgotPassword: 'ConfirmForgotPassword',
  ResetPassword: 'ResetPassword',
  ConfirmResetPassword: 'ConfirmResetPassword',
};

const Stack = createNativeStackNavigator<ParamList>();

const RootStack: React.FC = () => {
  const isLoggedIn = useAuthStore.use.isLoggedIn();
  const isFirstLaunch = useFirstLaunch();
  useHardwareBack();

  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName={
        isLoggedIn
          ? RootScreens.Tabs
          : isFirstLaunch
            ? RootScreens.Onboarding
            : RootScreens.Auth
      }
    >
      {!isLoggedIn && (
        <>
          <Stack.Screen
            name={RootScreens.Onboarding}
            component={OnBoardingScreen}
          />
          <Stack.Screen
            name={RootScreens.Auth}
            component={AuthScreen}
            options={{
              animation: 'slide_from_right',
            }}
          />
          <Stack.Screen
            name={RootScreens.VerifyRegister}
            component={VerifyRegisterScreen}
            options={{
              animation: 'slide_from_bottom',
            }}
          />
          <Stack.Screen
            name={RootScreens.ForgotPassword}
            component={ForgotPasswordScreen}
            options={{
              animation: 'slide_from_bottom',
            }}
          />
          <Stack.Screen
            name={RootScreens.VerifyForgotPassword}
            component={VerifyForgotPasswordScreen}
            options={{
              animation: 'slide_from_right',
            }}
          />
          <Stack.Screen
            name={RootScreens.ConfirmForgotPassword}
            component={ConfirmForgotPasswordScreen}
            options={{
              animation: 'slide_from_right',
            }}
          />
          <Stack.Screen
            name={RootScreens.ResetPassword}
            component={ResetPasswordScreen}
            options={{
              animation: 'slide_from_right',
            }}
          />
          <Stack.Screen
            name={RootScreens.ConfirmResetPassword}
            component={ConfirmResetPasswordScreen}
            options={{
              animation: 'slide_from_right',
            }}
          />
        </>
      )}
      <Stack.Screen name={RootScreens.Tabs} component={TabStack} />
    </Stack.Navigator>
  );
};

export default RootStack;
