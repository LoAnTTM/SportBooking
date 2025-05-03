import React from 'react';

import BookingsScreen from '@/screens/main/tab/bookings';
import ClubHomeScreen from '@/screens/main/tab/home';
import ProfileScreen from '@/screens/main/tab/profile';
import CalendarIcon from '@/ui/icon/Calendar';
import CategoryIcon from '@/ui/icon/Category';
import HomeIcon from '@/ui/icon/Home';
import UserIcon from '@/ui/icon/User';
import TabBar from '@/ui/tabbar/TabBar';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

export type TabStackList = {
  Home: undefined;
  Bookings: undefined;
  Profile: undefined;
};

export const TabScreens: Record<string, keyof TabStackList> = {
  Home: 'Home',
  Bookings: 'Bookings',
  Profile: 'Profile',
};

const Tab = createBottomTabNavigator<TabStackList>();

const renderTabBarIcon = (route: { name: string }, color: string) => {
  switch (route.name) {
    case TabScreens.Home:
      return <HomeIcon color={color} />;
    case TabScreens.Bookings:
      return <CalendarIcon color={color} />;
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
      <Tab.Screen name={TabScreens.Home} component={ClubHomeScreen} />
      <Tab.Screen name={TabScreens.Bookings} component={BookingsScreen} />
      <Tab.Screen name={TabScreens.Profile} component={ProfileScreen} />
    </Tab.Navigator>
  );
};

export default TabStack;
