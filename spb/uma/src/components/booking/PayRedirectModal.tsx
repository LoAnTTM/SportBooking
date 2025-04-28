import React, { FC, useContext, useState } from 'react';
import { ActivityIndicator, Linking, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { DEFAULT_ICON_SIZE, fontFamily, fontSize, IColorScheme, Radius } from '@/constants';
import { ThemeContext } from '@/contexts/theme';
import { hp, wp } from '@/helpers/dimensions';
import i18n from '@/helpers/i18n';
import { logError } from '@/helpers/logger';
import { toastError } from '@/helpers/toast';
import Button from '@/ui/button/BaseButton';
import ExternalLinkIcon from '@/ui/icon/ExternalLink';
import WalletIcon from '@/ui/icon/Wallet';
import BaseModal from '@/ui/modal/BaseModal';

interface PayRedirectModalProps {
  visible: boolean;
  onClose: () => void;
  paymentUrl: string;
  paymentMethod: string;
  amount: number;
  currency: string;
  onPaymentComplete?: () => void;
}

const PayRedirectModal: FC<PayRedirectModalProps> = ({
  visible,
  onClose,
  paymentUrl,
  paymentMethod,
  amount,
  currency,
  onPaymentComplete,
}) => {
  const { theme } = useContext(ThemeContext);
  const insets = useSafeAreaInsets();
  const styles = createStyles(theme, insets);
  const [isLoading, setIsLoading] = useState(false);

  const handleOpenPaymentUrl = async () => {
    if (!paymentUrl) {
      toastError(i18n.t('payment.error_invalid_url'));
      return;
    }

    setIsLoading(true);
    try {
      await Linking.openURL(paymentUrl);
    } catch (error) {
      logError(error as Error, 'Error opening payment URL');
      toastError(i18n.t('payment.error_redirect'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleIAlreadyPaid = () => {
    onPaymentComplete?.();
    onClose();
  };

  return (
    <BaseModal visible={visible} onClose={onClose}>
      <View style={styles.container}>
        <View style={styles.iconContainer}>
          <WalletIcon size={DEFAULT_ICON_SIZE * 2} color={theme.primary} />
        </View>

        <Text style={styles.title}>{i18n.t('payment.redirect_title')}</Text>

        <View style={styles.infoContainer}>
          <Text style={styles.paymentMethod}>{paymentMethod}</Text>
          <Text style={styles.amountText}>
            {amount.toLocaleString()} {currency}
          </Text>
        </View>

        <Text style={styles.description}>
          {i18n.t('payment.redirect_description')}
        </Text>

        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={theme.primary} />
            <Text style={styles.loadingText}>
              {i18n.t('payment.opening_browser')}
            </Text>
          </View>
        ) : (
          <View style={styles.buttonContainer}>
            <Button
              title={i18n.t('payment.proceed_to_payment')}
              onPress={handleOpenPaymentUrl}
              buttonStyle={styles.primaryButton}
              after={
                <ExternalLinkIcon
                  size={DEFAULT_ICON_SIZE - 4}
                  color={theme.white}
                />
              }
            />

            <Button
              title={i18n.t('payment.i_already_paid')}
              onPress={handleIAlreadyPaid}
              buttonStyle={styles.secondaryButton}
			  textStyle={styles.secondaryButtonText}
            />
          </View>
        )}

        <Text style={styles.noteText}>{i18n.t('payment.redirect_note')}</Text>
      </View>
    </BaseModal>
  );
};

const createStyles = (theme: IColorScheme, insets: any) =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.backgroundLight,
      borderRadius: Radius.lg,
      padding: wp(5),
      alignItems: 'center',
      width: '100%',
      maxWidth: wp(90),
    },
    iconContainer: {
      marginVertical: hp(2),
      backgroundColor: theme.backgroundLight,
      width: wp(20),
      height: wp(20),
      borderRadius: wp(10),
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 2,
      borderColor: theme.primary,
    },
    title: {
      ...fontFamily.POPPINS_BOLD,
      fontSize: fontSize.lg,
      color: theme.textDark,
      textAlign: 'center',
      marginBottom: hp(2),
    },
    infoContainer: {
      width: '100%',
      backgroundColor: theme.backgroundLight,
      borderRadius: Radius.md,
      padding: wp(4),
      marginBottom: hp(3),
      borderWidth: 1,
      borderColor: theme.borderLight,
      alignItems: 'center',
    },
    paymentMethod: {
      ...fontFamily.POPPINS_MEDIUM,
      fontSize: fontSize.md,
      color: theme.textDark,
      marginBottom: hp(1),
    },
    amountText: {
      ...fontFamily.POPPINS_BOLD,
      fontSize: fontSize.xl,
      color: theme.primary,
    },
    description: {
      ...fontFamily.POPPINS_REGULAR,
      fontSize: fontSize.sm,
      color: theme.textDark,
      textAlign: 'center',
      marginBottom: hp(3),
    },
    buttonContainer: {
      width: '100%',
      gap: hp(2),
    },
    primaryButton: {
      width: '100%',
    },
    secondaryButton: {
      width: '100%',
      backgroundColor: theme.backgroundLight,
      borderWidth: 1,
      borderColor: theme.borderLight,
    },
    secondaryButtonText: {
      color: theme.textDark,
    },
    loadingContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      height: hp(10),
      marginVertical: hp(2),
    },
    loadingText: {
      ...fontFamily.POPPINS_MEDIUM,
      fontSize: fontSize.sm,
      color: theme.textLight,
      marginTop: hp(1),
    },
    noteText: {
      ...fontFamily.POPPINS_ITALIC,
      fontSize: fontSize.xs,
      color: theme.textLight,
      textAlign: 'center',
      marginTop: hp(3),
      paddingHorizontal: wp(2),
    },
  });

export default PayRedirectModal;
