import React, { useContext } from 'react';
import { Image, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { ShadowedView } from 'react-native-fast-shadow';

import HeaderWithBack from '@/components/common/HeaderWithBack';
import { fontFamily, fontSize, IColorScheme, Radius } from '@/constants';
import { ThemeContext } from '@/contexts/theme';
import { hp, wp } from '@/helpers/dimensions';
import i18n from '@/helpers/i18n';

// Info Item Component
const InfoItem: React.FC<{
  label: string;
  value: string;
  theme: IColorScheme;
  isLast?: boolean;
}> = ({ label, value, theme, isLast = false }) => {
  const styles = createInfoItemStyles(theme);

  return (
    <View style={[styles.container, isLast && styles.lastItem]}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
};

const AboutScreen: React.FC = () => {
  const { theme } = useContext(ThemeContext);
  const styles = createStyles(theme);

  return (
    <SafeAreaView style={styles.safeArea}>
      <HeaderWithBack title={i18n.t('profile.about')} />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.logoContainer}>
          <Image
            source={require('../../../../assets/images/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.appName}>UMA App</Text>
          <Text style={styles.appVersion}>Version 1.0.0</Text>
        </View>

        <ShadowedView style={styles.shadowContainer}>
          <View style={styles.infoContainer}>
            <InfoItem label="Developer" value="UMA Team" theme={theme} />
            <InfoItem
              label="Contact"
              value="support@uma-app.com"
              theme={theme}
            />
            <InfoItem
              label="Website"
              value="www.uma-app.com"
              theme={theme}
              isLast
            />
          </View>
        </ShadowedView>

        <View style={styles.descriptionContainer}>
          <Text style={styles.descriptionTitle}>About UMA</Text>
          <Text style={styles.descriptionText}>
            UMA is a sports facility booking application that helps users find
            and book sports venues easily. Our mission is to make sports
            accessible to everyone by simplifying the booking process.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const createInfoItemStyles = (theme: IColorScheme) =>
  StyleSheet.create({
    container: {
      paddingVertical: hp(1.5),
      paddingHorizontal: wp(4),
      borderBottomWidth: 1,
      borderBottomColor: theme.borderLight,
    },
    lastItem: {
      borderBottomWidth: 0,
    },
    label: {
      ...fontFamily.RALEWAY_BOLD,
      fontSize: fontSize.sm,
      color: theme.textLight,
      marginBottom: hp(0.5),
    },
    value: {
      ...fontFamily.RALEWAY_MEDIUM,
      fontSize: fontSize.md,
      color: theme.textDark,
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
      alignItems: 'center',
    },
    logoContainer: {
      alignItems: 'center',
      marginBottom: hp(4),
    },
    logo: {
      width: wp(30),
      height: wp(30),
      marginBottom: hp(2),
    },
    appName: {
      ...fontFamily.RALEWAY_BOLD,
      fontSize: fontSize.xl,
      color: theme.textDark,
      marginBottom: hp(0.5),
    },
    appVersion: {
      ...fontFamily.RALEWAY_MEDIUM,
      fontSize: fontSize.md,
      color: theme.textLight,
    },
    shadowContainer: {
      borderRadius: Radius.md,
      width: '100%',
      marginBottom: hp(3),
    },
    infoContainer: {
      backgroundColor: theme.backgroundLight,
      borderRadius: Radius.md,
      overflow: 'hidden',
    },
    descriptionContainer: {
      width: '100%',
      paddingHorizontal: wp(2),
    },
    descriptionTitle: {
      ...fontFamily.RALEWAY_BOLD,
      fontSize: fontSize.lg,
      color: theme.textDark,
      marginBottom: hp(1),
    },
    descriptionText: {
      ...fontFamily.RALEWAY_MEDIUM,
      fontSize: fontSize.md,
      color: theme.textLight,
      lineHeight: fontSize.md * 1.5,
      textAlign: 'justify',
    },
  });
};

export default AboutScreen;
