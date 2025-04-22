import React, { useCallback, useContext, useEffect, useState } from 'react';
import { FlatList, RefreshControl, StyleSheet } from 'react-native';

import SearchCard from '@/components/search/SearchCard';
import { IColorScheme } from '@/constants';
import { ThemeContext } from '@/contexts/theme';
import { hp } from '@/helpers/dimensions';
import { logError } from '@/helpers/logger';
import { buildSearchUnitQueryFromFilter } from '@/helpers/pagination';
import { UnitCard } from '@/services/types';
import Loading from '@/ui/Loading';
import { useLocationStore, useUnitStore } from '@/zustand';

const SearchItem = React.memo(({ item }: { item: UnitCard }) => (
  <SearchCard unitCard={item} onPress={() => {}} onPressLocation={() => {}} />
));

const SearchResult: React.FC = () => {
  const { theme } = useContext(ThemeContext);
  const styles = createStyles(theme);

  const [refreshing, setRefreshing] = useState(false);

//   const { canLoadMore, loadMore } = useUnitStore((state) => ({
//     canLoadMore: state.canLoadMore,
//     loadMore: state.loadMore,
//   }));

//   const { longitude, latitude, radius } = useLocationStore((state) => ({
//     longitude: state.longitude,
//     latitude: state.latitude,
//     radius: state.radius,
//   }));

  const search = useUnitStore((state) => state.search);
  const filter = useUnitStore((state) => state.filter);
  const unitCard = useUnitStore((state) => state.searchUnits);

//   const handleLoadMore = useCallback(() => {
//     if (!canLoadMore) {
//       return;
//     }

//     try {
//       loadMore({
//         longitude: longitude,
//         latitude: latitude,
//       });
//     } catch (error) {
//       if (error instanceof Error) {
//         logError(error as Error);
//       }
//     }
//   }, [canLoadMore, loadMore, longitude, latitude]);

//   const handleRefresh = () => {
//     setRefreshing(true);
//     try {
//       let additionParams;
//       if (filter.isNearby) {
//         additionParams = { longitude, latitude, radius };
//       }
//       const unitQuerySearch = buildSearchUnitQueryFromFilter(
//         filter,
//         additionParams
//       );
//       search(unitQuerySearch, { longitude: longitude, latitude: latitude });
//     } catch (error) {
//       logError(error as Error);
//     } finally {
//       setRefreshing(false);
//     }
//   };

  useEffect(() => {
    console.log('mounted');
    return () => {
      console.log('unmounted');
    };
  }, []);

  return (
    <FlatList
      data={unitCard}
    //   extraData={[canLoadMore]}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <SearchItem item={item} />}
    //   onEndReached={handleLoadMore}
    //   onEndReachedThreshold={0.2}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
        //   onRefresh={handleRefresh}
          tintColor={theme.primary}
        />
      }
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    //   ListFooterComponent={canLoadMore ? <Loading /> : null}
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
