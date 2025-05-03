import React, { useContext, useEffect } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ShadowedView } from 'react-native-fast-shadow';

import { fontFamily, fontSize, IColorScheme, Radius } from '@/constants';
import { ThemeContext } from '@/contexts/theme';
import { hp, wp } from '@/helpers/dimensions';
import i18n from '@/helpers/i18n';
import { RootParamList, RootScreens } from '@/screens';
import { MainStackParamList } from '@/screens/main';
import ArrowRightIcon from '@/ui/icon/ArrowRight';
import EmailIcon from '@/ui/icon/Email';
import ProfileIcon from '@/ui/icon/Profile';
// Icons
import UserIcon from '@/ui/icon/User';
import { useAuthStore, useLanguageStore } from '@/zustand';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

// Profile Header Component
const ProfileHeader: React.FC<{
  fullName: string;
  email: string;
  theme: IColorScheme;
}> = ({ fullName, email, theme }) => {
  const styles = createHeaderStyles(theme);

  return (
    <ShadowedView style={styles.shadowContainer}>
      <View style={styles.container}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <UserIcon size={50} color={theme.white} />
          </View>
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.name}>{fullName}</Text>
          <View style={styles.emailContainer}>
            <EmailIcon size={14} color={theme.textLight} />
            <Text style={styles.email}>{email}</Text>
          </View>
        </View>
      </View>
    </ShadowedView>
  );
};

// Settings Item Component
const SettingsItem: React.FC<{
  title: string;
  icon: React.ReactNode;
  onPress: () => void;
  theme: IColorScheme;
  isLast?: boolean;
}> = ({ title, icon, onPress, theme, isLast = false }) => {
  const styles = createSettingsItemStyles(theme);

  return (
    <TouchableOpacity
      style={[styles.container, isLast && styles.lastItem]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.leftContent}>
        {icon}
        <Text style={styles.title}>{title}</Text>
      </View>
      <ArrowRightIcon size={20} color={theme.textLight} />
    </TouchableOpacity>
  );
};

// Settings Section Component
const SettingsSection: React.FC<{
  title: string;
  children: React.ReactNode;
  theme: IColorScheme;
}> = ({ title, children, theme }) => {
  const styles = createSectionStyles(theme);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <ShadowedView style={styles.shadowContainer}>
        <View style={styles.content}>
          {children}
        </View>
      </ShadowedView>
    </View>
  );
};

