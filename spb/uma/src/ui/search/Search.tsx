import React, { useContext, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { IColorScheme, Radius } from '@/constants';
import { ThemeContext } from '@/contexts/theme';
import { hp } from '@/helpers/dimensions';
import { useSearchAnimation } from '@/hooks/useSearchAnimation';
import SearchBar from '@/ui/search/SearchBar';
import { SearchResults } from '@/ui/search/SearchResults';
import { SearchProps } from '@/ui/search/types';

const Search: React.FC<SearchProps> = ({
  placeholder = 'Search',
  onSearch,
  results = [],
}) => {
  const [query, setQuery] = useState('');
  const fadeAnim = useSearchAnimation(results.length);
  const { theme } = useContext(ThemeContext);
  const styles = createStyles(theme);

  const handleSearch = () => {
    onSearch(query);
  };

  return (
    <View style={styles.container}>
      <SearchBar
        placeholder={placeholder}
        query={query}
        onQueryChange={setQuery}
        onSubmit={handleSearch}
      />
      {results.length > 0 && (
        <SearchResults results={results} fadeAnim={fadeAnim} styles={styles} />
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
  });

export default Search;
