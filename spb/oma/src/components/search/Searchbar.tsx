import React, { FC, useContext, useEffect, useRef, useState } from 'react';
import { Pressable, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

import { DEFAULT_ICON_SIZE, fontFamily, fontSize, IColorScheme, Radius } from '@/constants';
import { ThemeContext } from '@/contexts/theme';
import { hp, wp } from '@/helpers/dimensions';
import { debounce } from '@/helpers/function';
import i18next from '@/helpers/i18n';
import { buildSearchUnitQueryFromFilter } from '@/helpers/pagination';
import { SearchUnitQuery } from '@/services/types';
import CloseIcon from '@/ui/icon/Close';
import Input from '@/ui/input/BaseInput';
import { useLocationStore, useUnitStore } from '@/zustand';

type SearchBarProps = {
  containerStyle?: StyleProp<ViewStyle>;
};

const SearchBar: FC<SearchBarProps> = ({ containerStyle }) => {
  const [inputValue, setInputValue] = useState<string>('');
  const { theme } = useContext(ThemeContext);
  const styles = createStyles(theme);
  const filter = useUnitStore((state) => state.filter);
  const updateFilter = useUnitStore((state) => state.updateFilter);
  const longitude = useLocationStore((state) => state.longitude);
  const latitude = useLocationStore((state) => state.latitude);
  const search = useUnitStore((state) => state.search);

  const searchRef = useRef(search);

  useEffect(() => {
    searchRef.current = search;
  }, [search]);

  const debouncedSearch = useRef(
    debounce((unitQuerySearch: SearchUnitQuery) => {
      searchRef.current({ ...unitQuerySearch }, { longitude, latitude });
    }, 1000)
  ).current;

  useEffect(() => {
    return () => {
      debouncedSearch.cancel?.();
    };
  }, [debouncedSearch]);

  const handleChangeText = (text: string) => {
    setInputValue(text);
    updateFilter({ ...filter, query: text });

    const trimmed = text.trim();
    if (trimmed.length > 0) {
      const unitQuerySearch = buildSearchUnitQueryFromFilter(filter);
      debouncedSearch(unitQuerySearch);
    } else {
      debouncedSearch.cancel?.();
    }
  };

  const handleClear = () => {
    setInputValue('');
    updateFilter({ ...filter, query: '' });
    debouncedSearch.cancel?.();
  };

  return (
    <View style={[styles.container, containerStyle]}>
      <View style={styles.inputContent}>
        <Input
          inputStyle={styles.input}
          containerStyle={styles.inputContainer}
          value={inputValue}
          onChangeText={handleChangeText}
          placeholder={i18next.t('search.placeholder')}
          type="text"
          autoFocus={true}
          error={false}
        />
        {inputValue.length > 0 && (
          <Pressable style={styles.closeIcon} onPress={handleClear}>
            <CloseIcon color={theme.icon} size={DEFAULT_ICON_SIZE - 4} />
          </Pressable>
        )}
      </View>
    </View>
  );
};

const createStyles = (theme: IColorScheme) =>
  StyleSheet.create({
    container: {
      height: hp(7),
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.backgroundLight,
      borderRadius: Radius.xs,
    },
    inputContent: {
      height: '100%',
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
    },
    inputContainer: {
      borderRadius: Radius.xxl,
      borderWidth: 1,
      borderColor: theme.borderLight,
    },
    input: {
      ...fontFamily.POPPINS_REGULAR,
      fontSize: fontSize.sm,
      height: '100%',
      flex: 1,
      color: theme.textLight,
      paddingLeft: wp(5),
      paddingRight: wp(10),
      overflow: 'hidden',
    },
    closeIcon: {
      position: 'absolute',
      right: wp(4),
    },
  });

export default SearchBar;
