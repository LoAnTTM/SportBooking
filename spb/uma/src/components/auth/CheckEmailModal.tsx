import React, { FC, useContext } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import VectorIcon from 'react-native-vector-icons/Fontisto';

import {
  DEFAULT_ICON_SIZE,
  fontFamily,
  fontSize,
  IColorScheme,
} from '@/constants';
import { ThemeContext } from '@/contexts/theme.context';
import { hp, wp } from '@/helpers/dimensions';
import i18next from '@/helpers/i18n';
import BaseModal from '@/ui/modal/BaseModal';

type Props = {
  visible: boolean;
  onClose: () => void;
};

const CheckEmailModal: FC<Props> = ({ visible, onClose }) => {
  const { theme } = useContext(ThemeContext);
  const styles = createStyles(theme);

  return (
    <BaseModal visible={visible} onClose={onClose}>
      <View style={styles.container}>
        <View style={styles.icon}>
          <VectorIcon
            name="email"
            color={theme.backgroundLight}
            size={DEFAULT_ICON_SIZE}
          />
        </View>
        <View style={styles.notify}>
          <Text style={styles.title}>{i18next.t('forgot.popup.title')}</Text>
          <Text style={styles.description}>
            {i18next.t('forgot.popup.description')}
          </Text>
        </View>
      </View>
    </BaseModal>
  );
};

const createStyles = (theme: IColorScheme) => {
  return StyleSheet.create({
    container: {
      backgroundColor: theme.backgroundLight,
      width: wp(80),
      height: hp(25),
      borderRadius: wp(2),
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: hp(2),
      shadowColor: theme.shadow,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 6,
      elevation: 5,
    },
    icon: {
      padding: hp(2),
      backgroundColor: theme.primary,
      borderRadius: '50%',
      marginBottom: hp(2),
      justifyContent: 'center',
      alignItems: 'center',
    },
    notify: {
      gap: hp(1),
    },
    title: {
      ...fontFamily.RALEWAY_BLACK,
      fontSize: fontSize.lg,
      color: theme.textDark,
      textAlign: 'center',
    },
    description: {
      ...fontFamily.POPPINS_REGULAR,
      fontSize: fontSize.sm,
      color: theme.textLight,
      textAlign: 'center',
    },
  });
};
export default CheckEmailModal;
