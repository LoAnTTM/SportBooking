import React, { FC, useContext } from 'react';
import { StyleSheet, View } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';

import { DEFAULT_ICON_SIZE } from '@/constants';
import { ThemeContext } from '@/contexts/theme.context';
import { hp } from '@/helpers/dimensions';
import IconButton from '@/ui/button/IconButton';
import Search from '@/ui/search/Search';

const SearchBar: FC = () => {
  const { theme } = useContext(ThemeContext);
  const styles = createStyles();

  return (
    <View style={styles.container}>
      <Search theme={theme} onSearch={() => {}} />
      <IconButton
        icon={
          <Feather
            name="sliders"
            size={DEFAULT_ICON_SIZE}
            color={theme.secondary}
          />
        }
      />
    </View>
  );
};
const createStyles = () => {
  return StyleSheet.create({
    container: {
      width: '100%',
      padding: hp(2),
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignContent: 'center',
      gap: hp(2),
    },
  });
};
export default SearchBar;
