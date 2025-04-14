import { useEffect } from 'react';

import i18next from '@/helpers/i18n';
import { logError } from '@/helpers/logger';
import { toastError, toastSuccess } from '@/helpers/toast';
import { WEB_CLIENT_ID } from '@env';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

export const useGoogleSignIn = (
  googleCallback: (params: { code: string }) => Promise<void>,
  onSuccess: () => void
) => {
  useEffect(() => {
    GoogleSignin.configure({
      webClientId: WEB_CLIENT_ID,
      scopes: ['email', 'profile'],
    });
  }, []);

  const handleGoogleSignIn = async () => {
    try {
      const { data } = await GoogleSignin.signIn();

      const idToken = data?.idToken as string;
      await googleCallback({ code: idToken });
      onSuccess();
      toastSuccess(i18next.t('notification.register_success'));
    } catch (error) {
      logError(error as Error);
      toastError(i18next.t('notification.register_failed'));
    }
  };

  return { handleGoogleSignIn };
};
