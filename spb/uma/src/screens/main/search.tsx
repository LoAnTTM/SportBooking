import React, { FC, useContext, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useShallow } from 'zustand/shallow';

import FilterButton from '@/components/search/FilterButton';
import FilterModal from '@/components/search/FilterModal';
import SearchBar from '@/components/search/Searchbar';
import SearchResult from '@/components/search/SearchResult';
import { DEFAULT_ICON_SIZE, IColorScheme } from '@/constants';
import { ThemeContext } from '@/contexts/theme';
import { hp } from '@/helpers/dimensions';
import { deepClone } from '@/helpers/object';
import { buildSearchUnitQueryFromFilter } from '@/helpers/pagination';
import { MainStackParamList } from '@/screens/main';
import BackButton from '@/ui/button/Back';
import LeftArrowIcon from '@/ui/icon/LeftArrow';
import { initFilter, useLocationStore, useUnitStore } from '@/zustand';
import { RouteProp } from '@react-navigation/native';

type Props = {
  route?: RouteProp<MainStackParamList, 'Search'>;
};

const SearchScreen: FC<Props> = ({ route }) => {
  const showFilter = !!route?.params?.showFilter;

  const { theme } = useContext(ThemeContext);
  const styles = createStyles(theme);
  const [filterModalVisible, setFilterModalVisible] = useState(showFilter);

  const updateFilter = useUnitStore((state) => state.updateFilter);
  const resetSearch = useUnitStore((state) => state.resetSearch);
  const search = useUnitStore((state) => state.search);

  const hasFilter = useUnitStore(useShallow((state) => state.hasFilter));
  const filter = useUnitStore(useShallow((state) => state.filter));

  const { latitude, longitude } = useLocationStore(
    useShallow((s) => ({
      latitude: s.latitude,
      longitude: s.longitude,
    }))
  );

  const handleApplyFilter = () => {
    let additionParams;
    if (filter.isNearby) {
      additionParams = {
        longitude: longitude,
        latitude: latitude,
      };
    }
    const unitQuerySearch = buildSearchUnitQueryFromFilter(
      filter,
      additionParams
    );
    search(unitQuerySearch, { longitude: longitude, latitude: latitude });
  };

  useEffect(() => {
    return () => {
      resetSearch();
      updateFilter(deepClone(initFilter));
    };
  }, [resetSearch, updateFilter]);

  return (
    <View style={styles.container}>
      <View style={styles.searchHeader}>
        <BackButton
          icon={
            <LeftArrowIcon color={theme.icon} size={DEFAULT_ICON_SIZE + 4} />
          }
        />
        <SearchBar />
        <FilterButton
          onPress={() => setFilterModalVisible(true)}
          hasFilter={hasFilter()}
        />
        <FilterModal
          visible={filterModalVisible}
          onClose={() => setFilterModalVisible(false)}
          onApply={handleApplyFilter}
        />
      </View>
      <View style={styles.searchBody}>
        <SearchResult />
      </View>
    </View>
  );
};

const createStyles = (theme: IColorScheme) =>
  StyleSheet.create({
    container: {
      width: '100%',
      height: '100%',
      backgroundColor: theme.backgroundLight,
      flexDirection: 'column',
    },
    searchHeader: {
      width: '100%',
      paddingRight: hp(2),
      flexDirection: 'row',
      alignItems: 'center',
    },
    searchBody: {
      width: '100%',
      paddingHorizontal: hp(2),
      flex: 1,
      backgroundColor: theme.backgroundLight,
      flexDirection: 'column',
    },
  });

export default React.memo(SearchScreen);
