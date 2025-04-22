import React, { useContext } from 'react';
import { StyleSheet, View } from 'react-native';

import RegisterForm from '@/components/auth/RegisterForm';
import { IColorScheme } from '@/constants';
import { ThemeContext } from '@/contexts/theme';
import { hp, wp } from '@/helpers/dimensions';
import i18next from '@/helpers/i18n';
import { logError } from '@/helpers/logger';
import { toastError } from '@/helpers/toast';
import { useGoogleSignIn } from '@/hooks/useGoogleSignIn';
import { RootParamList } from '@/screens';
import { AuthStackParamList } from '@/screens/auth';
import { useAuthStore } from '@/zustand';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export interface IRegisterFormValues {
  email: string;
  password: string;
  confirmPassword: string;
}

const Register: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootParamList>>();
  const authNavigation =
    useNavigation<NativeStackNavigationProp<AuthStackParamList>>();
  const { theme } = useContext(ThemeContext);
  const styles = createStyles(theme);

  const googleCallback = useAuthStore((state) => state.googleCallback);
  const register = useAuthStore((state) => state.register);

  const { handleGoogleSignIn } = useGoogleSignIn(googleCallback, () =>
    navigation.navigate('Main')
  );

  const handleRegister = async (data: { email: string; password: string }) => {
    try {
      await register(data);
      authNavigation.navigate('VerifyRegister', { email: data.email });
    } catch (error) {
      logError(error as Error);
      toastError(i18next.t('notification.register_failed'));
    }
  };

  return (
    <View style={styles.container}>
      <RegisterForm
        onSubmit={handleRegister}
        onGoogleSignIn={handleGoogleSignIn}
        theme={theme}
      />
    </View>
  );
};

const createStyles = (_: IColorScheme) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      paddingVertical: hp(2),
      paddingHorizontal: wp(4),
    },
  });
};

export default Register;
