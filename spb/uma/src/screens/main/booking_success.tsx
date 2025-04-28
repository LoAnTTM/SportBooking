import React, { FC, useContext, useEffect } from 'react';
import { BackHandler, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useShallow } from 'zustand/shallow';

import { DEFAULT_ICON_SIZE, fontFamily, fontSize, IColorScheme, Radius } from '@/constants';
import { ThemeContext } from '@/contexts/theme';
import { hp, wp } from '@/helpers/dimensions';
import i18n from '@/helpers/i18n';
import { MainStackParamList } from '@/screens/main';
import Button from '@/ui/button/BaseButton';
import CalendarIcon from '@/ui/icon/Calendar';
import CodeIcon from '@/ui/icon/Card';
import UnitIcon from '@/ui/icon/Game';
import LocationIcon from '@/ui/icon/Location';
import SuccessIcon from '@/ui/icon/Tick';
import ClockIcon from '@/ui/icon/TimeCircle';
import { useOrderStore } from '@/zustand';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type BookingSuccessRouteProp = RouteProp<MainStackParamList, 'BookingSuccess'>;

const BookingSuccessScreen: FC = () => {
  const { theme } = useContext(ThemeContext);
  const styles = createStyles(theme);
  const navigation =
    useNavigation<NativeStackNavigationProp<MainStackParamList>>();
  const route = useRoute<BookingSuccessRouteProp>();

  // Get booking confirmation details from store or route params
  const bookingDetails = useOrderStore(
    useShallow((state) => state.lastBooking)
  );

  // Prevent going back to booking page
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        handleBackToHome();
        return true;
      }
    );

    return () => backHandler.remove();
  }, []);

  const handleViewBookings = () => {
    navigation.reset({
      index: 0,
      // @ts-ignore
      routes: [{ name: 'Main' }, { name: 'Tabs' }, { name: 'Schedule' }],
    });
  };

  const handleBackToHome = () => {
    navigation.reset({
      index: 0,
      // @ts-ignore
      routes: [{ name: 'Main' }],
    });
  };

  if (!bookingDetails) {
    // Handle case where booking details are not available
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>
          {i18n.t('booking.details_not_found')}
        </Text>
        <Button
          title={i18n.t('common.back_to_home')}
          onPress={handleBackToHome}
          buttonStyle={styles.primaryButton}
        />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.container}>
        {/* Success Header */}
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <SuccessIcon size={DEFAULT_ICON_SIZE * 2.5} color={theme.white} />
          </View>

          <Text style={styles.title}>{i18n.t('booking.success_title')}</Text>
          <Text style={styles.subtitle}>
            {i18n.t('booking.success_subtitle')}
          </Text>
        </View>

        {/* Booking Information */}
        <View style={styles.infoCard}>
          {/* Venue Details */}
          <View style={styles.infoSection}>
            <View style={styles.infoHeader}>
              <UnitIcon size={DEFAULT_ICON_SIZE - 4} color={theme.primary} />
              <Text style={styles.sectionTitle}>
                {i18n.t('booking.venue_details')}
              </Text>
            </View>

            <Text style={styles.venueName}>{bookingDetails.unitName}</Text>
          </View>

          <View style={styles.divider} />

          {/* Booking Details */}
          <View style={styles.infoSection}>
            <View style={styles.infoHeader}>
              <CalendarIcon
                size={DEFAULT_ICON_SIZE - 4}
                color={theme.primary}
              />
              <Text style={styles.sectionTitle}>
                {i18n.t('booking.booking_details')}
              </Text>
            </View>

            <View style={styles.infoRow}>
              <CalendarIcon
                size={DEFAULT_ICON_SIZE - 6}
                color={theme.textLight}
              />
              <Text style={styles.infoText}>{bookingDetails.bookingDay}</Text>
            </View>

            <View style={styles.infoRow}>
              <ClockIcon size={DEFAULT_ICON_SIZE - 6} color={theme.textLight} />
              <Text style={styles.infoText}>
                {bookingDetails.startTime} - {bookingDetails.endTime}
              </Text>
            </View>
          </View>

          <View style={styles.divider} />

          {/* Payment Details */}
          <View style={styles.infoSection}>
            <View style={styles.infoHeader}>
              <CodeIcon size={DEFAULT_ICON_SIZE - 4} color={theme.primary} />
              <Text style={styles.sectionTitle}>
                {i18n.t('booking.payment_details')}
              </Text>
            </View>

            <View style={styles.paymentInfo}>
              <Text style={styles.paymentLabel}>
                {i18n.t('booking.total_amount')}
              </Text>
              <Text style={styles.paymentAmount}>
                {bookingDetails.amount?.toLocaleString()}{' '}
              </Text>
            </View>

            <View style={styles.paymentInfo}>
              <Text style={styles.paymentLabel}>
                {i18n.t('booking.payment_method')}
              </Text>
              <Text style={styles.paymentDetail}>Zalopay</Text>
            </View>
          </View>

          <View style={styles.divider} />

          {/* Order Info */}
          <View style={styles.infoSection}>
            <View style={styles.infoHeader}>
              <LocationIcon
                size={DEFAULT_ICON_SIZE - 4}
                color={theme.primary}
              />
              <Text style={styles.sectionTitle}>
                {i18n.t('booking.order_info')}
              </Text>
            </View>

            <View style={styles.paymentInfo}>
              <Text style={styles.paymentLabel}>
                {bookingDetails.orderInfo}
              </Text>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <Button
            title={i18n.t('booking.view_my_bookings')}
            onPress={handleViewBookings}
            buttonStyle={styles.primaryButton}
          />

          <Button
            title={i18n.t('booking.back_to_home')}
            onPress={handleBackToHome}
            buttonStyle={styles.secondaryButton}
            textStyle={styles.secondaryButtonText}
          />
        </View>
      </View>
    </ScrollView>
  );
};

