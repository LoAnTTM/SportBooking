import React, { FC, useContext } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import VerifyForgotPasswordForm from '@/components/auth/VerifyForgotPasswordForm';
import { IColorScheme } from '@/constants';
import { ThemeContext } from '@/contexts/theme';
import { hp, wp } from '@/helpers/dimensions';
import i18next from '@/helpers/i18n';
import { logError } from '@/helpers/logger';
import { toastError } from '@/helpers/toast';
import { AuthStackParamList } from '@/screens/auth';
import BackButton from '@/ui/button/Back';
import LeftIcon from '@/ui/icon/Left';
import { useAuthStore } from '@/zustand';
import { RouteProp, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type Props = {
  route?: RouteProp<AuthStackParamList, 'VerifyForgotPassword'>;
};

const VerifyForgotPassword: FC<Props> = ({ route }) => {
  const { theme } = useContext(ThemeContext);
  const styles = createStyles(theme);
  const email = route?.params.email || '';
  const verifyForgotPasswordToken = useAuthStore(
    (state) => state.verifyForgotPasswordToken
  );
  const navigation =
    useNavigation<NativeStackNavigationProp<AuthStackParamList>>();

  const handleSubmit = async (data: { otp: number }) => {
    try {
      await verifyForgotPasswordToken({ token: data.otp, email });
      navigation.navigate('ConfirmForgotPassword', { email, token: data.otp });
    } catch (err) {
      logError(err as Error);
      toastError(i18next.t('verification.otp_invalid'));
    }
  };

  return (
    <SafeAreaView style={styles.safeView}>
      <View style={styles.container}>
        <View style={styles.header}>
          <BackButton icon={<LeftIcon color={theme.icon} />} />
        </View>
        <VerifyForgotPasswordForm email={email} onSubmit={handleSubmit} />
      </View>
    </SafeAreaView>
  );
};

const createStyles = (theme: IColorScheme) =>
  StyleSheet.create({
    safeView: {
      flex: 1,
    },
    container: {
      flex: 1,
      backgroundColor: theme.backgroundLight,
    },
    header: {
      height: hp(12),
      paddingVertical: hp(2),
      paddingHorizontal: wp(4),
    },
  });

export default VerifyForgotPassword;
