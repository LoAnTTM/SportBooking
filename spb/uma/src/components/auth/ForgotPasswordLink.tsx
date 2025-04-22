import React, { FC } from 'react';
import { StyleSheet } from 'react-native';

import { fontFamily, fontSize, IColorScheme } from '@/constants';
import { wp } from '@/helpers/dimensions';
import i18next from '@/helpers/i18n';
import { AuthStackParamList } from '@/screens/auth';
import Link from '@/ui/Link';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type Props = {
  theme: IColorScheme;
};

const ForgotPasswordLink: FC<Props> = ({ theme }) => {
  const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList>>();
  const styles = createStyles(theme);

  const handleForgotPassword = () => {
    navigation.navigate('ForgotPassword');
  };

  return (
    <Link
      title={i18next.t('login.forgot')}
      onPress={handleForgotPassword}
      style={styles.link}
    />
  );
};

const createStyles = (theme: IColorScheme) => {
  return StyleSheet.create({
    link: {
      ...fontFamily.POPPINS_BOLD,
      fontSize: fontSize.sm,
      color: theme.primary,
      paddingHorizontal: wp(4),
      alignSelf: 'flex-end',
      opacity: 0.9,
    },
  });
};

export default ForgotPasswordLink;
