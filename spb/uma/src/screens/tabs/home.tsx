import React, { useCallback, useContext, useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';

import Header from '@/components/common/Header';
import UnitSection from '@/components/home/UnitSection';
import { IColorScheme } from '@/constants';
import { ThemeContext } from '@/contexts/theme';
import { hp } from '@/helpers/dimensions';
import KeyboardDismissWrapper from '@/ui/KeyboardDismissWrapper';

const HomeScreen: React.FC = () => {
  const { theme } = useContext(ThemeContext);
  const styles = createStyles(theme);
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      // Add your refresh logic here
      await new Promise<void>((resolve) => setTimeout(() => resolve(), 1000));
    } finally {
      setRefreshing(false);
    }
  }, []);

  return (
    <KeyboardDismissWrapper style={styles.wrapper}>
      <View style={styles.container}>
        <Header />
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor={theme.primary}
            />
          }
          showsVerticalScrollIndicator={false}
        >
          <UnitSection title="Featured Units" />
          <UnitSection title="Nearby Units" />
        </ScrollView>
      </View>
    </KeyboardDismissWrapper>
  );
};

const createStyles = (theme: IColorScheme) =>
  StyleSheet.create({
    wrapper: {
      height: '100%',
      width: '100%',
      backgroundColor: theme.backgroundLight,
    },
    container: {
      flex: 1,
    },
    scrollView: {
      flex: 1,
    },
    scrollContent: {
      paddingBottom: hp(2),
    },
  });

export default React.memo(HomeScreen);
