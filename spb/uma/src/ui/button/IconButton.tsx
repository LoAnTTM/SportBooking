import React, { FC, useContext, useRef } from 'react';
import { Animated, Pressable, StyleProp, StyleSheet, ViewStyle } from 'react-native';

import { IColorScheme } from '@/constants';
import { ThemeContext } from '@/contexts/theme.context';
import { hp } from '@/helpers/dimensions';

interface IButtonProps {
  buttonStyle?: StyleProp<ViewStyle>;
  disable?: boolean;
  shadow?: boolean;
  onPress?: (e: any) => void;
  icon: React.ReactNode;
}

const IconButton: FC<IButtonProps> = ({
  buttonStyle,
  disable = false,
  shadow = true,
  onPress,
  icon,
}) => {
  const { theme } = useContext(ThemeContext);
  const defaultStyles = createStyle(theme);

  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0.8,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handlePressOut = () => {
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  return (
    <Animated.View
      style={{ transform: [{ scale: scaleAnim }], opacity: opacityAnim }}
    >
      <Pressable
        style={({ pressed }) => [
          defaultStyles.button,
          buttonStyle,
          shadow && defaultStyles.shadow,
          pressed && defaultStyles.pressed,
        ]}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={onPress}
        disabled={disable}
        accessibilityRole="button"
      >
        {icon}
      </Pressable>
    </Animated.View>
  );
};

const createStyle = (theme: IColorScheme) =>
  StyleSheet.create({
    button: {
      backgroundColor: theme.primary,
      alignItems: 'center',
      borderRadius: '50%',
      flexDirection: 'row',
      justifyContent: 'center',
      height: hp(7),
      width: hp(7),
    },
    shadow: {
      shadowColor: theme.shadow,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 6,
      elevation: 5,
    },
    pressed: {
      opacity: 0.85,
    },
  });

export default IconButton;
