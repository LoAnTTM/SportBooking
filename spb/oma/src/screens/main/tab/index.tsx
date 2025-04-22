import React from 'react';

import BookingScreen from '@/screens/main/tab/booking';
import HomeScreen from '@/screens/main/tab/home';
import MapScreen from '@/screens/main/tab/map';
import ProfileScreen from '@/screens/main/tab/profile';
import CalenderIcon from '@/ui/icon/Calender';
import HomeIcon from '@/ui/icon/Home';
import MapIcon from '@/ui/icon/Map';
import UserIcon from '@/ui/icon/User';
import TabBar from '@/ui/tabbar/TabBar';
import { UnitRenderTypes } from '@/zustand';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

export type TabParamList = {
  Home: undefined;
  Map: {
    unitId: string | undefined;
    renderType: UnitRenderTypes | undefined;
  };
  Booking: undefined;
  Profile: undefined;
};

export const TabScreens: Record<string, keyof TabParamList> = {
  Home: 'Home',
  Map: 'Map',
  Booking: 'Booking',
  Profile: 'Profile',
};

const Tab = createBottomTabNavigator<TabParamList>();

const renderTabBarIcon = (route: { name: string }, color: string) => {
  switch (route.name) {
    case TabScreens.Home:
      return <HomeIcon color={color} />;
    case TabScreens.Map:
      return <MapIcon color={color} />;
    case TabScreens.Booking:
      return <CalenderIcon color={color} />;
    case TabScreens.Profile:
      return <UserIcon color={color} />;
  }
};

const renderTabBar = (props: any) => <TabBar {...props} />;

const TabStack: React.FC = () => {
  return (
    <Tab.Navigator
      initialRouteName={TabScreens.Home}
      tabBar={renderTabBar}
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarHideOnKeyboard: true,
        animation: 'none',
        tabBarIcon: ({ color }) => renderTabBarIcon(route, color),
      })}
      backBehavior="history"
    >
      <Tab.Screen name={TabScreens.Home} component={HomeScreen} />
      <Tab.Screen name={TabScreens.Map} component={MapScreen} />
      <Tab.Screen name={TabScreens.Booking} component={BookingScreen} />
      <Tab.Screen name={TabScreens.Profile} component={ProfileScreen} />
    </Tab.Navigator>
  );
};

export default TabStack;
