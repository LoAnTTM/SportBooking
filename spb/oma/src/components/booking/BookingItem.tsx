import React, { FC } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ShadowedView } from 'react-native-fast-shadow';

import { fontFamily, fontSize, IColorScheme, Radius } from '@/constants';
import { hp, wp } from '@/helpers/dimensions';
import { OrderModel } from '@/types/model';
import CalendarIcon from '@/ui/icon/Calendar';
import DollarCircleIcon from '@/ui/icon/DollarCircle';
import TimeCircleIcon from '@/ui/icon/TimeCircle';

interface BookingItemProps {
  booking: OrderModel;
  theme: IColorScheme;
}

const BookingItem: FC<BookingItemProps> = ({ booking, theme }) => {
  const styles = createStyles(theme);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return theme.success;
      case 'pending':
        return theme.warning;
      case 'failure':
        return theme.error;
      default:
        return theme.textDark;
    }
  };

  const getStatusBackgroundColor = (status: string) => {
    switch (status) {
      case 'success':
        return `${theme.success}20`; // 20% opacity
      case 'pending':
        return `${theme.warning}20`;
      case 'failure':
        return `${theme.error}20`;
      default:
        return theme.backgroundLight;
    }
  };

  return (
    <ShadowedView style={styles.shadowContainer}>
      <TouchableOpacity
        style={[
          styles.container,
          { borderLeftColor: getStatusColor(booking.status) },
        ]}
        activeOpacity={0.7}
      >
        <View style={styles.header}>
          <Text style={styles.date}>{booking.orderItems[0].bookedDay}</Text>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: getStatusBackgroundColor(booking.status) },
            ]}
          >
            <Text
              style={[styles.status, { color: getStatusColor(booking.status) }]}
            >
              {booking.status.toUpperCase()}
            </Text>
          </View>
        </View>

        <View style={styles.infoContainer}>
          <View style={styles.infoRow}>
            <CalendarIcon color={theme.primary} size={16} />
            <Text style={styles.infoText}>{booking.orderItems[0].bookedDay}</Text>
          </View>

          <View style={styles.infoRow}>
            <TimeCircleIcon color={theme.primary} size={16} />
            <Text style={styles.infoText}>
              {booking.orderItems[0].startTime} - {booking.orderItems[0].endTime}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <DollarCircleIcon color={theme.primary} size={16} />
            <Text style={styles.infoText}>{booking.totalAmount} {booking.currency}</Text>
          </View>
        </View>
      </TouchableOpacity>
    </ShadowedView>
  );
};

const createStyles = (theme: IColorScheme) =>
  StyleSheet.create({
    shadowContainer: {
      borderRadius: Radius.xs,
      shadowColor: theme.shadow,
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      marginBottom: hp(1.5),
    },
    container: {
      backgroundColor: theme.backgroundLight,
      borderRadius: Radius.xs,
      padding: hp(2),
      borderLeftWidth: 6,
      overflow: 'hidden',
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: hp(1.5),
    },
    date: {
      ...fontFamily.POPPINS_MEDIUM,
      fontSize: fontSize.md,
      color: theme.textDark,
    },
    statusBadge: {
      paddingHorizontal: wp(2),
      paddingVertical: hp(0.5),
      borderRadius: Radius.full,
    },
    status: {
      ...fontFamily.POPPINS_MEDIUM,
      fontSize: fontSize.xs,
      fontWeight: 'bold',
    },
    infoContainer: {
      gap: hp(1),
    },
    infoRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: wp(2),
    },
    infoText: {
      ...fontFamily.POPPINS_REGULAR,
      fontSize: fontSize.sm,
      color: theme.textLight,
    },
  });

export default BookingItem;
