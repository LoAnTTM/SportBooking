import { Formik } from 'formik';
import React, { useCallback } from 'react';
import { StyleSheet, View } from 'react-native';

import FormField from '@/components/auth/FormField';
import { IColorScheme } from '@/constants';
import { hp } from '@/helpers/dimensions';
import i18next from '@/helpers/i18n';
import { registerValidation } from '@/helpers/validate';
import { IRegisterFormValues } from '@/screens/auth/tab/register';
import Button from '@/ui/button/BaseButton';
import GoogleSignIn from '@/ui/button/GoogleSignIn';
import Line from '@/ui/Line';

interface RegisterFormProps {
  onSubmit: (data: { email: string; password: string }) => Promise<void>;
  onGoogleSignIn: () => Promise<void>;
  theme: IColorScheme;
}

const RegisterForm: React.FC<RegisterFormProps> = ({
  onSubmit,
  onGoogleSignIn,
  theme,
}) => {
  const styles = createStyles(theme);
  const initialValues: IRegisterFormValues = {
    email: '',
    password: '',
    confirmPassword: '',
  };

  const handleFormSubmit = useCallback(
    (values: { email: string; password: string }) => {
      onSubmit(values);
    },
    [onSubmit]
  );

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={registerValidation}
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
        <View style={styles.form}>
          <View style={styles.controlGroup}>
            <FormField
              title={i18next.t('register.email')}
              value={values.email}
              error={errors.email}
              touched={touched.email}
              handleChange={handleChange('email')}
              handleBlur={handleBlur('email')}
              keyboardType="email-address"
              theme={theme}
            />
            <FormField
              title={i18next.t('register.password')}
              value={values.password}
              error={errors.password}
              touched={touched.password}
              handleChange={handleChange('password')}
              handleBlur={handleBlur('password')}
              type="password"
              theme={theme}
            />
            <FormField
              title={i18next.t('register.confirm_password')}
              value={values.confirmPassword}
              error={errors.confirmPassword}
              touched={touched.confirmPassword}
              handleChange={handleChange('confirmPassword')}
              handleBlur={handleBlur('confirmPassword')}
              type="password"
              theme={theme}
            />
          </View>
          <View style={styles.buttonGroup}>
            <Button
              buttonStyle={styles.button}
              title={i18next.t('register.submit')}
              onPress={handleSubmit}
              disable={!(touched.email && touched.password)}
            />
            <Line title="Or" theme={theme} />
            <GoogleSignIn
              onPress={onGoogleSignIn}
              title={i18next.t('register.google')}
            />
          </View>
        </View>
      )}
    </Formik>
  );
};

const createStyles = (_: IColorScheme) => {
  return StyleSheet.create({
    form: {
      paddingTop: hp(3),
    },
    controlGroup: {
      flexDirection: 'column',
      justifyContent: 'space-around',
      gap: hp(3),
    },
    buttonGroup: {
      paddingTop: hp(4),
      gap: hp(3),
    },
    button: {
      marginTop: hp(2),
    },
  });
};

export default RegisterForm;
