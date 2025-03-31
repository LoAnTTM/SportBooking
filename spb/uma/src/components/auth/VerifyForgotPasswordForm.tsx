import React, { FC, useCallback, useContext, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { OtpInput } from 'react-native-otp-entry';

import { fontFamily, fontSize, IColorScheme } from '@/constants';
import { ThemeContext } from '@/contexts/theme.context';
import { hp, wp } from '@/helpers/dimensions';
import i18next from '@/helpers/i18n';
import { logError } from '@/helpers/logger';
import Button from '@/ui/button/BaseButton';
import { OTP_LENGTH } from '@env';

interface IVerifyForgotPasswordFormProps {
  email: string;
  onSubmit: (data: { otp: number }) => void;
}

const VerifyForgotPasswordForm: FC<IVerifyForgotPasswordFormProps> = ({
  email,
  onSubmit,
}) => {
  const [otp, setOtp] = useState<string>('');
  const { theme } = useContext(ThemeContext);
  const styles = createStyles(theme);

  const handleSubmit = useCallback(() => {
    try {
      onSubmit({ otp: Number(otp) });
    } catch (err) {
      logError(err as Error);
    }
  }, [onSubmit, otp]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {i18next.t('verification.title')} {email}
      </Text>
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
        hideStick={true}
        blurOnFilled={true}
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
        disable={otp.length !== 4}
        title={i18next.t('verification.submit')}
        onPress={handleSubmit}
        buttonStyle={styles.button}
      />
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
  });

export default VerifyForgotPasswordForm;
