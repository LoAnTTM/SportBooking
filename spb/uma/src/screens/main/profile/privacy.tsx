import React, { useContext } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';

import HeaderWithBack from '@/components/common/HeaderWithBack';
import { fontFamily, fontSize, IColorScheme } from '@/constants';
import { ThemeContext } from '@/contexts/theme';
import { hp, wp } from '@/helpers/dimensions';
import i18n from '@/helpers/i18n';

// Section Component
const Section: React.FC<{
  title: string;
  content: string;
  theme: IColorScheme;
}> = ({ title, content, theme }) => {
  const styles = createSectionStyles(theme);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.content}>{content}</Text>
    </View>
  );
};

const PrivacyPolicyScreen: React.FC = () => {
  const { theme } = useContext(ThemeContext);
  const styles = createStyles(theme);

  const privacyContent = [
    {
      title: i18n.t('profile:privacy.section1_title'),
      content: i18n.t('profile:privacy.section1_content'),
    },
    {
      title: i18n.t('profile:privacy.section2_title'),
      content: i18n.t('profile:privacy.section2_content'),
    },
    {
      title: i18n.t('profile:privacy.section3_title'),
      content: i18n.t('profile:privacy.section3_content'),
    },
    {
      title: i18n.t('profile:privacy.section4_title'),
      content: i18n.t('profile:privacy.section4_content'),
    },
    {
      title: i18n.t('profile:privacy.section5_title'),
      content: i18n.t('profile:privacy.section5_content'),
    },
    {
      title: i18n.t('profile:privacy.section6_title'),
      content: i18n.t('profile:privacy.section6_content'),
    },
    {
      title: i18n.t('profile:privacy.section7_title'),
      content: i18n.t('profile:privacy.section7_content'),
    },
    {
      title: i18n.t('profile:privacy.section8_title'),
      content: i18n.t('profile:privacy.section8_content'),
    },
    {
      title: i18n.t('profile:privacy.section9_title'),
      content: i18n.t('profile:privacy.section9_content'),
    },
    {
      title: i18n.t('profile:privacy.section10_title'),
      content: i18n.t('profile:privacy.section10_content'),
    },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <HeaderWithBack title={i18n.t('profile:privacy_policy')} />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.lastUpdated}>
          {i18n.t('profile:privacy.last_updated')}
        </Text>

        {privacyContent.map((section, index) => (
          <Section
            key={index}
            title={section.title}
            content={section.content}
            theme={theme}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

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
    },
    content: {
      ...fontFamily.RALEWAY_MEDIUM,
      fontSize: fontSize.sm,
      color: theme.textLight,
      lineHeight: fontSize.md * 1.5,
      textAlign: 'justify',
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
    lastUpdated: {
      ...fontFamily.RALEWAY_MEDIUM,
      fontSize: fontSize.sm,
      color: theme.textLight,
      marginBottom: hp(3),
      textAlign: 'center',
    },
  });
};

export default PrivacyPolicyScreen;

