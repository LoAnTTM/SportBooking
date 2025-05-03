import React, { FC, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { ShadowedView } from 'react-native-fast-shadow';
import PagerView from 'react-native-pager-view';

import { Route, UnitTabProps } from '@/components/home/types';
import UnitTabButton from '@/components/home/UnitTabButton';
import { fontFamily, fontSize, IColorScheme, Radius } from '@/constants';
import { ThemeContext } from '@/contexts/theme';
import { hp, wp } from '@/helpers/dimensions';

const UnitTab: FC<UnitTabProps> = ({ routes, initialTabIndex = 0 }) => {
  const { theme } = useContext(ThemeContext);
  const styles = createStyles(theme);
  const viewRef = useRef<PagerView>(null);
  const [activeTab, setActiveTab] = useState(initialTabIndex);
  const slideAnim = useRef(new Animated.Value(initialTabIndex * (70 + hp(3)))).current;

  const handleTabSwitch = useCallback((index: number) => {
    viewRef.current?.setPage(index);
    setActiveTab(index);

    // Animate the active indicator
    Animated.spring(slideAnim, {
      toValue: index * (70 + hp(3)),
      useNativeDriver: true,
      friction: 8,
      tension: 50,
    }).start();
  }, [slideAnim]);

  // Initialize animation position
  useEffect(() => {
    slideAnim.setValue(activeTab * (70 + hp(3)));
  }, [slideAnim, activeTab]);

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
      <ShadowedView style={styles.tabBarShadow}>
        <View style={styles.tabBar}>
          <View style={styles.tabSwitch}>
            {routes.map((route, index) => renderTab(route, index))}

            {/* Animated indicator */}
            <Animated.View
              style={[
                styles.activeIndicator,
                {
                  transform: [{ translateX: slideAnim }],
                }
              ]}
            />
          </View>
        </View>
      </ShadowedView>

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
    tabBarShadow: {
      marginBottom: hp(2),
      borderRadius: Radius.md,
      shadowColor: theme.shadow,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    tabBar: {
      backgroundColor: theme.backgroundLight,
      borderRadius: Radius.md,
      paddingVertical: hp(1.5),
      paddingHorizontal: wp(2),
    },
    tabSwitch: {
      flexDirection: 'row',
      gap: hp(3),
      borderRadius: Radius.md,
      position: 'relative',
    },
    tab: {
      alignItems: 'center',
      width: 70,
      gap: hp(0.5),
      paddingVertical: hp(1),
      zIndex: 1,
    },
    tabText: {
      ...fontFamily.POPPINS_MEDIUM,
      fontSize: fontSize.xs,
      color: theme.textLight,
    },
    activeIndicator: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      width: 70,
      height: '100%',
      backgroundColor: `${theme.primary}15`, // 15% opacity
      borderRadius: Radius.md,
      zIndex: 0,
    },
    pagerView: {
      width: '100%',
      height: '100%',
    },
    page: {
      flex: 1,
    },
  });

export default UnitTab;
