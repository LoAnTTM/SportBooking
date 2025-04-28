import React, { useCallback, useContext, useEffect, useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';

import Header from '@/components/common/Header';
import UnitSection from '@/components/home/UnitSection';
import { CARD_LIST_SIZE, GEOGRAPHY_RADIUS, IColorScheme } from '@/constants';
import { ThemeContext } from '@/contexts/theme';
import { hp } from '@/helpers/dimensions';
import i18n from '@/helpers/i18n';
import { logError } from '@/helpers/logger';
import { SearchUnitQueryBuilder } from '@/helpers/pagination';
import { UnitRenderTypes, useLocationStore, useSportTypeStore, useUnitStore } from '@/zustand';

const HomeScreen: React.FC = () => {
  const { theme } = useContext(ThemeContext);
  const styles = createStyles(theme);
  const [refreshing, setRefreshing] = useState(false);

  const fetchPopularUnits = useUnitStore((s) => s.fetchPopularUnits);
  const fetchNearByUnits = useUnitStore((s) => s.fetchNearByUnits);
  const popularUnits = useUnitStore((s) => s.popularUnits);
  const nearByUnits = useUnitStore((s) => s.nearByUnits);
  const fetchSportTypes = useSportTypeStore((s) => s.fetchSportTypes);

  const getCurrentLocation = useLocationStore((s) => s.getCurrentLocation);
  const radius = useLocationStore((s) => s.radius);

  const fetchHomeData = useCallback(async () => {
    try {
      const location = await getCurrentLocation();
      const nearByQuery = new SearchUnitQueryBuilder()
        .setPageItems(CARD_LIST_SIZE)
        .setLatitude(location.latitude)
        .setLongitude(location.longitude)
        .setRadius(radius)
        .build();

      await Promise.all([
        fetchPopularUnits({
          latitude: location.latitude,
          longitude: location.longitude,
          radius: radius,
          topN: GEOGRAPHY_RADIUS,
          limit: CARD_LIST_SIZE,
        }),
        fetchNearByUnits(nearByQuery),
      ]);
    } catch (error) {
      logError(error as Error);
    }
  }, [getCurrentLocation, fetchPopularUnits, fetchNearByUnits, radius]);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await fetchHomeData();
    } catch (error) {
      logError(error as Error);
    } finally {
      setRefreshing(false);
    }
  }, [fetchHomeData]);

  useEffect(() => {
    fetchHomeData();
    fetchSportTypes();
  }, [fetchHomeData, fetchSportTypes]);

  return (
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
        <UnitSection
          title={i18n.t('home.popularity')}
          units={popularUnits}
          unitRenderType={UnitRenderTypes.POPULAR}
        />
        <UnitSection
          title={i18n.t('home.nearby')}
          units={nearByUnits}
          unitRenderType={UnitRenderTypes.NEARBY}
        />
      </ScrollView>
    </View>
  );
};

const createStyles = (theme: IColorScheme) =>
  StyleSheet.create({
    container: {
      height: '100%',
      width: '100%',
      backgroundColor: theme.backgroundLight,
    },
    scrollView: {
      flex: 1,
    },
    scrollContent: {
      paddingBottom: hp(2),
    },
  });

export default React.memo(HomeScreen);
