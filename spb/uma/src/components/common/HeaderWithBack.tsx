import React, { FC, useContext } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { DEFAULT_ICON_SIZE, fontFamily, fontSize, IColorScheme } from '@/constants';
import { ThemeContext } from '@/contexts/theme';
import { hp, wp } from '@/helpers/dimensions';
import BackButton from '@/ui/button/Back';
import CloseIcon from '@/ui/icon/Close';
import LeftArrowIcon from '@/ui/icon/LeftArrow';

type HeaderProps = {
  title: string;
  isClose?: boolean;
};

const HeaderWithBack: FC<HeaderProps> = ({ title, isClose = true }) => {
  const { theme } = useContext(ThemeContext);
  const styles = createStyles(theme);

  const icon = isClose ? (
    <CloseIcon size={DEFAULT_ICON_SIZE} color={theme.icon} />
  ) : (
    <LeftArrowIcon color={theme.icon} size={DEFAULT_ICON_SIZE} />
  );

  return (
    <View style={styles.header}>
      <BackButton icon={icon} />
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
      </View>
    </View>
  );
};

const createStyles = (theme: IColorScheme) =>
  StyleSheet.create({
    header: {
      height: hp(7),
      width: '100%',
      flexDirection: 'row',
    },
    content: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingRight: wp(12),
    },
    title: {
      ...fontFamily.RALEWAY_BOLD,
      fontSize: fontSize.md,
      color: theme.textDark,
    },
  });

export default HeaderWithBack;
