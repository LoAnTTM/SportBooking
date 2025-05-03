import React, { FC, useContext } from 'react';
import { Image, ScrollView, StyleSheet, View } from 'react-native';
import { ShadowedView } from 'react-native-fast-shadow';
import { SafeAreaView } from 'react-native-safe-area-context';

import { fontFamily, fontSize, IColorScheme, Radius } from '@/constants';
import { ThemeContext } from '@/contexts/theme';
import { hp, wp } from '@/helpers/dimensions';
import LoginScreen from '@/screens/auth/tab/login';

const AuthScreen: FC = () => {
  const { theme } = useContext(ThemeContext);
  const styles = createStyles(theme);

  return (
    <SafeAreaView style={styles.safeView}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.header}>
          <View style={styles.logo}>
            <Image
              style={styles.image}
              resizeMode="contain"
              source={require('../../../../assets/images/logo.png')}
            />
          </View>
        </View>
        <ShadowedView style={styles.tabView}>
          <LoginScreen />
        </ShadowedView>
      </ScrollView>
    </SafeAreaView>
  );
};

const createStyles = (theme: IColorScheme) => {
  return StyleSheet.create({
    safeView: {
      flex: 1,
    },
    container: {
      flex: 1,
      backgroundColor: theme.backgroundLight,
    },
    scrollContent: {
      flexGrow: 1,
      justifyContent: 'center', // Changed from space-between to center for vertical centering
    },
    header: {
      paddingVertical: hp(2),
      paddingHorizontal: wp(4),
    },
    logo: {
      height: hp(8),
      width: hp(20),
    },
    image: {
      width: '100%',
      height: '100%',
    },
    titleContainer: {
      flex: 1,
    },
    title: {
      ...fontFamily.RALEWAY_BOLD,
      fontSize: fontSize.xxl,
      paddingVertical: hp(1),
      textAlign: 'center',
    },
    tabView: {
      flex: 1,
	  width: '100%',
      borderRadius: Radius.lg, // Changed to full border radius
      backgroundColor: theme.backgroundLight,
      shadowColor: theme.shadow,
      shadowOffset: { width: 0, height: 0 }, // Changed to create shadow on all sides
      shadowOpacity: 0.15,
      shadowRadius: 8,
      marginVertical: hp(4), // Added vertical margin
    },
  });
};

export default AuthScreen;
