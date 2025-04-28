import React, { useCallback, useContext, useState } from 'react';
import { FlatList, RefreshControl, StyleSheet } from 'react-native';
import { useShallow } from 'zustand/shallow';

import SearchCard from '@/components/search/SearchCard';
import { IColorScheme } from '@/constants';
import { ThemeContext } from '@/contexts/theme';
import { hp } from '@/helpers/dimensions';
import { logError } from '@/helpers/logger';
import { buildSearchUnitQueryFromFilter } from '@/helpers/pagination';
import { MainStackParamList } from '@/screens/main';
import { UnitCard } from '@/services/types';
import Loading from '@/ui/Loading';
import { UnitRenderTypes, useLocationStore, useUnitStore } from '@/zustand';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

const SearchItem = React.memo(({ item }: { item: UnitCard }) => {
  const navigation =
    useNavigation<NativeStackNavigationProp<MainStackParamList>>();

  const handlePressUnit = () => {
    navigation.navigate('Detail', {
      unitId: item.id,
    });
  };

  const handlePressLocation = () => {
    //@ts-ignore
    navigation.navigate('Tabs', {
      screen: 'Map',
      params: {
        unitId: item.id,
        renderType: UnitRenderTypes.NEARBY,
      },
    });
  };

  return (
    <SearchCard
      unitCard={item}
      onPress={handlePressUnit}
      onPressLocation={handlePressLocation}
    />
  );
});

const SearchResult: React.FC = () => {
  const { theme } = useContext(ThemeContext);
  const styles = createStyles(theme);

  const [refreshing, setRefreshing] = useState(false);
  const canLoadMore = useUnitStore(useShallow((state) => state.canLoadMore));
  const loadMore = useUnitStore((state) => state.loadMore);

  const { latitude, longitude } = useLocationStore(
    useShallow((s) => ({
      latitude: s.latitude,
      longitude: s.longitude,
    }))
  );

  const search = useUnitStore((state) => state.search);
  const filter = useUnitStore((state) => state.filter);
  const unitCard = useUnitStore((state) => state.searchUnits);
  const isLoading = useUnitStore((state) => state.isLoading);

  const handleLoadMore = useCallback(() => {
    if (!canLoadMore) {
      return;
    }

    try {
      loadMore({
        longitude: longitude,
        latitude: latitude,
      });
    } catch (error) {
      if (error instanceof Error) {
        logError(error as Error);
      }
    }
  }, [canLoadMore, loadMore, longitude, latitude]);

  const handleRefresh = () => {
    setRefreshing(true);
    try {
      let additionParams;
      if (filter.isNearby) {
        additionParams = { longitude, latitude };
      }
      const unitQuerySearch = buildSearchUnitQueryFromFilter(
        filter,
        additionParams
      );
      search(unitQuerySearch, { longitude: longitude, latitude: latitude });
    } catch (error) {
      logError(error as Error);
    } finally {
      setRefreshing(false);
    }
  };

  if (isLoading) {
    return <Loading color={theme.primary} />;
  }

  return (
    <FlatList
      data={unitCard}
      extraData={[canLoadMore]}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <SearchItem item={item} />}
      onEndReached={handleLoadMore}
      onEndReachedThreshold={0.2}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={handleRefresh}
          tintColor={theme.primary}
        />
      }
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      ListFooterComponent={
        canLoadMore ? <Loading color={theme.primary} /> : null
      }
    />
  );
};

const createStyles = (theme: IColorScheme) =>
  StyleSheet.create({
    content: {
      paddingBottom: hp(1),
    },
    loading: {
      textAlign: 'center',
      paddingVertical: hp(1),
      color: theme.textLight,
    },
  });

export default React.memo(SearchResult);