const ProfileScreen: React.FC = () => {
  const mainNavigation = useNavigation<NativeStackNavigationProp<MainStackParamList>>();
  const rootNavigation = useNavigation<NativeStackNavigationProp<RootParamList>>();

  const logout = useAuthStore((state) => state.logout);
  const fullName = useAuthStore((state) => state.fullName);
  const email = useAuthStore((state) => state.email);
  const { theme } = useContext(ThemeContext);
  const styles = createStyles(theme);

  // Add this to force re-render when language changes
  const currentLanguage = useLanguageStore((state) => state.currentLanguage);

  // Optional: Add effect to update navigation title if needed
  useEffect(() => {
    // If you have a navigation title that needs updating
    mainNavigation.setOptions({
      title: i18n.t('profile.title'),
    });
  }, [currentLanguage, mainNavigation]);

  const logoutHandler = async () => {
    await logout();
    rootNavigation.reset({
      index: 0,
      routes: [{ name: RootScreens.Auth }],
    });
  };

  const handleSettingPress = (setting: string) => {
    switch (setting) {
      case 'language':
        mainNavigation.navigate('Language');
        break;
      case 'security':
        mainNavigation.navigate('Security');
        break;
      case 'about':
        mainNavigation.navigate('About');
        break;
      case 'terms':
        mainNavigation.navigate('TermsConditions');
        break;
      case 'privacy':
        mainNavigation.navigate('PrivacyPolicy');
        break;
      default:
        console.log(`Navigate to ${setting}`);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <ProfileHeader
          fullName={fullName || 'User Name'}
          email={email || 'user@example.com'}
          theme={theme}
        />

        <SettingsSection title={i18n.t('profile.app_settings')} theme={theme}>
          <SettingsItem
            title={i18n.t('profile.language')}
            icon={<ProfileIcon size={22} color={theme.primary} />}
            onPress={() => handleSettingPress('language')}
            theme={theme}
          />
          <SettingsItem
            title={i18n.t('profile.security')}
            icon={<ProfileIcon size={22} color={theme.primary} />}
            onPress={() => handleSettingPress('security')}
            theme={theme}
            isLast
          />
        </SettingsSection>

        <SettingsSection title={i18n.t('profile.app_preferences')} theme={theme}>
          <SettingsItem
            title={i18n.t('profile.about')}
            icon={<ProfileIcon size={22} color={theme.primary} />}
            onPress={() => handleSettingPress('about')}
            theme={theme}
          />
          <SettingsItem
            title={i18n.t('profile.terms_conditions')}
            icon={<ProfileIcon size={22} color={theme.primary} />}
            onPress={() => handleSettingPress('terms')}
            theme={theme}
          />
          <SettingsItem
            title={i18n.t('profile.privacy_policy')}
            icon={<ProfileIcon size={22} color={theme.primary} />}
            onPress={() => handleSettingPress('privacy')}
            theme={theme}
            isLast
          />
        </SettingsSection>

        <TouchableOpacity
          style={styles.logoutButton}
          onPress={logoutHandler}
          activeOpacity={0.7}
        >
          <Text style={styles.logoutText}>{i18n.t('profile.logout')}</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

// Styles
const createHeaderStyles = (theme: IColorScheme) =>
  StyleSheet.create({
    shadowContainer: {
      borderRadius: Radius.md,
      marginBottom: hp(3),
    },
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: wp(4),
      backgroundColor: theme.backgroundLight,
      borderRadius: Radius.md,
    },
    avatarContainer: {
      marginRight: wp(4),
    },
    avatar: {
      width: wp(16),
      height: wp(16),
      borderRadius: wp(8),
      backgroundColor: theme.primary,
      justifyContent: 'center',
      alignItems: 'center',
    },
    infoContainer: {
      flex: 1,
    },
    name: {
      ...fontFamily.RALEWAY_BOLD,
      fontSize: fontSize.lg,
      color: theme.textDark,
      marginBottom: hp(0.5),
    },
    emailContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    email: {
      ...fontFamily.RALEWAY_MEDIUM,
      fontSize: fontSize.sm,
      color: theme.textLight,
      marginLeft: wp(1),
    },
  });

const createSettingsItemStyles = (theme: IColorScheme) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: hp(1.5),
      paddingHorizontal: wp(4),
      borderBottomWidth: 1,
      borderBottomColor: theme.borderLight,
    },
    lastItem: {
      borderBottomWidth: 0,
    },
    leftContent: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    title: {
      ...fontFamily.RALEWAY_MEDIUM,
      fontSize: fontSize.md,
      color: theme.textDark,
      marginLeft: wp(3),
    },
  });

const createSectionStyles = (theme: IColorScheme) =>
  StyleSheet.create({
    container: {
      marginBottom: hp(3),
    },
    title: {
      ...fontFamily.RALEWAY_BOLD,
      fontSize: fontSize.md,
      color: theme.textDark,
      marginBottom: hp(1),
      paddingHorizontal: wp(2),
    },
    shadowContainer: {
      borderRadius: Radius.md,
    },
    content: {
      backgroundColor: theme.backgroundLight,
      borderRadius: Radius.md,
      overflow: 'hidden',
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
    logoutButton: {
      backgroundColor: theme.error,
      paddingVertical: hp(1.5),
      borderRadius: Radius.md,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: hp(2),
    },
    logoutText: {
      ...fontFamily.RALEWAY_BOLD,
      fontSize: fontSize.md,
      color: theme.white,
    },
  });
};

export default ProfileScreen;
