import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ShadowedView } from 'react-native-fast-shadow';

import { IColorScheme, Radius } from '@/constants';
import { ThemeContext } from '@/contexts/theme';
import { hp } from '@/helpers/dimensions';
import { UnitCard } from '@/services/types';

type Props = {
  data: UnitCard;
  onPress?: () => void;
};

const UnitCardItem: React.FC<Props> = ({ data, onPress }) => {
  const { title, address, price, image, distance } = data;
  const firstPrice = price?.[0];
  const imageUrl = image?.[0];

  const { theme } = React.useContext(ThemeContext);
  const styles = createStyles(theme);

  return (
    <ShadowedView style={styles.wrapper}>
      <TouchableOpacity style={styles.card} onPress={onPress}>
        <Image
          source={{ uri: imageUrl }}
          style={styles.image}
          resizeMode="cover"
        />
        <View style={styles.info}>
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
          <Text style={styles.address} numberOfLines={1}>
            {address}
          </Text>
          <View style={styles.meta}>
            <Text style={styles.price}>
              {firstPrice
                ? `${firstPrice.price.toLocaleString()} ${firstPrice.currency}`
                : '—'}
            </Text>
            <Text style={styles.distance}>{distance}</Text>
          </View>
        </View>
      </TouchableOpacity>
    </ShadowedView>
  );
};

const createStyles = (theme: IColorScheme) =>
  StyleSheet.create({
    wrapper: {
      shadowOpacity: 0.06,
      shadowRadius: 12,
      shadowOffset: {
        width: 2,
        height: 4,
      },
    },
    card: {
      flexDirection: 'row',
      marginVertical: hp(1),
      backgroundColor: theme.backgroundLight,
      borderRadius: Radius.md,
      overflow: 'hidden',
    },
    image: {
      width: hp(12),
      height: hp(12),
    },
    info: {
      flex: 1,
      padding: hp(1),
      justifyContent: 'center',
    },
    title: {
      fontWeight: 'bold',
      fontSize: 16,
      marginBottom: 4,
    },
    address: {
      color: '#666',
      fontSize: 14,
      marginBottom: 4,
    },
    meta: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    price: {
      color: '#00A859',
      fontWeight: '600',
    },
    distance: {
      color: '#999',
    },
  });

export default UnitCardItem;
