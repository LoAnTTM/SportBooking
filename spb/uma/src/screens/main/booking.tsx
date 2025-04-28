import { format } from 'date-fns';
import React, { FC, useContext, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useShallow } from 'zustand/shallow';

import PayRedirectModal from '@/components/booking/PayRedirectModal';
import TimeSelection from '@/components/booking/TimeSelection';
import TimeSelectionModal from '@/components/booking/TimeSelectionModal';
import HeaderWithBack from '@/components/common/HeaderWithBack';
import UnitSummary from '@/components/common/UnitSummary';
import { IColorScheme, Radius } from '@/constants';
import { ThemeContext } from '@/contexts/theme';
import { getCurrentTimeWithOffset } from '@/helpers/datetime';
import { hp, wp } from '@/helpers/dimensions';
import i18n from '@/helpers/i18n';
import { logError } from '@/helpers/logger';
import { toastError } from '@/helpers/toast';
import { PaymentRequest, TimeRange, UnitPrice } from '@/services/types';
import Button from '@/ui/button/BaseButton';
import Loading from '@/ui/Loading';
import { useAuthStore, useOrderStore, useUnitStore } from '@/zustand';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { MainStackParamList } from './';

const Booking: FC = () => {
  const { theme } = useContext(ThemeContext);
  const styles = createStyles(theme);
  const [bookingTime, setBookingTime] = useState<
    { [date: string]: TimeRange } | undefined
  >();
  const [timelineModalVisible, setTimelineModalVisible] =
    useState<boolean>(false);

  const navigation =
    useNavigation<NativeStackNavigationProp<MainStackParamList>>();

  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const unit = useUnitStore(useShallow((state) => state.currentUnit));
  const userId = useAuthStore((state) => state.userId);
  const pay = useOrderStore((state) => state.pay);
  const paymentResponse = useOrderStore((state) => state.paymentResponse);
  const isLoading = useOrderStore((state) => state.isLoading);

  const convertTimeToMinutes = (timeStr: string) => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes;
  };

  // Format the booking time information for display
  const bookingInfo = useMemo(() => {
    if (!bookingTime) return null;

    // Get the first date entry (assuming only one date is selected)
    const dateKey = Object.keys(bookingTime)[0];
    if (!dateKey) return null;

    const timeInfo = bookingTime[dateKey];
    if (!timeInfo || !timeInfo.startTime || !timeInfo.endTime) return null;

    try {
      // Format the date
      const dateObj = new Date(dateKey);
      const formattedDate = format(dateObj, 'EEE, MMM dd, yyyy');

      // Return the formatted information
      return {
        unformatDate: dateKey,
        date: formattedDate,
        startTime: timeInfo.startTime,
        endTime: timeInfo.endTime,
      };
    } catch (error) {
      console.error('Error formatting booking time:', error);
      return null;
    }
  }, [bookingTime]);

  const bookingPrice = useMemo(() => {
    if (!bookingTime) return null;
    // Extract the only date from bookingTime
    const date = Object.keys(bookingTime)[0];
    const { startTime, endTime } = bookingTime[date];

    // Convert booking times to minutes for easier calculation
    const bookingStartMinutes = convertTimeToMinutes(startTime);
    const bookingEndMinutes = convertTimeToMinutes(endTime);

    // Initialize total price and currency
    let totalPrice = 0;
    let currency = unit.price[0]?.currency || '';

    const totalDurationMinutes = bookingEndMinutes - bookingStartMinutes;

    // Go through each price unit and calculate the overlapping time
    unit.price.forEach((priceUnit: UnitPrice) => {
      const unitStartMinutes = convertTimeToMinutes(priceUnit.startTime);
      const unitEndMinutes = convertTimeToMinutes(priceUnit.endTime);

      // Calculate overlap between booking time and this price unit
      const overlapStart = Math.max(bookingStartMinutes, unitStartMinutes);
      const overlapEnd = Math.min(bookingEndMinutes, unitEndMinutes);

      // If there's an overlap, add to the total price
      if (overlapEnd > overlapStart) {
        const overlapMinutes = overlapEnd - overlapStart;
        const overlapPrice = (overlapMinutes / 60) * priceUnit.price;
        totalPrice += overlapPrice;
        currency = priceUnit.currency;
      }
    });

    return {
      price: parseFloat(totalPrice.toFixed(2)),
      currency,
      duration: totalDurationMinutes / 60,
    };
  }, [bookingTime, unit]);

  // Handle booking confirmationP
  const handleConfirmBooking = async () => {
    if (!bookingPrice || !bookingInfo) return;
    const paymentRequest: PaymentRequest = {
      amount: bookingPrice.price,
      orderInfo: `Sport Booking - Hoa don thue '${unit.title}' tu ${bookingInfo.startTime} den ${bookingInfo.endTime} voi gia ${bookingPrice.price} ${bookingPrice.currency}`,
      userId: userId,
      startTime: bookingInfo.startTime,
      endTime: bookingInfo.endTime,
      bookingDay: bookingInfo.unformatDate,
      unitId: unit.id,
      unitName: unit.title,
      timestamp: getCurrentTimeWithOffset(),
    };

    try {
      await pay(paymentRequest);
      setShowPaymentModal(true);
    } catch (error) {
      logError(error as Error, 'Error confirming booking:');
      toastError(
        i18n.t('booking.error.title'),
        i18n.t('booking.error.description')
      );
    }
  };

  const handlePaymentComplete = () => {
    // Handle post-payment logic
    navigation.navigate('BookingSuccess');
  };

  return (
    <View style={styles.container}>
      <HeaderWithBack title={i18n.t('booking.title')} isClose={false} />

      <ScrollView
        style={styles.scrollBox}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Unit summary section */}
        <UnitSummary unit={unit} />

        {/* Time selector section */}
        <TimeSelection
          onPress={() => setTimelineModalVisible(true)}
          bookingInfo={bookingInfo}
          bookingPrice={bookingPrice}
        />
        <TimeSelectionModal
          visible={timelineModalVisible}
          onClose={() => setTimelineModalVisible(false)}
          onSelectTime={(newEvent) => {
            setBookingTime(newEvent);
          }}
        />

        <View style={styles.footerSpacer} />
      </ScrollView>
      <View style={styles.footer}>
        <Button
          disable={!bookingPrice}
          title={i18n.t('booking.submit')}
          onPress={handleConfirmBooking}
          buttonStyle={styles.confirmButton}
        />
      </View>

      <PayRedirectModal
        visible={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        paymentUrl={paymentResponse?.payUrl || ''}
        paymentMethod="ZaloPay"
        amount={bookingPrice?.price || 0}
        currency={bookingPrice?.currency || ''}
        onPaymentComplete={handlePaymentComplete}
      />

      {isLoading && <Loading color={theme.primary} />}
    </View>
  );
};

const createStyles = (theme: IColorScheme) =>
  StyleSheet.create({
    container: {
      height: '100%',
      width: '100%',
      backgroundColor: theme.backgroundDark,
      position: 'relative',
      flexDirection: 'column',
    },
    scrollBox: {
      flex: 1,
    },
    content: {
      gap: hp(1),
      paddingHorizontal: wp(4),
    },
    footerSpacer: {
      height: hp(12),
    },
    footer: {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      width: wp(100),
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: hp(1),
    },
    confirmButton: {
      width: '100%',
      borderRadius: Radius.full,
    },
  });

export default React.memo(Booking);
