import React, { FC, useContext } from 'react';
import { ActivityIndicator, StyleSheet, View, ViewStyle } from 'react-native';

import { IColorScheme, Radius } from '@/constants';
import { ThemeContext } from '@/contexts/theme';
import { hp } from '@/helpers/dimensions';

type LoadingProps = {
  isLoading?: boolean;
  color: string;
  size?: 'small' | 'large' | number;
  style?: ViewStyle;
  overlay?: boolean;
};

const Loading: FC<LoadingProps> = ({
  isLoading = true,
  color,
  size = 'large',
  style,
  overlay = false,
}) => {
  const { theme } = useContext(ThemeContext);
  const styles = createStyles(theme);

  if (!isLoading) return null;

  return (
    <View style={[styles.container, overlay ? styles.overlay : {}, style]}>
      <View style={styles.content}>
        <ActivityIndicator size={size} color={color} />
      </View>
    </View>
  );
};

const createStyles = (theme: IColorScheme) =>
  StyleSheet.create({
    container: {
      justifyContent: 'center',
      alignItems: 'center',
      padding: hp(2),
    },
    overlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: theme.backgroundDark,
      zIndex: 999,
    },
    content: {
      alignItems: 'center',
      padding: hp(2),
      borderRadius: Radius.md,
    },
  });

export default Loading;
