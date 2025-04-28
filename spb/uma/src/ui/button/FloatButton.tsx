import React, { FC } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { IColorScheme, Radius } from '@/constants';
import { ThemeContext } from '@/contexts/theme';
import { wp } from '@/helpers/dimensions';
import IconButton, { IconButtonProps } from '@/ui/button/IconButton';

interface FloatButtonProps extends Omit<IconButtonProps, 'buttonStyle'> {
  position?: 'bottomRight' | 'bottomLeft' | 'topRight' | 'topLeft' | 'center';
  margin?: {
    horizontal?: number;
    vertical?: number;
  };
  useSafeArea?: boolean;
  zIndex?: number;
  containerStyle?: ViewStyle;
  size?: 'small' | 'normal' | 'large';
}

const FloatButton: FC<FloatButtonProps> = ({
  position = 'bottomRight',
  margin = { horizontal: 16, vertical: 16 },
  useSafeArea = true,
  zIndex = 999,
  containerStyle,
  size = 'normal',
  ...restProps
}) => {
  const { theme } = React.useContext(ThemeContext);
  const insets = useSafeAreaInsets();

  // Calculate button size based on the size prop
  const buttonSize = React.useMemo(() => {
    switch (size) {
      case 'small':
        return wp(12);
      case 'large':
        return wp(18);
      case 'normal':
      default:
        return wp(15);
    }
  }, [size]);

  const positionStyles = React.useMemo(() => {
    const safeHorizontal = useSafeArea
      ? Math.max(insets.left, insets.right)
      : 0;
    const safeTop = useSafeArea ? insets.top : 0;
    const safeBottom = useSafeArea ? insets.bottom : 0;

    const horizontalMargin = margin.horizontal || 16;
    const verticalMargin = margin.vertical || 16;

    switch (position) {
      case 'bottomLeft':
        return {
          bottom: verticalMargin + safeBottom,
          left: horizontalMargin + safeHorizontal,
        };
      case 'topRight':
        return {
          top: verticalMargin + safeTop,
          right: horizontalMargin + safeHorizontal,
        };
      case 'topLeft':
        return {
          top: verticalMargin + safeTop,
          left: horizontalMargin + safeHorizontal,
        };
      case 'center':
        return {
          top: buttonSize / 2,
          left: buttonSize / 2,
          transform: [
            { translateX: -buttonSize / 2 },
            { translateY: -buttonSize / 2 },
          ],
        };
      case 'bottomRight':
      default:
        return {
          bottom: verticalMargin + safeBottom,
          right: horizontalMargin + safeHorizontal,
        };
    }
  }, [position, margin, insets, useSafeArea, buttonSize]);

  const styles = createStyles(theme, buttonSize);

  return (
    <View
      style={[styles.container, positionStyles, { zIndex }, containerStyle]}
    >
      <IconButton {...restProps} buttonStyle={[styles.button]} />
    </View>
  );
};

const createStyles = (theme: IColorScheme, size: number) =>
  StyleSheet.create({
    container: {
      position: 'absolute',
      width: size,
      height: size,
      shadowColor: theme.shadow,
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.3,
      shadowRadius: 4.65,
      elevation: 8,
    },
    button: {
      width: '100%',
      height: '100%',
      borderRadius: Radius.full,
      backgroundColor: theme.primary,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });

export default React.memo(FloatButton);
