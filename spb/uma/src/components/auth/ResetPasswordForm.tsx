import { Formik } from 'formik';
import React, { FC, useCallback } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import FormField from '@/components/auth/FormField';
import { fontFamily, fontSize, IColorScheme } from '@/constants';
import { hp, wp } from '@/helpers/dimensions';
import i18next from '@/helpers/i18n';
import { resetPasswordValidation } from '@/helpers/validate';
import Button from '@/ui/button/BaseButton';

type Props = {
  theme: IColorScheme;
  onSubmit: (data: { password: string }) => void;
};

const ResetPasswordForm: FC<Props> = ({ theme, onSubmit }) => {
  const styles = createStyles(theme);

  const handleFormSubmit = useCallback(
    (data: { password: string }) => {
      onSubmit(data);
    },
    [onSubmit]
  );

  return (
    <View style={styles.form}>
      <View style={styles.formTitle}>
        <Text style={styles.formTitlePrimary}>
          {i18next.t('forgot.reset.title')}
        </Text>
        <Text style={styles.formTitleDescription}>
          {i18next.t('forgot.reset.description')}
        </Text>
      </View>
      <View style={styles.formContent}>
        <Formik
          initialValues={{ password: '', confirmPassword: '' }}
          validationSchema={resetPasswordValidation}
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
              <View style={styles.controlGroup}>
                <FormField
                  title={i18next.t('forgot.reset.password')}
                  value={values.password}
                  error={errors.password}
                  touched={touched.password}
                  handleChange={handleChange('password')}
                  handleBlur={handleBlur('password')}
                  type="password"
                  theme={theme}
                />
                <FormField
                  title={i18next.t('forgot.reset.confirm_password')}
                  value={values.confirmPassword}
                  error={errors.confirmPassword}
                  touched={touched.confirmPassword}
                  handleChange={handleChange('confirmPassword')}
                  handleBlur={handleBlur('confirmPassword')}
                  type="password"
                  theme={theme}
                />
              </View>
              <Button
                buttonStyle={styles.button}
                title={i18next.t('forgot.reset.submit')}
                onPress={handleSubmit}
                disable={!(values.password && values.confirmPassword)}
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
    controlGroup: {
      flexDirection: 'column',
      justifyContent: 'space-around',
      gap: hp(3),
    },
    button: {
      marginTop: hp(2),
    },
  });

export default ResetPasswordForm;
