import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { DEFAULT_ICON_SIZE, fontFamily, fontSize, IColorScheme, Radius } from '@/constants';
import { hp } from '@/helpers/dimensions';
import { useSearchAnimation } from '@/hooks/useSearchAnimation';
import { SearchBar } from '@/ui/search/SearchBar';
import { SearchResults } from '@/ui/search/SearchResults';
import { SearchProps } from '@/ui/search/types';

const Search: React.FC<SearchProps> = ({
  placeholder = 'Search...',
  onSearch,
  theme,
  containerStyle,
  searchBarStyle,
  inputStyle,
  resultPanelStyle,
  results = [],
}) => {
  const [query, setQuery] = useState('');
  const fadeAnim = useSearchAnimation(results.length);
  const styles = createStyles(theme);

  const handleSearch = () => {
    onSearch(query);
  };

  return (
    <View style={[styles.container, containerStyle]}>
      <SearchBar
        placeholder={placeholder}
        query={query}
        onQueryChange={setQuery}
        onSubmit={handleSearch}
        styles={styles}
        searchBarStyle={searchBarStyle}
        inputStyle={inputStyle}
        theme={theme}
      />
      {results.length > 0 && (
        <SearchResults
          results={results}
          fadeAnim={fadeAnim}
          styles={styles}
          resultPanelStyle={resultPanelStyle}
        />
      )}
    </View>
  );
};

const createStyles = (theme: IColorScheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      height: hp(7),
      borderRadius: Radius.xs,
      backgroundColor: theme.backgroundLight,
    },
    searchBar: {
      height: '100%',
      width: '100%',
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.backgroundLight,
      paddingHorizontal: hp(1),
      borderRadius: Radius.xs,
      shadowColor: theme.shadow,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 6,
      elevation: 5,
      overflow: 'hidden',
    },
    input: {
      ...fontFamily.POPPINS_REGULAR,
      fontSize: fontSize.sm,
      height: '100%',
      flex: 1,
      color: theme.textLight,
    },
    icon: {
      padding: hp(1.2),
    },
    placeholder: {
      position: 'absolute',
      left: DEFAULT_ICON_SIZE + hp(3),
      justifyContent: 'center',
      backgroundColor: theme.backgroundLight,
      height: '100%',
      width: '100%',
      paddingHorizontal: hp(1),
      transform: [{ translateY: 0 }],
    },
    placeholderText1: {
      ...fontFamily.RALEWAY_MEDIUM,
      fontSize: fontSize.sm,
      color: theme.primary,
      margin: 0,
    },
    placeholderText2: {
      ...fontFamily.RALEWAY_LIGHT,
      fontSize: fontSize.xs,
      color: theme.textLight,
    },
    inputContent: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
    },
    resultPanel: {
      marginTop: 10,
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 5,
      padding: 10,
    },
    resultText: {
      paddingVertical: 5,
    },
  });

export default Search;
