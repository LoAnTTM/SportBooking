import React, { useContext, useEffect, useState } from 'react';
import {
  SafeAreaView, ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View
} from 'react-native';
import { ShadowedView } from 'react-native-fast-shadow';
import { useShallow } from 'zustand/shallow';

import HeaderWithBack from '@/components/common/HeaderWithBack';
import { fontFamily, fontSize, IColorScheme, Radius } from '@/constants';
import { ThemeContext } from '@/contexts/theme';
import { hp, wp } from '@/helpers/dimensions';
import i18n from '@/helpers/i18n';
import { RootParamList } from '@/screens';
import { useAuthStore } from '@/zustand';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

// Security Setting Item Component
const SecurityItem: React.FC<{
  title: string;
  description: string;
  isToggled: boolean;
  onToggle: (value: boolean) => void;
  theme: IColorScheme;
}> = ({ title, description, isToggled, onToggle, theme }) => {
  const styles = createSecurityItemStyles(theme);

  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
      </View>
      <Switch
        value={isToggled}
        onValueChange={onToggle}
        trackColor={{ false: theme.disable, true: theme.primary }}
        thumbColor={theme.white}
      />
    </View>
  );
};

const SecurityScreen: React.FC = () => {
  const { theme } = useContext(ThemeContext);
  const styles = createStyles(theme);
  const navigation = useNavigation<NativeStackNavigationProp<RootParamList>>();

  const rememberMe = useAuthStore(useShallow((state) => state.rememberMe));
  const setRememberMe = useAuthStore((state) => state.setRememberMe);

  const handleChangePassword = () => {
	// @ts-ignore
    navigation.navigate('Main', { screen: 'ChangePassword' });
  };

  const handleRememberMeToggle = (value: boolean) => {
    setRememberMe(value);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <HeaderWithBack title={i18n.t('profile.security')} />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <ShadowedView style={styles.shadowContainer}>
          <View style={styles.securityContainer}>
            <SecurityItem
              title={i18n.t('profile:security.remember_me')}
              description={i18n.t('profile:security.remember_description')}
              isToggled={rememberMe}
              onToggle={handleRememberMeToggle}
              theme={theme}
            />
          </View>
        </ShadowedView>

        <TouchableOpacity
          style={styles.changePasswordButton}
          activeOpacity={0.7}
          onPress={handleChangePassword}
        >
          <Text style={styles.changePasswordText}>
            {i18n.t('profile:security.change_password')}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const createSecurityItemStyles = (theme: IColorScheme) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: hp(2),
      paddingHorizontal: wp(4),
    },
    textContainer: {
      flex: 1,
      marginRight: wp(4),
    },
    title: {
      ...fontFamily.RALEWAY_BOLD,
      fontSize: fontSize.md,
      color: theme.textDark,
      marginBottom: hp(0.5),
    },
    description: {
      ...fontFamily.RALEWAY_MEDIUM,
      fontSize: fontSize.sm,
      color: theme.textLight,
    },
  });

const createStyles = (theme: IColorScheme) => {
  return StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: theme.backgroundLight,
    },
    container: {
      flex: 1,
      backgroundColor: theme.backgroundContent,
    },
    scrollContent: {
      padding: wp(4),
      paddingBottom: hp(6),
    },
    shadowContainer: {
      borderRadius: Radius.md,
      marginBottom: hp(3),
    },
    securityContainer: {
      backgroundColor: theme.backgroundLight,
      borderRadius: Radius.md,
      overflow: 'hidden',
    },
    changePasswordButton: {
      backgroundColor: theme.primary,
      paddingVertical: hp(1.5),
      borderRadius: Radius.md,
      alignItems: 'center',
      justifyContent: 'center',
    },
    changePasswordText: {
      ...fontFamily.RALEWAY_BOLD,
      fontSize: fontSize.md,
      color: theme.white,
    },
  });
};

export default SecurityScreen;
