import React from 'react';

import BookingScreen from '@/screens/tabs/booking';
import ExploreScreen from '@/screens/tabs/explore';
import HomeScreen from '@/screens/tabs/home';
import ProfileScreen from '@/screens/tabs/profile';
import CalenderIcon from '@/ui/icon/Calender';
import HomeIcon from '@/ui/icon/Home';
import MapIcon from '@/ui/icon/Map';
import UserIcon from '@/ui/icon/User';
import TabBar from '@/ui/tabbar/TabBar';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const Tab = createBottomTabNavigator();

export type TabParamList = {
  Home: undefined;
  Explore: undefined;
  Booking: undefined;
  Profile: undefined;
};

export const TabScreens: Record<string, keyof TabParamList> = {
  Home: 'Home',
  Explore: 'Explore',
  Booking: 'Booking',
  Profile: 'Profile',
};

const renderTabBarIcon = (route: { name: string }, color: string) => {
  switch (route.name) {
    case TabScreens.Home:
      return <HomeIcon color={color} />;
    case TabScreens.Explore:
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
        animation: 'shift',
        tabBarIcon: ({ color }) => renderTabBarIcon(route, color),
      })}
      backBehavior="history"
    >
      <Tab.Screen name={TabScreens.Home} component={HomeScreen} />
      <Tab.Screen name={TabScreens.Explore} component={ExploreScreen} />
      <Tab.Screen name={TabScreens.Booking} component={BookingScreen} />
      <Tab.Screen name={TabScreens.Profile} component={ProfileScreen} />
    </Tab.Navigator>
  );
};

export default TabStack;
