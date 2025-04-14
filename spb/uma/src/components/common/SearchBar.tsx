import React, { FC } from 'react';
import { StyleSheet, View } from 'react-native';

import Search from '@/ui/search/Search';

const SearchBar: FC = () => {
  const styles = createStyles();

  return (
    <View style={styles.container}>
      <Search onSearch={() => {}} />
    </View>
  );
};
const createStyles = () =>
  StyleSheet.create({
    container: {
      width: '100%',
      flexDirection: 'row',
    },
  });
export default SearchBar;