const createStyles = (theme: IColorScheme) =>
  StyleSheet.create({
    scrollView: {
      flex: 1,
      backgroundColor: theme.backgroundLight,
    },
    scrollContent: {
      flexGrow: 1,
      paddingBottom: hp(5),
    },
    container: {
      flex: 1,
      padding: wp(5),
      backgroundColor: theme.backgroundLight,
    },
    header: {
      alignItems: 'center',
      marginVertical: hp(3),
    },
    iconContainer: {
      backgroundColor: theme.success,
      width: wp(25),
      height: wp(25),
      borderRadius: wp(12.5),
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: hp(2),
    },
    title: {
      ...fontFamily.POPPINS_BOLD,
      fontSize: fontSize.xl,
      color: theme.success,
      textAlign: 'center',
      marginBottom: hp(1),
    },
    subtitle: {
      ...fontFamily.POPPINS_REGULAR,
      fontSize: fontSize.md,
      color: theme.textDark,
      textAlign: 'center',
      marginBottom: hp(1),
    },
    infoCard: {
      backgroundColor: theme.backgroundLight,
      borderRadius: Radius.md,
      padding: wp(0),
      marginBottom: hp(3),
      borderWidth: 1,
      borderColor: theme.borderLight,
      overflow: 'hidden',
    },
    infoSection: {
      padding: wp(4),
    },
    infoHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: hp(1.5),
      gap: wp(2),
    },
    sectionTitle: {
      ...fontFamily.POPPINS_BOLD,
      fontSize: fontSize.md,
      color: theme.textDark,
    },
    venueName: {
      ...fontFamily.POPPINS_MEDIUM,
      fontSize: fontSize.md,
      color: theme.textDark,
      marginBottom: hp(1),
    },
    infoRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: hp(1),
      gap: wp(2),
    },
    infoText: {
      ...fontFamily.POPPINS_REGULAR,
      fontSize: fontSize.sm,
      color: theme.textDark,
      flex: 1,
    },
    divider: {
      height: 1,
      backgroundColor: theme.borderLight,
      width: '100%',
    },
    paymentInfo: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: hp(1.5),
    },
    paymentLabel: {
      ...fontFamily.POPPINS_REGULAR,
      fontSize: fontSize.sm,
      color: theme.textLight,
    },
    paymentDetail: {
      ...fontFamily.POPPINS_MEDIUM,
      fontSize: fontSize.sm,
      color: theme.textDark,
    },
    paymentAmount: {
      ...fontFamily.POPPINS_BOLD,
      fontSize: fontSize.md,
      color: theme.primary,
    },
    confirmationCode: {
      ...fontFamily.POPPINS_BOLD,
      fontSize: fontSize.sm,
      color: theme.primary,
      letterSpacing: 1,
    },
    notesContainer: {
      backgroundColor: theme.warning,
      borderRadius: Radius.md,
      padding: wp(4),
      marginBottom: hp(4),
    },
    notesTitle: {
      ...fontFamily.POPPINS_BOLD,
      fontSize: fontSize.sm,
      color: theme.warning,
      marginBottom: hp(1),
    },
    notesText: {
      ...fontFamily.POPPINS_REGULAR,
      fontSize: fontSize.xs,
      color: theme.textDark,
      lineHeight: fontSize.sm * 1.5,
    },
    buttonContainer: {
      gap: hp(2),
      marginTop: hp(2),
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
    errorText: {
      ...fontFamily.POPPINS_MEDIUM,
      fontSize: fontSize.md,
      color: theme.textLight,
      textAlign: 'center',
      marginVertical: hp(4),
    },
  });

export default BookingSuccessScreen;
