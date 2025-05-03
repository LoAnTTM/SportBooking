import React, { useContext } from 'react';
import { StyleSheet, View } from 'react-native';

import LoginForm from '@/components/auth/LoginForm';
import { IColorScheme } from '@/constants';
import { ThemeContext } from '@/contexts/theme';
import { hp, wp } from '@/helpers/dimensions';
import i18next from '@/helpers/i18n';
import { logError } from '@/helpers/logger';
import { toastError, toastSuccess } from '@/helpers/toast';
import { RootParamList } from '@/screens';
import { useAuthStore } from '@/zustand';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export interface ILoginFormValues {
  email: string;
  password: string;
}

const Login: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootParamList>>();
  const login = useAuthStore((state) => state.login);
  const { theme } = useContext(ThemeContext);
  const styles = createStyles(theme);

  const handleLogin = async (data: { email: string; password: string }) => {
    try {
      await login(data);
      navigation.navigate('Main');
      toastSuccess(i18next.t('notification.login_success'));
    } catch (error) {
      logError(error as Error);
      toastError(i18next.t('notification.login_failed'));
    }
  };

  return (
    <View style={styles.container}>
      <LoginForm
        onSubmit={handleLogin}
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

export default Login;
