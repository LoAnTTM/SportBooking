import React, { FC, ReactNode, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import PagerView from 'react-native-pager-view';

import { fontFamily, fontSize, IColorScheme } from '@/constants';
import { hp, wp } from '@/helpers/dimensions';

interface Route {
  key: string;
  component: ReactNode;
  title: string;
}

interface ITabViewProps {
  routes: Route[];
  theme: IColorScheme;
}

const TabButton: FC<{
  route: Route;
  isActive: boolean;
  onPress: () => void;
  styles: ReturnType<typeof createStyles>;
}> = ({ route, isActive, onPress, styles }) => (
  <Pressable
    style={[styles.tab, isActive && styles.activeTab]}
    onPress={onPress}
    accessibilityRole="tab"
    accessibilityState={{ selected: isActive }}
  >
    <Text style={styles.tabText}>{route.title}</Text>
  </Pressable>
);

const AuthTabView: FC<ITabViewProps> = ({ routes, theme }) => {
  const styles = createStyles(theme);
  const viewRef = useRef<PagerView>(null);
  const [activeTab, setActiveTab] = useState(0);

  const handleTabSwitch = (index: number) => {
    viewRef.current?.setPage(index);
    setActiveTab(index);
  };

  return (
    <View style={styles.container} accessibilityRole="tablist">
      <View style={styles.tabSwitch}>
        {routes.map((route, index) => (
          <TabButton
            key={route.key}
            route={route}
            isActive={index === activeTab}
            onPress={() => handleTabSwitch(index)}
            styles={styles}
          />
        ))}
      </View>
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
    },
    tabSwitch: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      backgroundColor: theme.backgroundDark,
      gap: hp(1),
      marginTop: hp(4),
      marginHorizontal: wp(4),
      borderRadius: 6,
    },
    tab: {
      paddingVertical: 5,
      borderRadius: 6,
      flex: 1,
      margin: 3,
      alignItems: 'center',
    },
    activeTab: {
      backgroundColor: theme.backgroundLight,
    },
    tabText: {
      ...fontFamily.POPPINS_MEDIUM,
      fontSize: fontSize.sm,
    },
    pagerView: {
      width: '100%',
      height: '100%',
    },
    page: {
      flex: 1,
    },
  });

export default AuthTabView;
