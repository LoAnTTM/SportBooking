import React, { FC, useContext } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { DEFAULT_ICON_SIZE, fontFamily, fontSize, IColorScheme, Radius } from '@/constants';
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
        <View key={index} style={styles.priceCard}>
          <View style={styles.priceRow}>
            <View style={styles.left}>
              <View style={styles.iconContainer}>
                <TagIcon size={DEFAULT_ICON_SIZE - 6} color={theme.icon} />
              </View>
              <Text style={styles.time}>
                {item.startTime} - {item.endTime}
              </Text>
            </View>
            <View style={styles.right}>
              <Text style={styles.price}>{item.price.toLocaleString()}</Text>
              <Text style={styles.unit}>₫/h</Text>
            </View>
          </View>
        </View>
      ))}
    </View>
  );
};

const createStyles = (theme: IColorScheme) =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.backgroundLight,
    },
    priceCard: {
      paddingVertical: hp(0.3),
    },
    priceRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    left: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: wp(2),
    },
    iconContainer: {
      width: hp(3.2),
      height: hp(3.2),
      justifyContent: 'center',
      alignItems: 'center',
    },
    right: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: `${theme.primary}10`,
      paddingVertical: hp(0.5),
      paddingHorizontal: wp(2),
      borderRadius: Radius.sm,
    },
    unit: {
      ...fontFamily.POPPINS_REGULAR,
      fontSize: fontSize.xs,
      color: theme.textLight,
      marginLeft: wp(1),
    },
    time: {
      ...fontFamily.POPPINS_MEDIUM,
      fontSize: fontSize.xs,
      color: theme.textLight,
    },
    price: {
      ...fontFamily.RALEWAY_BOLD,
      fontSize: fontSize.xs,
      color: theme.primary,
    },
  });

export default UnitPrice;
