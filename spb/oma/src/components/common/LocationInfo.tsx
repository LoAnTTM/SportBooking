import React, { FC, useContext } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { fontFamily, fontSize, IColorScheme } from '@/constants';
import { ThemeContext } from '@/contexts/theme';
import { wp } from '@/helpers/dimensions';
import LocationIcon from '@/ui/icon/Location';

interface LocationInfoProps {
  title: string;
  subtitle: string;
  onPress?: () => void;
}

const LocationInfo: FC<LocationInfoProps> = ({ title, subtitle, onPress }) => {
  const { theme } = useContext(ThemeContext);
  const styles = createStyles(theme);

  return (
    <Pressable style={styles.container} onPress={onPress}>
      <View style={styles.icon}>
        <LocationIcon color={theme.primary} />
      </View>
      <View>
        <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
          {title}
        </Text>
        <Text style={styles.subtitle} numberOfLines={1} ellipsizeMode="tail">
          {subtitle}
        </Text>
      </View>
    </Pressable>
  );
};

const createStyles = (theme: IColorScheme) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    icon: {
      marginRight: wp(2),
    },
    title: {
      ...fontFamily.POPPINS_BOLD,
      fontSize: fontSize.sm,
      color: theme.textDark,
      maxWidth: wp(50),
      lineHeight: 20,
    },
    subtitle: {
      ...fontFamily.POPPINS_REGULAR,
      fontSize: fontSize.xs,
      color: theme.textLight,
      lineHeight: 18,
      maxWidth: wp(50),
      marginTop: 2,
    },
  });

export default LocationInfo;
