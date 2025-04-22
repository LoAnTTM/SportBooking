import React, { FC } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { ShadowedView } from 'react-native-fast-shadow';

import { IColorScheme, Radius } from '@/constants';
import { ThemeContext } from '@/contexts/theme';
import { hp, wp } from '@/helpers/dimensions';

const UnitMapCardSkeleton: FC = () => {
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
    <ShadowedView style={styles.wrapper}>
      <View style={styles.container}>
        <Animated.View style={[styles.imageContainer, { opacity }]} />
        <View style={styles.content}>
          <View style={styles.headerRow}>
            <Animated.View style={[styles.titleSkeleton, { opacity }]} />
            <Animated.View style={[styles.distanceSkeleton, { opacity }]} />
          </View>
          <Animated.View style={[styles.addressSkeleton, { opacity }]} />
        </View>
      </View>
    </ShadowedView>
  );
};

const createStyles = (theme: IColorScheme) =>
  StyleSheet.create({
    wrapper: {
      width: '100%',
      height: hp(24),
      marginBottom: hp(1),
      justifyContent: 'flex-end',
      alignItems: 'center',
    },
    container: {
      width: wp(60),
      borderWidth: 1,
      borderColor: theme.borderLight,
      borderRadius: Radius.lg,
      marginRight: wp(3),
      backgroundColor: theme.backgroundLight,
      overflow: 'hidden',
      shadowOpacity: 0.03,
      shadowRadius: 12,
      shadowOffset: {
        width: 2,
        height: 4,
      },
    },
    imageContainer: {
      height: hp(14),
      width: '100%',
      backgroundColor: theme.backgroundDark,
    },
    content: {
      paddingTop: hp(2),
      paddingBottom: hp(1),
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
  });

export default UnitMapCardSkeleton;
