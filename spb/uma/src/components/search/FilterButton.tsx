import React, { FC, useContext } from 'react';
import { Pressable, StyleSheet } from 'react-native';

import { DEFAULT_ICON_SIZE, IColorScheme } from '@/constants';
import { ThemeContext } from '@/contexts/theme';
import { wp } from '@/helpers/dimensions';
import FilterIcon from '@/ui/icon/Filter';

type FilterButtonProps = {
  onPress: () => void;
  hasFilter: boolean;
};

const FilterButton: FC<FilterButtonProps> = ({ onPress, hasFilter }) => {
  const { theme } = useContext(ThemeContext);
  const styles = createStyles(theme);
  return (
    <Pressable
      onPress={onPress}
      hitSlop={10}
      style={[styles.container, hasFilter && styles.active]}
    >
      <FilterIcon
        color={hasFilter ? theme.white : theme.icon}
        size={DEFAULT_ICON_SIZE + 4}
      />
    </Pressable>
  );
};

const createStyles = (theme: IColorScheme) =>
  StyleSheet.create({
    container: {
      padding: wp(2),
      borderRadius: 8,
      //   backgroundColor: theme.secondary,
      alignItems: 'center',
      justifyContent: 'center',
      marginLeft: wp(2),
      borderWidth: 1,
      borderColor: theme.borderLight,
    },
    active: {
      backgroundColor: theme.primary,
    },
  });

export default FilterButton;
