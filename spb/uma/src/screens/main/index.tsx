import React, { FC } from 'react';

import Booking from '@/screens/main/booking';
import BookingSuccess from '@/screens/main/booking_success';
import Detail from '@/screens/main/detail';
import AboutScreen from '@/screens/main/profile/about';
import ChangePasswordScreen from '@/screens/main/profile/change_password';
import LanguageScreen from '@/screens/main/profile/language';
import PrivacyPolicyScreen from '@/screens/main/profile/privacy';
import SecurityScreen from '@/screens/main/profile/security';
import TermsConditionsScreen from '@/screens/main/profile/terms';
import SearchScreen from '@/screens/main/search';
import TabScreens from '@/screens/main/tab';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

export type MainStackParamList = {
  Tabs: undefined;
  Search: {
    showFilter?: boolean | undefined;
  };
  Detail: {
    unitId: string;
  };
  Booking: undefined;
  BookingSuccess: undefined;
  Language: undefined;
  Security: undefined;
  About: undefined;
  TermsConditions: undefined;
  PrivacyPolicy: undefined;
  ChangePassword: undefined;
};

export const MainScreens: Record<string, keyof MainStackParamList> = {
  Tabs: 'Tabs',
  Search: 'Search',
  Detail: 'Detail',
  Booking: 'Booking',
  BookingSuccess: 'BookingSuccess',
  Language: 'Language',
  Security: 'Security',
  About: 'About',
  TermsConditions: 'TermsConditions',
  PrivacyPolicy: 'PrivacyPolicy',
  ChangePassword: 'ChangePassword',
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
        name={MainScreens.Search}
        component={SearchScreen}
        options={{ animation: 'fade_from_bottom' }}
        initialParams={{ showFilter: false }}
      />
      <Stack.Screen
        name={MainScreens.Detail}
        component={Detail}
        options={{ animation: 'fade_from_bottom' }}
        initialParams={{ unitId: undefined }}
      />
      <Stack.Screen
        name={MainScreens.Booking}
        component={Booking}
        options={{ animation: 'slide_from_right' }}
      />
      <Stack.Screen
        name={MainScreens.BookingSuccess}
        component={BookingSuccess}
        options={{ animation: 'slide_from_right', gestureEnabled: false }}
      />
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
    </Stack.Navigator>
  );
};

export default MainStack;
