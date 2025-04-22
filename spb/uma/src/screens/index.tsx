import React from 'react';

import useFirstLaunch from '@/hooks/useFirstLaunch';
import useHardwareBack from '@/hooks/useHardwareBack';
import AuthScreen from '@/screens/auth';
import MainStack from '@/screens/main';
import OnBoardingScreen from '@/screens/onboarding';
import { useAuthStore } from '@/zustand';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

export type RootParamList = {
  Onboarding: undefined;
  Auth: undefined;
  Main: undefined;
};

export const RootScreens: Record<string, keyof RootParamList> = {
  Onboarding: 'Onboarding',
  Auth: 'Auth',
  Main: 'Main',
};

const Stack = createNativeStackNavigator<RootParamList>();

const RootStack: React.FC = () => {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const isFirstLaunch = useFirstLaunch();
  useHardwareBack();

  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName={
        isLoggedIn
          ? RootScreens.Main
          : isFirstLaunch
            ? RootScreens.Onboarding
            : RootScreens.Auth
      }
    >
      <Stack.Screen
        name={RootScreens.Onboarding}
        component={OnBoardingScreen}
      />
      <Stack.Screen
        name={RootScreens.Auth}
        component={AuthScreen}
        options={{ animation: 'slide_from_right' }}
      />
      <Stack.Screen name={RootScreens.Main} component={MainStack} />
    </Stack.Navigator>
  );
};

export default RootStack;
