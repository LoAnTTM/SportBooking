import React, { FC } from 'react';

import Booking from '@/screens/main/booking';
import BookingSuccess from '@/screens/main/booking_success';
import Detail from '@/screens/main/detail';
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
};

export const MainScreens: Record<string, keyof MainStackParamList> = {
  Tabs: 'Tabs',
  Search: 'Search',
  Detail: 'Detail',
  Booking: 'Booking',
  BookingSuccess: 'BookingSuccess',
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
    </Stack.Navigator>
  );
};

export default MainStack;
