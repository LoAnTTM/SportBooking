import React, { FC, ReactNode, useContext, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import PagerView from 'react-native-pager-view';
import Ionicons from 'react-native-vector-icons/Ionicons';

import {
  DEFAULT_ICON_SIZE,
  fontFamily,
  fontSize,
  IColorScheme,
} from '@/constants';
import { ThemeContext } from '@/contexts/theme.context';
import { hp, wp } from '@/helpers/dimensions';

interface Route {
  key: string;
  component: ReactNode;
  title: string;
  icon: string;
}

interface ITabViewProps {
  routes: Route[];
}

const TabLink: FC<{
  route: Route;
  isActive: boolean;
  onPress: () => void;
  styles: ReturnType<typeof createStyles>;
  iconActiveColor?: string;
  iconInactiveColor?: string;
}> = ({
  route,
  isActive,
  onPress,
  styles,
  iconActiveColor,
  iconInactiveColor,
}) => (
  <Pressable
    onPress={onPress}
    style={[styles.tab]}
    accessibilityRole="tab"
    accessibilityState={{ selected: isActive }}
  >
    <Ionicons
      name={route.icon}
      size={DEFAULT_ICON_SIZE}
      color={isActive ? iconActiveColor : iconInactiveColor}
    />
    <Text style={[styles.tabText]}>{route.title}</Text>
  </Pressable>
);

const UnitTabView: FC<ITabViewProps> = ({ routes }) => {
  const { theme } = useContext(ThemeContext);
  const styles = createStyles(theme);
  const viewRef = useRef<PagerView>(null);
  const [activeTab, setActiveTab] = useState(0);

  const handleTabSwitch = (index: number) => {
    viewRef.current?.setPage(index);
    setActiveTab(index);
  };

  return (
    <View style={styles.container} accessibilityRole="tablist">
      <View style={styles.tabBar}>
        <View style={styles.tabSwitch}>
          {routes.map((route, index) => (
            <TabLink
              key={route.key}
              route={route}
              isActive={index === activeTab}
              onPress={() => handleTabSwitch(index)}
              styles={styles}
              iconActiveColor={theme.primary}
              iconInactiveColor={theme.icon}
            />
          ))}
        </View>
        <View>
          <Text>sort</Text>
        </View>
      </View>
      <View style={styles.shadowLine} />
      <PagerView
        style={styles.pagerView}
        initialPage={0}
        scrollEnabled={false}
        ref={viewRef}
      >
        {routes.map((route) => (
          <View
            key={route.key}
            style={styles.page}
            collapsable={false}
            accessibilityLabel={`${route.title} tab content`}
          >
            {route.component}
          </View>
        ))}
      </PagerView>
    </View>
  );
};

const createStyles = (theme: IColorScheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: wp(4),
    },
    tabBar: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    tabSwitch: {
      flexDirection: 'row',
      backgroundColor: theme.backgroundDark,
      gap: hp(3),
      borderRadius: 6,
    },
    tab: {
      alignItems: 'center',
      width: 70,
      gap: 2,
      paddingBottom: hp(1),
    },
    tabText: {
      ...fontFamily.POPPINS_MEDIUM,
      fontSize: fontSize.xs,
      color: theme.textLight,
    },
    pagerView: {
      width: '100%',
      height: '100%',
    },
    page: {
      flex: 1,
    },
    shadowLine: {
      backgroundColor: theme.borderLight,
      height: 2,
      width: wp(100),
      transform: [{ translateX: -wp(4) }],
      shadowColor: theme.textLight,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 6,
    },
  });

export default UnitTabView;
