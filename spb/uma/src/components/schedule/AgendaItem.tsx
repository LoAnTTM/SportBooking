import { formatDate } from 'date-fns';
import isEmpty from 'lodash/isEmpty';
import React, { useCallback, useContext } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ShadowedView } from 'react-native-fast-shadow';

import { DEFAULT_ICON_SIZE, fontFamily, fontSize, IColorScheme, Radius } from '@/constants';
import { ThemeContext } from '@/contexts/theme';
import { hp, wp } from '@/helpers/dimensions';
import { stringTimeToDateTime } from '@/helpers/function';
import { MainStackParamList } from '@/screens/main';
import { CalendarEvent } from '@/services/types';
import TimeCircleIcon from '@/ui/icon/TimeCircle';
import WalletIcon from '@/ui/icon/Wallet';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

interface ItemProps {
  item: CalendarEvent;
}

const AgendaItem = (props: ItemProps) => {
  const { item } = props;
  const { theme } = useContext(ThemeContext);
  const styles = createStyles(theme);

  // Get status color based on booking status
  const getStatusColor = useCallback(
    (startTime: Date) => {
      // Check if startTime is provided
      if (!startTime) return theme.textLight;

      // Get current date and time
      const now = new Date();
      console.log(startTime, now);
      // Otherwise, determine status based on time
      if (startTime < now) {
        // Past booking (completed)
        return theme.success;
      } else {
        // Upcoming booking
        // Calculate if the booking is within the next 24 hours
        const nextDay = new Date();
        nextDay.setHours(now.getHours() + 24);

        if (startTime < nextDay) {
          // Within next 24 hours - show with urgent color
          return theme.warning;
        } else {
          // Regular upcoming booking
          return theme.primary;
        }
      }
    },
    [theme]
  );

  // Handle empty item
  if (isEmpty(item)) {
    return (
      <View style={styles.emptyItem}>
        <Text style={styles.emptyItemText}>No bookings scheduled</Text>
      </View>
    );
  }

  return (
    <View style={styles.item}>
      <ShadowedView style={styles.itemContent}>
        {/* Status Indicator */}
        <View
          style={[
            styles.statusIndicator,
            { backgroundColor: getStatusColor(item.startTime) },
          ]}
        />

        <View style={styles.contentContainer}>
          {/* Header with title and status */}
          <View style={styles.header}>
            <Text style={styles.itemTitle} numberOfLines={1}>
              {item.title}
            </Text>
          </View>

          {/* Time info */}
          <View style={styles.infoRow}>
            <TimeCircleIcon
              size={DEFAULT_ICON_SIZE - 8}
              color={theme.primary}
            />
            <Text style={styles.infoText}>
              {formatDate(item.startTime, "HH:mm")} - {formatDate(item.endTime, "HH:mm")} ({item.duration})
            </Text>
          </View>

          {/* Price info */}
          <View style={styles.infoRow}>
            <WalletIcon size={DEFAULT_ICON_SIZE - 8} color={theme.primary} />
            <Text style={styles.infoText}>
              {item.price.toLocaleString()} {item.currency}
            </Text>
          </View>
        </View>
      </ShadowedView>
    </View>
  );
};

const createStyles = (theme: IColorScheme) =>
  StyleSheet.create({
    item: {
      marginHorizontal: wp(4),
      marginVertical: hp(1),
    },
    itemContent: {
      overflow: 'hidden',
      padding: 0,
      backgroundColor: theme.backgroundLight,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 5,
      height: '100%',
      width: '100%',
      flexDirection: 'row',
    },
    statusIndicator: {
      width: wp(2),
      height: '100%',
    },
    contentContainer: {
      flex: 1,
      padding: wp(4),
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: hp(1.5),
    },
    itemTitle: {
      ...fontFamily.POPPINS_BOLD,
      fontSize: fontSize.md,
      color: theme.textDark,
      flex: 1,
      marginRight: wp(2),
    },
    statusBadge: {
      paddingHorizontal: wp(2),
      paddingVertical: hp(0.3),
      borderRadius: Radius.full,
      justifyContent: 'center',
      alignItems: 'center',
    },
    statusText: {
      ...fontFamily.POPPINS_MEDIUM,
      fontSize: fontSize.xs,
      textTransform: 'capitalize',
    },
    infoRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: hp(0.8),
      gap: wp(2),
    },
    infoText: {
      ...fontFamily.POPPINS_REGULAR,
      fontSize: fontSize.sm,
      color: theme.textDark,
      flex: 1,
    },
    emptyItem: {
      padding: wp(5),
      backgroundColor: theme.backgroundLight,
      justifyContent: 'center',
      alignItems: 'center',
      height: hp(10),
      marginHorizontal: wp(4),
      marginVertical: hp(1),
      borderRadius: Radius.md,
      borderWidth: 1,
      borderColor: theme.borderLight,
      borderStyle: 'dashed',
    },
    emptyItemText: {
      ...fontFamily.POPPINS_ITALIC,
      fontSize: fontSize.sm,
      color: theme.textLight,
    },
  });

export default React.memo(AgendaItem);
