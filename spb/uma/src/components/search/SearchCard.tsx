import React, { FC, memo } from 'react';
import { Dimensions, Pressable, StyleSheet, Text, View } from 'react-native';
import { ShadowedView } from 'react-native-fast-shadow';

import ImageSlider from '@/components/common/ImageSlider';
import UnitPrice from '@/components/home/UnitPrice';
import { DEFAULT_ICON_SIZE, fontFamily, fontSize, IColorScheme, Radius } from '@/constants';
import { ThemeContext } from '@/contexts/theme';
import { hp, wp } from '@/helpers/dimensions';
import { UnitCard } from '@/services/types';
import LocationIcon from '@/ui/icon/Location';
import MoveLocation from '@/ui/icon/MoveLocation';
import { UnitRenderTypes } from '@/zustand';

const { width: WINDOW_WIDTH } = Dimensions.get('window');

interface SearchCardProps {
  unitCard: UnitCard;
  onPress: () => void;
  onPressLocation: (id: string, unitType: UnitRenderTypes) => void;
}

const SearchCard: FC<SearchCardProps> = ({
  unitCard,
  onPress,
  onPressLocation,
}) => {
  const { theme } = React.useContext(ThemeContext);
  const styles = createStyles(theme);

  const handlePressLocation = () => {
    onPressLocation(unitCard.id, UnitRenderTypes.SEARCH);
  };

  return (
    <ShadowedView style={styles.shadowBox}>
      <View style={styles.container}>
        <ImageSlider image={unitCard.image} />
        <Pressable onPress={onPress} style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title} numberOfLines={1}>
              {unitCard.title}
            </Text>
            <Pressable
              onPress={handlePressLocation}
              style={styles.locationButton}
            >
              <MoveLocation color={theme.icon} size={DEFAULT_ICON_SIZE - 4} />
              <Text style={styles.distance}>{unitCard.distance}</Text>
            </Pressable>
          </View>
          <View style={styles.addressRow}>
            <LocationIcon color={theme.primary} size={DEFAULT_ICON_SIZE - 4} />
            <Text style={styles.address} numberOfLines={2}>
              {unitCard.address}
            </Text>
          </View>
          <UnitPrice prices={unitCard.price} />
        </Pressable>
      </View>
    </ShadowedView>
  );
};

const createStyles = (theme: IColorScheme) =>
  StyleSheet.create({
    shadowBox: {
      width: '100%',
      marginBottom: hp(4),
      shadowOpacity: 0.1,
      shadowRadius: 8,
      shadowOffset: {
        width: 3,
        height: 3,
      },
    },
    container: {
      backgroundColor: theme.backgroundLight,
      borderRadius: Radius.lg,
      overflow: 'hidden',
    },
    content: {
      padding: wp(4),
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    title: {
      ...fontFamily.POPPINS_MEDIUM,
      fontSize: fontSize.md,
      color: theme.textDark,
      flex: 1,
      marginRight: wp(2),
    },
    locationButton: {
      backgroundColor: theme.backgroundDark,
      paddingHorizontal: wp(2),
      paddingVertical: hp(0.5),
      borderRadius: Radius.sm,
      flexDirection: 'row',
      alignItems: 'center',
      gap: wp(2),
    },
    addressRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: wp(2),
    },
    address: {
      ...fontFamily.POPPINS_REGULAR,
      fontSize: fontSize.xs,
      color: theme.textLight,
      marginTop: hp(0.5),
      marginBottom: hp(1),
    },
    price: {
      ...fontFamily.RALEWAY_BOLD,
      fontSize: fontSize.xs,
      color: theme.primary,
    },
    imageOuterContainer: {
      height: hp(22),
      width: '100%',
      overflow: 'hidden',
      borderBottomRightRadius: Radius.lg,
      borderBottomLeftRadius: Radius.lg,
    },
    imageWrapper: {
      width: WINDOW_WIDTH,
      height: hp(22),
      justifyContent: 'center',
      alignItems: 'center',
      overflow: 'hidden',
    },
    image: {
      width: '100%',
      height: '100%',
    },
    distance: {
      ...fontFamily.POPPINS_REGULAR,
      fontSize: fontSize.xs,
      color: theme.textLight,
    },
    paginationContainer: {
      position: 'absolute',
      bottom: hp(1.5),
      width: '100%',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      gap: wp(1),
    },
    dot: {
      width: wp(2),
      height: wp(2),
      borderRadius: wp(1),
      backgroundColor: theme.backgroundDark,
    },
  });

export default memo(SearchCard);
