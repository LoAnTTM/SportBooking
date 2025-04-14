import React, { FC, useCallback, useContext, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import PagerView from 'react-native-pager-view';

import { Route, UnitTabProps } from '@/components/home/types';
import UnitTabButton from '@/components/home/UnitTabButton';
import { fontFamily, fontSize, IColorScheme } from '@/constants';
import { ThemeContext } from '@/contexts/theme';
import { hp, wp } from '@/helpers/dimensions';

const UnitTab: FC<UnitTabProps> = ({ routes, initialTabIndex = 0 }) => {
  const { theme } = useContext(ThemeContext);
  const styles = createStyles(theme);
  const viewRef = useRef<PagerView>(null);
  const [activeTab, setActiveTab] = useState(initialTabIndex);

  const handleTabSwitch = useCallback((index: number) => {
    viewRef.current?.setPage(index);
    setActiveTab(index);
  }, []);

  const renderTab = useCallback(
    (route: Route, index: number) => (
      <UnitTabButton
        key={route.key}
        route={route}
        isActive={index === activeTab}
        onPress={() => handleTabSwitch(index)}
        styles={styles}
        iconActiveColor={theme.primary}
        iconInactiveColor={theme.icon}
      />
    ),
    [activeTab, handleTabSwitch, styles, theme]
  );

  const renderPage = useCallback(
    (route: Route) => (
      <View
        key={route.key}
        style={styles.page}
        collapsable={false}
        accessibilityLabel={`${route.title} tab content`}
      >
        {route.component}
      </View>
    ),
    [styles]
  );

  return (
    <View style={styles.container} accessibilityRole="tablist">
      <View style={styles.tabBar}>
        <View style={styles.tabSwitch}>
          {routes.map((route, index) => renderTab(route, index))}
        </View>
      </View>
      <View style={styles.shadowLine} />
      <PagerView
        style={styles.pagerView}
        initialPage={initialTabIndex}
        scrollEnabled={false}
        ref={viewRef}
      >
        {routes.map(renderPage)}
      </PagerView>
    </View>
  );
};

export const createStyles = (theme: IColorScheme) =>
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
      ...fontFamily.POPPINS_REGULAR,
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
      height: 1,
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

export default UnitTab;
