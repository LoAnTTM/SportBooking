import React, { FC, useContext } from 'react';
import { Image, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import AuthTabView from '@/components/auth/AuthTabView';
import { fontFamily, fontSize, IColorScheme, Radius } from '@/constants';
import { ThemeContext } from '@/contexts/theme';
import { hp, wp } from '@/helpers/dimensions';
import LoginScreen from '@/screens/auth/tab/login';
import RegisterScreen from '@/screens/auth/tab/register';

const AuthScreen: FC = () => {
  const { theme } = useContext(ThemeContext);
  const styles = createStyles(theme);

  const AuthRoutes = [
    { key: 'login', component: <LoginScreen />, title: 'Sign In' },
    { key: 'register', component: <RegisterScreen />, title: 'Sign Up' },
  ];

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
        <View style={styles.tabView}>
          <AuthTabView routes={AuthRoutes} theme={theme} />
        </View>
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
      justifyContent: 'space-between',
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
      borderTopLeftRadius: Radius.lg,
      borderTopRightRadius: Radius.lg,
      backgroundColor: theme.backgroundLight,
      shadowColor: theme.shadow,
      shadowOffset: { width: 0, height: -4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 10,
    },
  });
};

export default AuthScreen;
