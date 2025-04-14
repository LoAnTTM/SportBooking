import { Formik } from 'formik';
import React, { useCallback } from 'react';
import { StyleSheet, View } from 'react-native';

import ForgotPasswordLink from '@/components/auth/ForgotPasswordLink';
import FormField from '@/components/auth/FormField';
import { IColorScheme } from '@/constants';
import { hp } from '@/helpers/dimensions';
import i18next from '@/helpers/i18n';
import { loginValidation } from '@/helpers/validate';
import { ILoginFormValues } from '@/screens/auth/tab/login';
import Button from '@/ui/button/BaseButton';
import GoogleSignIn from '@/ui/button/GoogleSignIn';
import Line from '@/ui/Line';

interface LoginFormProps {
  onSubmit: (data: { email: string; password: string }) => Promise<void>;
  onGoogleSignIn: () => Promise<void>;
  theme: IColorScheme;
}

const LoginForm: React.FC<LoginFormProps> = ({
  onSubmit,
  onGoogleSignIn,
  theme,
}) => {
  const styles = createStyles(theme);
  const initialValues: ILoginFormValues = {
    email: '',
    password: '',
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
      validationSchema={loginValidation}
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
              title={i18next.t('login.email')}
              value={values.email}
              error={errors.email}
              touched={touched.email}
              handleChange={handleChange('email')}
              handleBlur={handleBlur('email')}
              keyboardType="email-address"
              theme={theme}
            />
            <FormField
              title={i18next.t('login.password')}
              value={values.password}
              error={errors.password}
              touched={touched.password}
              handleChange={handleChange('password')}
              handleBlur={handleBlur('password')}
              type="password"
              theme={theme}
            />
          </View>
          <View style={styles.optionGroup}>
            <ForgotPasswordLink theme={theme} />
          </View>
          <View style={styles.buttonGroup}>
            <Button
              buttonStyle={styles.button}
              title={i18next.t('login.submit')}
              onPress={handleSubmit}
              disable={!(values.email && values.password)}
            />
            <Line title="Or" theme={theme} />
            <GoogleSignIn onPress={onGoogleSignIn} />
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
    optionGroup: {
      flexDirection: 'row',
      marginTop: hp(2),
      justifyContent: 'flex-end',
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

export default LoginForm;
