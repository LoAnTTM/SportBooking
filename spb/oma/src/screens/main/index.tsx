import React, { FC } from 'react';

import ClubManagementScreen from '@/screens/main/club_management';
import AboutScreen from '@/screens/main/profile/about';
import ChangePasswordScreen from '@/screens/main/profile/change_password';
import LanguageScreen from '@/screens/main/profile/language';
import PrivacyPolicyScreen from '@/screens/main/profile/privacy';
import SecurityScreen from '@/screens/main/profile/security';
import TermsConditionsScreen from '@/screens/main/profile/terms';
import TabScreens from '@/screens/main/tab';
import UnitFormScreen from '@/screens/main/unit_form';
import UnitManagementScreen from '@/screens/main/unit_management';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

export type MainStackParamList = {
  Tabs: undefined;
  Language: undefined;
  Security: undefined;
  About: undefined;
  TermsConditions: undefined;
  PrivacyPolicy: undefined;
  ChangePassword: undefined;
  UnitManagement: undefined;
  UnitForm: {
    unitId?: string;
  };
  ClubManagement: undefined;
};

export const MainScreens: Record<string, keyof MainStackParamList> = {
  Tabs: 'Tabs',
  Language: 'Language',
  Security: 'Security',
  About: 'About',
  TermsConditions: 'TermsConditions',
  PrivacyPolicy: 'PrivacyPolicy',
  ChangePassword: 'ChangePassword',
  UnitManagement: 'UnitManagement',
  UnitForm: 'UnitForm',
  ClubManagement: 'ClubManagement'
};
const Stack = createNativeStackNavigator<MainStackParamList>();

const MainStack: FC = () => {
  return (
    <Stack.Navigator
      initialRouteName={MainScreens.Tabs}
      screenOptions={{ animation: 'slide_from_right', headerShown: false }}
    >
      <Stack.Screen name={MainScreens.Tabs} component={TabScreens} />
      <Stack.Screen
        name={MainScreens.Language}
        component={LanguageScreen}
        options={{ animation: 'slide_from_right' }}
      />
      <Stack.Screen
        name={MainScreens.Security}
        component={SecurityScreen}
        options={{ animation: 'slide_from_right' }}
      />
      <Stack.Screen
        name={MainScreens.About}
        component={AboutScreen}
        options={{ animation: 'slide_from_right' }}
      />
      <Stack.Screen
        name={MainScreens.TermsConditions}
        component={TermsConditionsScreen}
        options={{ animation: 'slide_from_right' }}
      />
      <Stack.Screen
        name={MainScreens.PrivacyPolicy}
        component={PrivacyPolicyScreen}
        options={{ animation: 'slide_from_right' }}
      />
      <Stack.Screen
        name={MainScreens.ChangePassword}
        component={ChangePasswordScreen}
        options={{ animation: 'slide_from_right' }}
      />
      <Stack.Screen
        name={MainScreens.UnitManagement}
        component={UnitManagementScreen}
        options={{ animation: 'slide_from_right' }}
      />
      <Stack.Screen
        name={MainScreens.UnitForm}
        component={UnitFormScreen}
        options={{ animation: 'slide_from_right' }}
      />
      <Stack.Screen
        name={MainScreens.ClubManagement}
        component={ClubManagementScreen}
        options={{ animation: 'slide_from_right' }}
      />
    </Stack.Navigator>
  );
};

export default MainStack;
