import React, { FC, useContext } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

import { fontFamily, fontSize, IColorScheme } from '@/constants';
import { ThemeContext } from '@/contexts/theme';
import { hp, wp } from '@/helpers/dimensions';

interface NotFoundProps {
  message?: string;
}

const NotFound: FC<NotFoundProps> = ({
  message = 'No results found',
}) => {
  const { theme } = useContext(ThemeContext);
  const styles = createStyles(theme);

  return (
    <View style={styles.container}>
      <Image
        source={require('../../../assets/images/not-found.png')}
        style={styles.image}
        resizeMode="contain"
      />
      <Text style={styles.message}>{message}</Text>
    </View>
  );
};

const createStyles = (theme: IColorScheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: wp(4),
    },
    image: {
      width: wp(60),
      height: wp(60),
      marginBottom: hp(2),
    },
    message: {
      ...fontFamily.POPPINS_MEDIUM,
      fontSize: fontSize.md,
      color: theme.textLight,
      textAlign: 'center',
    },
  });

export default NotFound;
