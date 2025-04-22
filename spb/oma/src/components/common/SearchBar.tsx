import React, { useContext } from 'react';
import { Pressable, StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { ShadowedView } from 'react-native-fast-shadow';

import { DEFAULT_ICON_SIZE, fontFamily, fontSize, IColorScheme, Radius } from '@/constants';
import { ThemeContext } from '@/contexts/theme';
import { hp } from '@/helpers/dimensions';
import i18next from '@/helpers/i18n';
import { MainStackParamList } from '@/screens/main';
import FilterIcon from '@/ui/icon/Filter';
import SearchIcon from '@/ui/icon/Search';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type SearchBarProps = {
  containerStyle?: StyleProp<ViewStyle>;
};

const SearchBar: React.FC<SearchBarProps> = ({ containerStyle }) => {
  const navigation =
    useNavigation<NativeStackNavigationProp<MainStackParamList>>();
  const { theme } = useContext(ThemeContext);
  const styles = createStyles(theme);

  const handleSearch = () => {
    navigation.navigate('Search', { showFilter: false });
  };

  const handleFilter = () => {
    navigation.navigate('Search', { showFilter: true });
  };

  return (
    <Pressable onPress={handleSearch} style={containerStyle}>
      <ShadowedView style={styles.container}>
        <View style={styles.icon}>
          <SearchIcon color={theme.primary} />
        </View>
        <View style={styles.placeholder}>
          <Text style={styles.placeholderText1}>
            {i18next.t('search.placeholder')}
          </Text>
          <Text style={styles.placeholderText2}>
            {i18next.t('search.placeholder_description')}
          </Text>
        </View>
        <View style={styles.inputContent}>
          <View style={styles.input} />
        </View>
        <Pressable style={styles.icon} onPress={handleFilter}>
          <FilterIcon color={theme.icon} />
        </Pressable>
      </ShadowedView>
    </Pressable>
  );
};

const createStyles = (theme: IColorScheme) =>
  StyleSheet.create({
    container: {
      height: hp(7),
      width: '100%',
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.backgroundLight,
      borderRadius: Radius.xs,
      shadowColor: theme.shadow,
      shadowOffset: { width: 3, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 6,
    },
    input: {
      ...fontFamily.POPPINS_REGULAR,
      fontSize: fontSize.sm,
      height: '100%',
      flex: 1,
      color: theme.textLight,
    },
    icon: {
      paddingHorizontal: hp(2),
      height: '100%',
      justifyContent: 'center',
    },
    placeholder: {
      position: 'absolute',
      left: DEFAULT_ICON_SIZE + hp(4),
      justifyContent: 'center',
      backgroundColor: theme.backgroundLight,
      height: '100%',
      width: '100%',
    },
    placeholderText1: {
      ...fontFamily.RALEWAY_MEDIUM,
      fontSize: fontSize.sm,
      color: theme.primary,
    },
    placeholderText2: {
      ...fontFamily.RALEWAY_LIGHT,
      fontSize: fontSize.xs,
      color: theme.textLight,
    },
    inputContent: {
      height: '100%',
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
    },
  });

export default SearchBar;
