import React, { FC } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { fontFamily, fontSize, IColorScheme } from '@/constants';
import { hp, wp } from '@/helpers/dimensions';
import i18next from '@/helpers/i18n';
import Button from '@/ui/button/BaseButton';

type Props = {
  theme: IColorScheme;
  onSubmit: (data: { email: string }) => void;
};

const ConfirmResetPasswordForm: FC<Props> = ({ theme, onSubmit }) => {
  const styles = createStyles(theme);

  return (
    <View style={styles.form}>
      <View style={styles.formTitle}>
        <Text style={styles.formTitlePrimary}>
          {i18next.t('forgot.reset.confirm.title')}
        </Text>
        <Text style={styles.formTitleDescription}>
          {i18next.t('forgot.reset.confirm.description')}
        </Text>
      </View>
      <View style={styles.formContent}>
        <Button
          title={i18next.t('forgot.reset.confirm.submit')}
          onPress={onSubmit}
        />
      </View>
    </View>
  );
};

const createStyles = (theme: IColorScheme) =>
  StyleSheet.create({
    form: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.backgroundLight,
      paddingHorizontal: wp(4),
    },
    formTitle: {
      width: wp(80),
    },
    formTitlePrimary: {
      ...fontFamily.RALEWAY_BLACK,
      fontSize: fontSize.xxl,
      textAlign: 'center',
      color: theme.textDark,
      marginBottom: hp(2),
    },
    formTitleDescription: {
      ...fontFamily.POPPINS_REGULAR,
      fontSize: fontSize.md,
      textAlign: 'center',
      color: theme.textLight,
    },
    formContent: {
      flex: 1,
      width: '100%',
      marginTop: hp(4),
    },
  });

export default ConfirmResetPasswordForm;
