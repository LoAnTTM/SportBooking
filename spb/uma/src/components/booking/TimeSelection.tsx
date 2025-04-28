import React, { FC, useContext } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { DEFAULT_ICON_SIZE, fontFamily, fontSize, IColorScheme, Radius } from '@/constants';
import { ThemeContext } from '@/contexts/theme';
import { hp, wp } from '@/helpers/dimensions';
import i18n from '@/helpers/i18n';
import CalendarIcon from '@/ui/icon/Calendar';
import TimeCircleIcon from '@/ui/icon/TimeCircle';

type Props = {
  onPress: () => void;
  bookingInfo: {
    date: string;
    startTime: string;
    endTime: string;
  } | null;
  bookingPrice: {
    price: number;
    currency: string;
    duration: number;
  } | null;
};

const TimeSelection: FC<Props> = ({ onPress, bookingInfo, bookingPrice }) => {
  const { theme } = useContext(ThemeContext);
  const styles = createStyles(theme);

  if (!bookingInfo) {
    return (
      <View style={styles.container}>
        <View style={styles.iconContainer}>
          <Pressable style={styles.iconWrapper} onPress={onPress}>
            <TimeCircleIcon color={theme.white} size={DEFAULT_ICON_SIZE + 4} />
          </Pressable>
          <View style={styles.iconTextWrapper}>
            <Text style={styles.iconText}>
              {i18n.t('booking.select_date.description')}
            </Text>
          </View>
        </View>
      </View>
    );
  }

  // Show the flight-ticket style booking info
  return (
    <View style={styles.ticketContainer}>
      {/* Date header */}
      <Pressable style={styles.dateHeader} onPress={onPress}>
        <CalendarIcon size={DEFAULT_ICON_SIZE - 4} color={theme.primary} />
        <Text style={styles.dateText}>{bookingInfo.date}</Text>
      </Pressable>

      {/* Main ticket content */}
      <View style={styles.ticketContent}>
        {/* Left side - Start time */}
        <View style={styles.ticketSide}>
          <Text style={styles.timeText}>{bookingInfo.startTime}</Text>
        </View>

        {/* Center - Flight icon and dotted line */}
        <View style={styles.ticketCenter}>
          <View style={styles.circleIcon}>
            <TimeCircleIcon color={theme.white} size={DEFAULT_ICON_SIZE} />
          </View>
          <View style={styles.dottedLine} />
        </View>

        {/* Right side - End time */}
        <View style={styles.ticketSide}>
          <Text style={styles.timeText}>{bookingInfo.endTime}</Text>
        </View>
      </View>

      {/* Price footer */}
      {bookingPrice && (
        <View style={styles.priceFooter}>
          <Text style={styles.priceText}>
            {bookingPrice.price.toLocaleString()} {bookingPrice.currency}
          </Text>
          <Text style={styles.durationText}>
            {bookingPrice.duration}{' '}
            {bookingPrice.duration === 1 ? 'hour' : 'hours'}
          </Text>
        </View>
      )}
    </View>
  );
};

const createStyles = (theme: IColorScheme) =>
  StyleSheet.create({
    container: {
      marginTop: hp(2),
      padding: wp(4),
      backgroundColor: theme.backgroundLight,
      borderRadius: Radius.md,
      borderWidth: 1,
      borderColor: theme.borderLight,
    },
    iconContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: wp(4),
    },
    iconWrapper: {
      width: wp(12),
      height: wp(12),
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: Radius.md,
      backgroundColor: theme.color3,
    },
    iconTextWrapper: {
      flex: 1,
    },
    iconText: {
      ...fontFamily.POPPINS_ITALIC,
      fontSize: fontSize.sm,
      color: theme.textLight,
      width: '80%',
    },

    // New ticket-style styles
    ticketContainer: {
      marginTop: hp(2),
      backgroundColor: theme.backgroundLight,
      borderRadius: Radius.md,
      borderWidth: 1,
      borderColor: theme.borderLight,
      overflow: 'hidden',
    },
    dateHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: wp(3),
      backgroundColor: theme.backgroundLight,
      borderBottomWidth: 1,
      borderBottomColor: theme.borderLight,
      gap: wp(2),
    },
    dateText: {
      ...fontFamily.POPPINS_MEDIUM,
      fontSize: fontSize.sm,
      color: theme.primary,
    },
    ticketContent: {
      flexDirection: 'row',
      padding: wp(4),
      alignItems: 'center',
    },
    ticketSide: {
      flex: 1,
      alignItems: 'center',
    },
    ticketCenter: {
      alignItems: 'center',
      width: wp(12),
      height: '100%',
    },
    circleIcon: {
      width: wp(10),
      height: wp(10),
      borderRadius: wp(5),
      backgroundColor: theme.primary,
      justifyContent: 'center',
      alignItems: 'center',
      marginVertical: hp(1),
    },
    dottedLine: {
      flex: 1,
      height: 1,
      borderStyle: 'solid',
      borderWidth: 1,
      borderColor: theme.primary,
      backgroundColor: theme.primary,
      width: '100%',
    },
    timeText: {
      ...fontFamily.POPPINS_BOLD,
      fontSize: fontSize.xl,
      color: theme.textDark,
      marginBottom: hp(0.5),
    },
    locationText: {
      ...fontFamily.POPPINS_MEDIUM,
      fontSize: fontSize.sm,
      color: theme.textDark,
    },
    locationSubtext: {
      ...fontFamily.POPPINS_REGULAR,
      fontSize: fontSize.xs,
      color: theme.textLight,
    },
    priceFooter: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      padding: wp(3),
      borderTopWidth: 1,
      borderStyle: 'dashed',
      borderColor: theme.borderLight,
    },
    priceText: {
      ...fontFamily.POPPINS_BOLD,
      fontSize: fontSize.md,
      color: theme.primary,
    },
    durationText: {
      ...fontFamily.POPPINS_MEDIUM,
      fontSize: fontSize.sm,
      color: theme.textLight,
    },
    changeTimeContainer: {
      padding: wp(2),
      alignItems: 'center',
      borderTopWidth: 1,
      borderTopColor: theme.borderLight,
    },
    changeTimeText: {
      ...fontFamily.POPPINS_REGULAR,
      fontSize: fontSize.xs,
      color: theme.textLight,
      textDecorationLine: 'underline',
    },

    // Keep these for backward compatibility
    bookingInfoContainer: {
      flex: 1,
    },
    bookingDateText: {
      ...fontFamily.POPPINS_MEDIUM,
      fontSize: fontSize.sm,
      color: theme.textDark,
      marginBottom: hp(0.5),
    },
    bookingTimeText: {
      ...fontFamily.POPPINS_REGULAR,
      fontSize: fontSize.sm,
      color: theme.primary,
      marginBottom: hp(0.5),
    },
  });

export default React.memo(TimeSelection);
