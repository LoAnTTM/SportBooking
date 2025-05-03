import { Formik } from 'formik';
import React, { FC, useCallback } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import FormField from '@/components/auth/FormField';
import { fontFamily, fontSize, IColorScheme } from '@/constants';
import { hp, wp } from '@/helpers/dimensions';
import i18n from '@/helpers/i18n';
import { changePasswordValidation } from '@/helpers/validate';
import Button from '@/ui/button/BaseButton';

type Props = {
  theme: IColorScheme;
  onSubmit: (data: { currentPassword: string; newPassword: string }) => void;
};

const ChangePasswordForm: FC<Props> = ({ theme, onSubmit }) => {
  const styles = createStyles(theme);

  const handleFormSubmit = useCallback(
    (data: { currentPassword: string; newPassword: string }) => {
      onSubmit(data);
    },
    [onSubmit]
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {i18n.t('profile:change_password.change_password')}
      </Text>
      <Text style={styles.description}>
        {i18n.t('profile:change_password.change_password_description')}
      </Text>
      <Formik
        initialValues={{
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        }}
        validationSchema={changePasswordValidation}
        onSubmit={handleFormSubmit}
      >
        {({
          handleSubmit,
          handleChange,
          handleBlur,
          isValid,
          dirty,
          values,
          errors,
          touched,
        }) => (
          <View style={styles.form}>
            <FormField
              title={i18n.t('profile:change_password.enter_current_password')}
              type="password"
              value={values.currentPassword}
              error={errors.currentPassword}
              touched={touched.currentPassword}
              handleChange={handleChange('currentPassword')}
              handleBlur={handleBlur('currentPassword')}
              theme={theme}
            />
            <FormField
              title={i18n.t('profile:change_password.enter_new_password')}
              type="password"
              value={values.newPassword}
              error={errors.newPassword}
              touched={touched.newPassword}
              handleChange={handleChange('newPassword')}
              handleBlur={handleBlur('newPassword')}
              theme={theme}
            />
            <FormField
              title={i18n.t('profile:change_password.enter_confirm_password')}
              type="password"
              value={values.confirmPassword}
              error={errors.confirmPassword}
              touched={touched.confirmPassword}
              handleChange={handleChange('confirmPassword')}
              handleBlur={handleBlur('confirmPassword')}
              theme={theme}
            />
            <Button
              title={i18n.t('common.submit')}
              onPress={() => handleSubmit()}
              disable={!isValid || !dirty}
              buttonStyle={styles.button}
            />
          </View>
        )}
      </Formik>
    </View>
  );
};

const createStyles = (theme: IColorScheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      padding: wp(4),
    },
	form: {
      flex: 1,
      backgroundColor: theme.backgroundLight,
      gap: hp(2)
    },
    title: {
      ...fontFamily.RALEWAY_BOLD,
      fontSize: fontSize.xl,
      color: theme.textDark,
      marginBottom: hp(1),
    },
    description: {
      ...fontFamily.RALEWAY_MEDIUM,
      fontSize: fontSize.sm,
      color: theme.textLight,
      marginBottom: hp(3),
    },
    button: {
      marginTop: hp(3),
    },
  });

export default ChangePasswordForm;
