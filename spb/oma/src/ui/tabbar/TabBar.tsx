import React, { useContext, useEffect, useRef, useState } from 'react';
import { Animated, Keyboard, StyleSheet, TouchableWithoutFeedback, View } from 'react-native';
import { ShadowedView } from 'react-native-fast-shadow';

import { DEFAULT_ICON_SIZE, IColorScheme } from '@/constants';
import { ThemeContext } from '@/contexts/theme';
import { hp } from '@/helpers/dimensions';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';

const TabBar: React.FC<BottomTabBarProps> = ({
  state,
  descriptors,
  navigation,
}) => {
  const { theme } = useContext(ThemeContext);
  const styles = createStyles(theme);

  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const keyboardDidShow = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardVisible(true);
    });
    const keyboardDidHide = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardVisible(false);
    });

    return () => {
      keyboardDidShow.remove();
      keyboardDidHide.remove();
    };
  }, []);

  const animations = useRef(
    state.routes.map(() => ({
      iconOpacity: new Animated.Value(1),
      translateY: new Animated.Value(0),
    }))
  ).current;

  useEffect(() => {
    animations.forEach((anim, index) => {
      const isFocused = state.index === index;

      Animated.parallel([
        Animated.timing(anim.translateY, {
          toValue: isFocused ? -16 : 0,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    });
  }, [state.index, animations]);

  if (isKeyboardVisible) {
    return null;
  }

  return (
    <ShadowedView style={styles.wrapper}>
      <View style={styles.container}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;
          const anim = animations[index];

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          const color = isFocused ? theme.white : theme.textLight;

          const icon =
            options.tabBarIcon &&
            options.tabBarIcon({
              color,
              focused: isFocused,
              size: DEFAULT_ICON_SIZE,
            });

          return (
            <TouchableWithoutFeedback key={route.key} onPress={onPress}>
              <View style={styles.tabItem}>
                <Animated.View
                  // eslint-disable-next-line react-native/no-inline-styles
                  style={{
                    transform: [
                      { translateY: anim.translateY },
                    ],
                    shadowColor: isFocused ? theme.primary : 'transparent',
                    elevation: isFocused ? 18 : 0,
                    backgroundColor: isFocused ? theme.primary : 'transparent',
                    padding: isFocused ? 18 : 0,
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.3,
                    shadowRadius: 6,
                    borderRadius: 30,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {icon}
                </Animated.View>
              </View>
            </TouchableWithoutFeedback>
          );
        })}
      </View>
    </ShadowedView>
  );
};

const createStyles = (theme: IColorScheme) =>
  StyleSheet.create({
    wrapper: {
      backgroundColor: theme.backgroundLight,
      height: hp(8),
      shadowColor: theme.shadow,
      shadowOffset: {
        width: 0,
        height: -2,
      },
      shadowOpacity: 0.15,
      shadowRadius: 4,
      zIndex: 1000,
      position: 'relative',
      borderTopWidth: 0.5,
      borderTopColor: `${theme.shadow}10`,
    },
    container: {
      flexDirection: 'row',
      flex: 1,
      backgroundColor: theme.backgroundLight,
    },
    tabItem: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });

export default TabBar;
