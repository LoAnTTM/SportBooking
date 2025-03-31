import React, { useContext } from 'react';
import { StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import {
  DEFAULT_ICON_SIZE,
  fontFamily,
  fontSize,
  IColorScheme,
  Radius,
} from '@/constants';
import { ThemeContext } from '@/contexts/theme.context';
import { hp } from '@/helpers/dimensions';
import BookingScreen from '@/screens/tabs/booking';
import ExploreScreen from '@/screens/tabs/explore';
import HomeScreen from '@/screens/tabs/home';
import NotifyScreen from '@/screens/tabs/notify';
import ProfileScreen from '@/screens/tabs/profile';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const Tab = createBottomTabNavigator();

export type TabParamList = {
  Home: undefined;
  Explore: undefined;
  Booking: undefined;
  Notify: undefined;
  Profile: undefined;
};

export const TabScreens: Record<string, keyof TabParamList> = {
  Home: 'Home',
  Explore: 'Explore',
  Booking: 'Booking',
  Notify: 'Notify',
  Profile: 'Profile',
};

const TabStack: React.FC = () => {
  const { theme } = useContext(ThemeContext);
  const styles = createStyles(theme);

  const renderTabBarIcon = (
    route: { name: string },
    focused: boolean,
    color: string,
    size: number
  ) => {
    let iconName = '';

    switch (route.name) {
      case TabScreens.Home:
        iconName = focused ? 'home' : 'home-outline';
        break;
      case TabScreens.Explore:
        iconName = focused ? 'location' : 'location-outline';
        break;
      case TabScreens.Booking:
        iconName = focused ? 'bag' : 'bag-outline';
        break;
      case TabScreens.Notify:
        iconName = focused ? 'notifications' : 'notifications-outline';
        break;
      case TabScreens.Profile:
        iconName = focused ? 'person' : 'person-outline';
        break;
    }

    return <Ionicons name={iconName} size={size} color={color} />;
  };

  return (
    <Tab.Navigator
      initialRouteName={TabScreens.Home}
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabBarLabelStyle,
        tabBarItemStyle: styles.tabBarItemStyle,
        tabBarActiveTintColor: theme.primary,
        tabBarHideOnKeyboard: true,
        animation: 'fade',
        tabBarIcon: ({ focused, color }) =>
          renderTabBarIcon(route, focused, color, DEFAULT_ICON_SIZE),
      })}
      backBehavior="history"
    >
      <Tab.Screen name={TabScreens.Home} component={HomeScreen} />
      <Tab.Screen name={TabScreens.Explore} component={ExploreScreen} />
      <Tab.Screen name={TabScreens.Booking} component={BookingScreen} />
      <Tab.Screen name={TabScreens.Notify} component={NotifyScreen} />
      <Tab.Screen name={TabScreens.Profile} component={ProfileScreen} />
    </Tab.Navigator>
  );
};

const createStyles = (theme: IColorScheme) => {
  return StyleSheet.create({
    tabBar: {
      height: hp(8),
      //   marginHorizontal: hp(2),
      //   marginBottom: hp(2),
      backgroundColor: theme.backgroundLight,
      borderRadius: Radius.xs,
    },
    tabBarLabelStyle: {
      ...fontFamily.RALEWAY_MEDIUM,
      fontSize: fontSize.xs,
      textAlign: 'center',
    },
    tabBarItemStyle: {
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'row',
      borderRadius: Radius.md,
    },
  });
};

export default TabStack;
