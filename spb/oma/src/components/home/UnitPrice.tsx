import React, { FC, useContext } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { DEFAULT_ICON_SIZE, fontFamily, fontSize, IColorScheme } from '@/constants';
import { ThemeContext } from '@/contexts/theme';
import { hp, wp } from '@/helpers/dimensions';
import { UnitPrice as UnitPriceObject } from '@/services/types';
import TagIcon from '@/ui/icon/Tag';

interface UnitPriceProps {
  prices: UnitPriceObject[];
}

const UnitPrice: FC<UnitPriceProps> = ({ prices }) => {
  const { theme } = useContext(ThemeContext);
  const styles = createStyles(theme);

  return (
    <View style={styles.container}>
      {prices.map((item, index) => (
        <View key={index}>
          <View style={styles.priceRow}>
            <View style={styles.left}>
              <TagIcon size={DEFAULT_ICON_SIZE - 8} color={theme.textLight} />
              <Text style={styles.time}>
                {item.startTime} - {item.endTime}
              </Text>
            </View>
            <View style={styles.right}>
              <Text style={styles.price}>{item.price.toLocaleString()}</Text>
              <Text style={styles.icon}>₫/h</Text>
            </View>
          </View>
          {index !== prices.length - 1 && <View style={styles.divider} />}
        </View>
      ))}
    </View>
  );
};

const createStyles = (theme: IColorScheme) =>
  StyleSheet.create({
    container: {
      marginTop: hp(1),
    },
    priceRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    left: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: wp(1),
    },
    right: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: wp(1),
    },
    icon: {
      ...fontFamily.POPPINS_REGULAR,
      fontSize: fontSize.xs,
      color: theme.textLight,
    },
    time: {
      ...fontFamily.POPPINS_REGULAR,
      fontSize: fontSize.xs,
      color: theme.textLight,
    },
    price: {
      ...fontFamily.RALEWAY_BOLD,
      fontSize: fontSize.xs,
      color: theme.primary,
    },
    divider: {
      height: 1,
      backgroundColor: theme.borderDark,
      opacity: 0.08,
      marginVertical: hp(0.5),
    },
  });

export default UnitPrice;
