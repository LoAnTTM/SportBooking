import React, { FC, memo } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { ShadowedView } from 'react-native-fast-shadow';

import UnitPrice from '@/components/home/UnitPrice';
import { DEFAULT_ICON_SIZE, fontFamily, fontSize, IColorScheme, Radius } from '@/constants';
import { ThemeContext } from '@/contexts/theme';
import { hp, wp } from '@/helpers/dimensions';
import { UnitCard as UnitCardObject } from '@/services/types';
import FullFillLocationIcon from '@/ui/icon/FullFillLocation';
import MoveLocation from '@/ui/icon/MoveLocation';
import { UnitRenderTypes } from '@/zustand';
import { PLACEHOLDER_IMAGE } from '@env';

interface UnitCardProps {
  unitCard: UnitCardObject;
  onPress: () => void;
  unitRenderType: UnitRenderTypes;
  onPressLocation: (id: string, unitType: UnitRenderTypes) => void;
}

const UnitCard: FC<UnitCardProps> = ({
  unitCard,
  onPress,
  unitRenderType,
  onPressLocation,
}) => {
  const { theme } = React.useContext(ThemeContext);
  const styles = createStyles(theme);

  return (
    <ShadowedView style={styles.shadowBox}>
      <Pressable
        style={({ pressed }) => [styles.container, pressed && styles.pressed]}
        onPress={onPress}
      >
        <View style={styles.imageContainer}>
          <Image
            source={{
              uri:
                unitCard.image.length > 0
                  ? unitCard.image[0]
                  : PLACEHOLDER_IMAGE,
            }}
            style={styles.image}
            resizeMode="cover"
          />
        </View>
        <View style={styles.content}>
          <View style={styles.headerRow}>
            <Text style={styles.title} numberOfLines={1}>
              {unitCard.title}
            </Text>
            <Pressable
              style={styles.distanceContainer}
              onPress={() => onPressLocation(unitCard.id, unitRenderType)}
            >
              <MoveLocation color={theme.icon} size={DEFAULT_ICON_SIZE - 8} />
              <Text style={styles.distance}>{unitCard.distance}</Text>
            </Pressable>
          </View>
          <View style={styles.addressRow}>
            <FullFillLocationIcon
              color={theme.primary}
              size={DEFAULT_ICON_SIZE - 8}
            />
            <Text style={styles.address} numberOfLines={1}>
              {unitCard.address}
            </Text>
          </View>
          <UnitPrice prices={unitCard.price} />
        </View>
      </Pressable>
    </ShadowedView>
  );
};

const createStyles = (theme: IColorScheme) =>
  StyleSheet.create({
    shadowBox: {
      shadowOpacity: 0.03,
      shadowRadius: 12,
      shadowOffset: {
        width: 2,
        height: 4,
      },
    },
    container: {
      width: wp(60), // Increased width
      borderRadius: Radius.lg,
      marginRight: wp(3),
      backgroundColor: theme.backgroundLight,
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
    content: {
      padding: hp(2),
    },
    addressRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: wp(1),
    },
    address: {
      ...fontFamily.POPPINS_REGULAR,
      fontSize: fontSize.xs,
      color: theme.textLight,
      flex: 1,
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
      flexDirection: 'row',
      alignItems: 'center',
      gap: wp(1),
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
