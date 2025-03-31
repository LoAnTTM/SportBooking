import { Formik } from 'formik';
import React, { FC, useCallback } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import FormField from '@/components/auth/FormField';
import { fontFamily, fontSize, IColorScheme } from '@/constants';
import { hp, wp } from '@/helpers/dimensions';
import i18next from '@/helpers/i18n';
import { forgotPasswordValidation } from '@/helpers/validate';
import Button from '@/ui/button/BaseButton';

type Props = {
  theme: IColorScheme;
  onSubmit: (data: { email: string }) => void;
};

const ForgotPasswordForm: FC<Props> = ({ theme, onSubmit }) => {
  const styles = createStyles(theme);

  const handleFormSubmit = useCallback(
    (data: { email: string }) => {
      onSubmit(data);
    },
    [onSubmit]
  );

  return (
    <View style={styles.form}>
      <View style={styles.formTitle}>
        <Text style={styles.formTitlePrimary}>{i18next.t('forgot.title')}</Text>
        <Text style={styles.formTitleDescription}>
          {i18next.t('forgot.description')}
        </Text>
      </View>
      <View style={styles.formContent}>
        <Formik
          initialValues={{ email: '' }}
          validationSchema={forgotPasswordValidation}
          onSubmit={handleFormSubmit}
        >
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            values,
            errors,
            touched,
          }) => (
            <>
              <FormField
                title={i18next.t('login.email')}
                value={values.email}
                error={errors.email}
                touched={touched.email}
                handleChange={handleChange('email')}
                handleBlur={handleBlur('email')}
                keyboardType="email-address"
                theme={theme}
              />
              <Button
                buttonStyle={styles.button}
                title={i18next.t('forgot.submit')}
                onPress={handleSubmit}
                disable={!values.email}
              />
            </>
          )}
        </Formik>
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
      paddingVertical: hp(8),
      width: '100%',
      gap: hp(4),
    },
    button: {
      marginTop: hp(2),
    },
  });

export default ForgotPasswordForm;
