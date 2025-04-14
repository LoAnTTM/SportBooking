import React, { FC, useContext } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { OtpInput } from 'react-native-otp-entry';

import { fontFamily, fontSize, IColorScheme } from '@/constants';
import { ThemeContext } from '@/contexts/theme';
import { hp, wp } from '@/helpers/dimensions';
import i18next from '@/helpers/i18n';
import { logDebug, logError } from '@/helpers/logger';
import { toastError, toastSuccess } from '@/helpers/toast';
import { ParamList } from '@/screens';
import Button from '@/ui/button/BaseButton';
import { useAuthStore } from '@/zustand';
import { OTP_LENGTH } from '@env';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

interface IVerifyRegisterFormProps {
  email: string;
}

const VerifyRegisterForm: FC<IVerifyRegisterFormProps> = ({ email }) => {
  const verifyRegisterEmail = useAuthStore.use.verifyRegisterToken();
  const navigation = useNavigation<NativeStackNavigationProp<ParamList>>();
  const [otp, setOtp] = React.useState<string>('');

  const { theme } = useContext(ThemeContext);
  const styles = createStyles(theme);

  const handleSubmit = async () => {
    try {
      const otpNumber = Number(otp);
      logDebug(`OTP submitted: ${otpNumber}`);

      await verifyRegisterEmail({ token: otpNumber, email });
      navigation.navigate('Tabs');
      toastSuccess(i18next.t('notification.register_success'));
    } catch (err) {
      logError(err as Error);
      toastError(i18next.t('notification.register_failed'));
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{i18next.t('verification.title')}</Text>
      <Text style={styles.description}>
        {i18next.t('verification.description')}
      </Text>
      <OtpInput
        numberOfDigits={Number(OTP_LENGTH)}
        focusColor={theme.primary}
        autoFocus={true}
        disabled={false}
        type="numeric"
        secureTextEntry={false}
        blurOnFilled={true}
        focusStickBlinkingDuration={500}
        onTextChange={(text) => setOtp(text)}
        textInputProps={{
          accessibilityLabel: 'One-Time Password',
        }}
        theme={{
          pinCodeContainerStyle: styles.otpBox,
          pinCodeTextStyle: styles.otpBoxText,
        }}
      />
      <Button
        disable={otp.length !== Number(OTP_LENGTH)}
        title={i18next.t('verification.submit')}
        onPress={handleSubmit}
        buttonStyle={styles.button}
      />
      <View style={styles.resendContainer}>
        <Text style={styles.resendText}>
          {i18next.t('verification.resend_ask')}
        </Text>
      </View>
    </View>
  );
};

const createStyles = (theme: IColorScheme) =>
  StyleSheet.create({
    container: {
      paddingHorizontal: wp(4),
    },
    title: {
      ...fontFamily.RALEWAY_BLACK,
      fontSize: fontSize.xxl,
      paddingBottom: hp(1),
      textAlign: 'center',
      color: theme.textDark,
    },
    description: {
      color: theme.textLight,
      width: '80%',
      textAlign: 'center',
      alignSelf: 'center',
      marginBottom: hp(4),
      ...fontFamily.POPPINS_REGULAR,
      fontSize: fontSize.md,
    },
    error: {
      color: theme.error,
      marginBottom: hp(4),
      textAlign: 'center',
    },
    otpBox: {
      width: 60,
      height: 60,
      borderWidth: 2,
    },
    otpBoxText: {
      color: theme.textDark,
      fontSize: fontSize.xl,
      ...fontFamily.POPPINS_REGULAR,
    },
    button: {
      marginTop: hp(4),
    },
    resendContainer: {
      marginTop: hp(2),
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    resendText: {
      ...fontFamily.RALEWAY_MEDIUM,
      fontSize: fontSize.sm,
      color: theme.textLight,
    },
  });

export default VerifyRegisterForm;
