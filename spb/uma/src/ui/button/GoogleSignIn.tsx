import React, { useContext } from 'react';
import { StyleSheet } from 'react-native';

import { IColorScheme } from '@/constants';
import { ThemeContext } from '@/contexts/theme.context';
import i18next from '@/helpers/i18n';
import Button from '@/ui/button/BaseButton';
import GoogleIcon from '@/ui/icon/Google';

export type GoogleSignInProps = {
  onPress: () => void;
  title?: string;
};

const GoogleSignIn: React.FC<GoogleSignInProps> = ({ title, onPress }) => {
  const { theme } = useContext(ThemeContext);
  const styles = createStyles(theme);

  return (
    <Button
      buttonStyle={styles.button}
      textStyles={styles.buttonText}
      title={title || i18next.t('login.google')}
      onPress={onPress}
      before={<GoogleIcon size={22} />}
    />
  );
};

const createStyles = (theme: IColorScheme) => {
  return StyleSheet.create({
    button: {
      backgroundColor: theme.secondary,
    },
    buttonText: {
      color: theme.textLight,
    },
  });
};

export default GoogleSignIn;
