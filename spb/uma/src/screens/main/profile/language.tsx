import React, { useContext } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ShadowedView } from 'react-native-fast-shadow';

import HeaderWithBack from '@/components/common/HeaderWithBack';
import { fontFamily, fontSize, IColorScheme, Radius } from '@/constants';
import { ThemeContext } from '@/contexts/theme';
import { hp, wp } from '@/helpers/dimensions';
import i18n from '@/helpers/i18n';
import { useLanguageStore } from '@/zustand';

const LanguageScreen: React.FC = () => {
  const { theme } = useContext(ThemeContext);
  const styles = createStyles(theme);

  const currentLanguage = useLanguageStore((s) => s.currentLanguage);
  const setLanguage = useLanguageStore((s) => s.setLanguage);

  const languages = [
    { code: 'en', name: i18n.t('profile:language.english') },
    { code: 'vi', name: i18n.t('profile:language.vietnamese') },
  ];

  const handleLanguageSelect = (langCode: string) => {
    setLanguage(langCode);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <HeaderWithBack title={i18n.t('profile.language')} />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <ShadowedView style={styles.shadowContainer}>
          <View style={styles.languageContainer}>
            {languages.map((lang) => (
              <TouchableOpacity
                key={lang.code}
                style={[
                  styles.languageItem,
                  currentLanguage === lang.code && styles.selectedLanguage,
                ]}
                onPress={() => handleLanguageSelect(lang.code)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.languageText,
                    currentLanguage === lang.code &&
                      styles.selectedLanguageText,
                  ]}
                >
                  {lang.name}
                </Text>
                {currentLanguage === lang.code && (
                  <View style={styles.checkmark}>
                    <Text style={styles.checkmarkText}>✓</Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </ShadowedView>
      </ScrollView>
    </SafeAreaView>
  );
};

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
    },
    languageContainer: {
      backgroundColor: theme.backgroundLight,
      borderRadius: Radius.md,
      overflow: 'hidden',
    },
    languageItem: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: hp(2),
      paddingHorizontal: wp(4),
      borderBottomWidth: 1,
      borderBottomColor: theme.borderLight,
    },
    selectedLanguage: {
      backgroundColor: theme.backgroundVariant,
    },
    languageText: {
      ...fontFamily.RALEWAY_MEDIUM,
      fontSize: fontSize.md,
      color: theme.textDark,
    },
    selectedLanguageText: {
      ...fontFamily.RALEWAY_BOLD,
      color: theme.primary,
    },
    checkmark: {
      width: wp(6),
      height: wp(6),
      borderRadius: wp(3),
      backgroundColor: theme.primary,
      alignItems: 'center',
      justifyContent: 'center',
    },
    checkmarkText: {
      color: theme.white,
      fontSize: fontSize.sm,
      fontWeight: 'bold',
    },
  });
};

export default LanguageScreen;




