import React, { FC } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { ShadowedView } from 'react-native-fast-shadow';

import { IColorScheme, Radius } from '@/constants';
import { ThemeContext } from '@/contexts/theme';
import { hp, wp } from '@/helpers/dimensions';

const UnitCardSkeleton: FC = () => {
  const { theme } = React.useContext(ThemeContext);
  const styles = createStyles(theme);
  const animatedValue = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );

    animation.start();

    return () => animation.stop();
  }, [animatedValue]);

  const opacity = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  return (
    <ShadowedView style={styles.container}>
      <Animated.View style={[styles.imageContainer, { opacity }]} />
      <View style={styles.content}>
        <View style={styles.headerRow}>
          <Animated.View style={[styles.titleSkeleton, { opacity }]} />
          <Animated.View style={[styles.distanceSkeleton, { opacity }]} />
        </View>
        <Animated.View style={[styles.addressSkeleton, { opacity }]} />
        <Animated.View style={[styles.priceSkeleton, { opacity }]} />
      </View>
    </ShadowedView>
  );
};

const createStyles = (theme: IColorScheme) =>
  StyleSheet.create({
    container: {
      width: wp(75),
      borderRadius: Radius.lg,
      marginRight: wp(3),
      backgroundColor: theme.backgroundLight,
      shadowColor: theme.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 8,
      overflow: 'hidden',
    },
    imageContainer: {
      height: hp(20),
      width: '100%',
      backgroundColor: theme.backgroundDark,
    },
    content: {
      padding: hp(2),
    },
    headerRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: hp(0.5),
    },
    titleSkeleton: {
      height: hp(2.5),
      width: '60%',
      backgroundColor: theme.backgroundDark,
      borderRadius: Radius.sm,
    },
    distanceSkeleton: {
      height: hp(2.5),
      width: wp(15),
      backgroundColor: theme.backgroundDark,
      borderRadius: Radius.sm,
    },
    addressSkeleton: {
      height: hp(2),
      width: '80%',
      backgroundColor: theme.backgroundDark,
      borderRadius: Radius.sm,
      marginBottom: hp(1),
    },
    priceSkeleton: {
      height: hp(2.5),
      width: '40%',
      backgroundColor: theme.backgroundDark,
      borderRadius: Radius.sm,
    },
  });

export default UnitCardSkeleton;
