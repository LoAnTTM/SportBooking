import React, { FC } from 'react';

import SearchScreen from '@/screens/main/search';
import TabScreens from '@/screens/main/tab';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

export type MainStackParamList = {
  Tabs: undefined;
  Search: {
    showFilter?: boolean | undefined;
  };
};

export const MainScreens: Record<string, keyof MainStackParamList> = {
  Tabs: 'Tabs',
  Search: 'Search',
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
    </Stack.Navigator>
  );
};

export default MainStack;
