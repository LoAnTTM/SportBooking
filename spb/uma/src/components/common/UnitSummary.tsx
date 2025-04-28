import React, { FC, useContext } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import UnitPrice from '@/components/home/UnitPrice';
import { DEFAULT_ICON_SIZE, fontFamily, fontSize, IColorScheme, Radius } from '@/constants';
import { ThemeContext } from '@/contexts/theme';
import { hp, wp } from '@/helpers/dimensions';
import { UnitCard } from '@/services/types';
import FullFillLocationIcon from '@/ui/icon/FullFillLocation';

type Props = {
  unit: UnitCard;
};

const UnitSummary: FC<Props> = ({ unit }) => {
  const { theme } = useContext(ThemeContext);
  const styles = createStyles(theme);

  return (
    <View style={styles.unitSummary}>
      <Text style={styles.unitName}>{unit.title}</Text>

      <View style={styles.addressContainer}>
        <FullFillLocationIcon
          size={DEFAULT_ICON_SIZE - 4}
          color={theme.primary}
        />
        <Text style={styles.addressText} numberOfLines={2}>
          {unit.address}
        </Text>
      </View>

      {unit.price && unit.price.length > 0 && <UnitPrice prices={unit.price} />}
    </View>
  );
};

const createStyles = (theme: IColorScheme) =>
  StyleSheet.create({
    unitSummary: {
      marginTop: hp(2),
      padding: wp(4),
      backgroundColor: theme.backgroundLight,
      borderRadius: Radius.md,
      borderWidth: 1,
      borderColor: theme.borderLight,
    },
    unitName: {
      ...fontFamily.POPPINS_BOLD,
      fontSize: fontSize.md,
      color: theme.textDark,
      marginBottom: hp(1),
    },
    addressContainer: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      marginBottom: hp(1),
      gap: wp(2),
    },
    addressText: {
      ...fontFamily.POPPINS_ITALIC,
      fontSize: fontSize.xs,
      color: theme.textLight,
      flex: 1,
    },
  });

export default UnitSummary;
