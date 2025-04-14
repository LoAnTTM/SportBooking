import React, { FC, memo } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import { fontFamily, fontSize, IColorScheme, Radius } from '@/constants';
import { ThemeContext } from '@/contexts/theme';
import { hp, wp } from '@/helpers/dimensions';

interface UnitCardProps {
  title: string;
  address: string;
  price: string;
  image: string;
  distance?: string;
  onPress?: () => void;
}

const UnitCard: FC<UnitCardProps> = ({
  title,
  address,
  price,
  distance,
  image,
  onPress,
}) => {
  const { theme } = React.useContext(ThemeContext);
  const styles = createStyles(theme);

  return (
    <Pressable
      style={({ pressed }) => [styles.container, pressed && styles.pressed]}
      onPress={onPress}
    >
      <Pressable style={styles.imageContainer}>
        <Image
          source={{ uri: image }}
          style={styles.image}
          resizeMode="cover"
        />
      </Pressable>
      <View style={styles.content}>
        <View style={styles.headerRow}>
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
          {distance && (
            <View style={styles.distanceContainer}>
              <Text style={styles.distance}>{distance}</Text>
            </View>
          )}
        </View>
        <Text style={styles.address} numberOfLines={1}>
          {address}
        </Text>
        <Text style={styles.price}>{price}</Text>
      </View>
    </Pressable>
  );
};

const createStyles = (theme: IColorScheme) =>
  StyleSheet.create({
    container: {
      width: wp(75), // Increased width
      borderRadius: Radius.lg,
      marginRight: wp(3),
      backgroundColor: theme.backgroundLight,
      shadowColor: theme.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 8,
      elevation: 4,
      overflow: 'hidden',
    },
    pressed: {
      opacity: 0.9,
      transform: [{ scale: 0.98 }],
    },
    imageContainer: {
      height: hp(20),
      width: '100%',
      borderTopLeftRadius: Radius.lg,
      borderTopRightRadius: Radius.lg,
      backgroundColor: theme.backgroundDark,
      overflow: 'hidden',
      position: 'relative',
    },
    image: {
      width: '100%',
      height: '100%',
    },
    placeholderImage: {
      width: '100%',
      height: '100%',
      backgroundColor: theme.backgroundDark,
    },
    pagination: {
      position: 'absolute',
      bottom: hp(1),
      left: 0,
      right: 0,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    },
    paginationDot: {
      width: 6,
      height: 6,
      borderRadius: 3,
      backgroundColor: `${theme.backgroundLight}80`,
      marginHorizontal: 4,
    },
    paginationDotActive: {
      backgroundColor: theme.backgroundLight,
      width: 8,
      height: 8,
    },
    content: {
      padding: hp(2),
    },
    address: {
      ...fontFamily.POPPINS_REGULAR,
      fontSize: fontSize.xs,
      color: theme.textLight,
      marginBottom: hp(1),
    },
    price: {
      ...fontFamily.POPPINS_BOLD,
      fontSize: fontSize.sm,
      color: theme.primary,
    },
    headerRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: hp(0.5),
    },
    distanceContainer: {
      backgroundColor: theme.backgroundDark,
      paddingHorizontal: wp(2),
      paddingVertical: hp(0.5),
      borderRadius: Radius.sm,
    },
    distance: {
      ...fontFamily.POPPINS_REGULAR,
      fontSize: fontSize.xs,
      color: theme.textLight,
    },
    title: {
      ...fontFamily.POPPINS_BOLD,
      fontSize: fontSize.sm,
      color: theme.textDark,
      flex: 1,
      marginRight: wp(2),
    },
  });

export default memo(UnitCard);
