import { formatDate } from 'date-fns';
import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator, RefreshControl, StyleSheet, Text, TouchableOpacity, View
} from 'react-native';
import { AgendaList, CalendarProvider, WeekCalendar } from 'react-native-calendars';
import { useShallow } from 'zustand/shallow';

import EmptyState from '@/components/common/EmptyState';
import AgendaItem from '@/components/schedule/AgendaItem';
import { fontFamily, fontSize, IColorScheme } from '@/constants';
import { ThemeContext } from '@/contexts/theme';
import { getToday } from '@/helpers/datetime';
import { hp, wp } from '@/helpers/dimensions';
import { convertOrdersToCalendarData } from '@/helpers/function';
import i18n from '@/helpers/i18n';
import CalendarIcon from '@/ui/icon/Calendar';
import { useAuthStore, useOrderStore } from '@/zustand';

const Schedule: React.FC = () => {
  const { theme } = useContext(ThemeContext);
  const styles = createStyles(theme);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedDate, setSelectedDate] = useState(getToday());
  const [viewMode, setViewMode] = useState('week'); // 'week' or 'month'

  const userId = useAuthStore((s) => s.userId);
  const { orders, fetchOrdersByUser, isLoading } = useOrderStore(
    useShallow((s) => ({
      orders: s.orders,
      fetchOrdersByUser: s.fetchOrdersByUser,
      isLoading: s.isLoading,
    }))
  );

  // Initial fetch of orders
  useEffect(() => {
    if (userId) {
      fetchOrdersByUser(userId);
    }
  }, [fetchOrdersByUser, userId]);

  // Pull-to-refresh functionality
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchOrdersByUser(userId);
    setRefreshing(false);
  }, [fetchOrdersByUser, userId]);

  // Format orders for calendar display
  const agendaItems = useMemo(() => {
    return convertOrdersToCalendarData(orders);
  }, [orders]);

  // Handle date selection in calendar
  const handleDateChange = useCallback((date: string) => {
    setSelectedDate(date);
  }, []);

  // Toggle between week and month view
  const toggleViewMode = useCallback(() => {
    setViewMode((prev) => (prev === 'week' ? 'month' : 'week'));
  }, []);

  // Render individual agenda items
  const renderItem = useCallback(({ item }: any) => {
    return <AgendaItem item={item} />;
  }, []);

  // Render empty state when no bookings are found
  const renderEmptyData = useCallback(() => {
    return (
      <View style={styles.emptyContainer}>
        <EmptyState
          icon={<CalendarIcon size={80} color={theme.primary} />}
          title={i18n.t('schedule.no_bookings_title')}
          description={i18n.t('schedule.no_bookings_description')}
        />
        <TouchableOpacity style={styles.refreshButton} onPress={onRefresh}>
          <Text style={styles.refreshButtonText}>
            {i18n.t('common.refresh')}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }, [styles, theme.primary, theme.white, onRefresh]);

  // Custom mark today and days with bookings
  const markedDates = useMemo(() => {
    const marked: any = {};

    // Mark today
    const today = getToday();
    marked[today] = {
      selected: today === selectedDate,
      marked: true,
      dotColor: theme.primary,
    };

    // Mark days with bookings
    orders.forEach((order) => {
      const bookingDate = order.orderItems[0].bookedDay; // Format: YYYY-MM-DD
      marked[bookingDate] = {
        ...marked[bookingDate],
        selected: bookingDate === selectedDate,
        marked: true,
        dotColor: theme.primary,
      };
    });

    return marked;
  }, [orders, selectedDate, theme.primary]);

  // Header component with date info and view toggle
  const renderHeader = useCallback(() => {
    const formattedDate = formatDate(selectedDate, 'MMMM d, yyyy');

    return (
      <View style={styles.headerContainer}>
        <View>
          <Text style={styles.headerTitle}>
            {i18n.t('schedule.my_bookings')}
          </Text>
          <Text style={styles.headerDate}>{formattedDate}</Text>
        </View>
        <TouchableOpacity
          style={styles.viewModeButton}
          onPress={toggleViewMode}
        >
          <Text style={styles.viewModeText}>
            {viewMode === 'week'
              ? i18n.t('schedule.month_view')
              : i18n.t('schedule.week_view')}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }, [selectedDate, viewMode, styles, toggleViewMode]);

  return (
    <View style={styles.container}>
      {renderHeader()}

      {isLoading && !refreshing ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.primary} />
          <Text style={styles.loadingText}>{i18n.t('common.loading')}</Text>
        </View>
      ) : (
        <CalendarProvider
          date={selectedDate}
          onDateChanged={handleDateChange}
          showTodayButton
          todayButtonStyle={styles.todayButton}
          theme={{
            todayButtonTextColor: theme.primary,
            calendarBackground: theme.backgroundLight,
            textSectionTitleColor: theme.textDark,
            selectedDayBackgroundColor: theme.primary,
            selectedDayTextColor: theme.white,
            todayTextColor: theme.primary,
            dayTextColor: theme.textDark,
            textDisabledColor: theme.textLight,
            dotColor: theme.primary,
            selectedDotColor: theme.white,
            arrowColor: theme.primary,
            monthTextColor: theme.textDark,
          }}
        >
          <View style={styles.calendarContainer}>
            <WeekCalendar
              firstDay={1}
              markedDates={markedDates}
              theme={{
                backgroundColor: theme.backgroundLight,
                calendarBackground: theme.backgroundLight,
                textSectionTitleColor: theme.textDark,
                selectedDayBackgroundColor: theme.primary,
                selectedDayTextColor: theme.white,
                todayTextColor: theme.primary,
                dayTextColor: theme.textDark,
                textDisabledColor: theme.textLight,
                dotColor: theme.primary,
                selectedDotColor: theme.white,
                arrowColor: theme.primary,
                monthTextColor: theme.textDark,
              }}
            />
          </View>

          <View style={styles.agendaContainer}>
            {agendaItems.length > 0 ? (
              <AgendaList
                sections={agendaItems}
                renderItem={renderItem}
                sectionStyle={styles.section}
                scrollToNextEvent
                infiniteListProps={{
                  itemHeight: 150, // Increased for better visuals
                  titleHeight: 60, // Increased for better visuals
                  itemHeightByType: {
                    LongEvent: 200,
                  },
                }}
                refreshControl={
                  <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                    colors={[theme.primary]}
                    tintColor={theme.primary}
                  />
                }
              />
            ) : (
              renderEmptyData()
            )}
          </View>
        </CalendarProvider>
      )}
    </View>
  );
};

const createStyles = (theme: IColorScheme) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.backgroundLight,
    },
    headerContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: wp(5),
      paddingVertical: hp(2),
      backgroundColor: theme.backgroundLight,
      borderBottomWidth: 1,
      borderBottomColor: theme.borderLight,
      elevation: 2,
      shadowColor: theme.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 3,
    },
    headerTitle: {
      ...fontFamily.POPPINS_BOLD,
      fontSize: fontSize.lg,
      color: theme.textDark,
      marginBottom: 4,
    },
    headerDate: {
      ...fontFamily.POPPINS_REGULAR,
      fontSize: fontSize.sm,
      color: theme.textLight,
    },
    viewModeButton: {
      backgroundColor: theme.backgroundVariant,
      paddingHorizontal: wp(3),
      paddingVertical: hp(1),
      borderRadius: 20,
      borderWidth: 1,
      borderColor: theme.borderLight,
    },
    viewModeText: {
      ...fontFamily.POPPINS_MEDIUM,
      fontSize: fontSize.xs,
      color: theme.primary,
    },
    calendarContainer: {
      backgroundColor: theme.backgroundLight,
      paddingBottom: hp(1),
      shadowColor: theme.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 3,
      elevation: 2,
    },
    divider: {
      height: 6,
      backgroundColor: theme.backgroundVariant,
      width: '100%',
    },
    centeredContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: wp(5),
      backgroundColor: theme.backgroundLight,
    },
    calendar: {
      borderBottomWidth: 1,
      borderBottomColor: theme.borderLight,
    },
    section: {
      backgroundColor: theme.backgroundLight,
      color: theme.textDark,
      textTransform: 'capitalize',
      ...fontFamily.POPPINS_MEDIUM,
      fontSize: fontSize.md,
      paddingTop: hp(2.5),
      paddingBottom: hp(1),
      paddingHorizontal: wp(5),
      marginTop: hp(1),
    },
    agendaContainer: {
      flex: 1,
      backgroundColor: theme.backgroundLight,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    loadingText: {
      ...fontFamily.POPPINS_REGULAR,
      fontSize: fontSize.md,
      color: theme.textLight,
      marginTop: hp(2),
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingTop: hp(10),
    },
    errorText: {
      ...fontFamily.POPPINS_MEDIUM,
      fontSize: fontSize.md,
      color: theme.error,
      textAlign: 'center',
      marginBottom: hp(1),
    },
    errorDescription: {
      ...fontFamily.POPPINS_REGULAR,
      fontSize: fontSize.sm,
      color: theme.textLight,
      textAlign: 'center',
      marginBottom: hp(3),
    },
    todayButton: {
      borderRadius: 20,
      paddingHorizontal: wp(3),
      backgroundColor: theme.backgroundLight,
      borderWidth: 1,
      borderColor: theme.primary,
    },
    refreshButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.primary,
      paddingHorizontal: wp(4),
      paddingVertical: hp(1.5),
      borderRadius: 20,
      marginTop: hp(3),
    },
    refreshButtonText: {
      ...fontFamily.POPPINS_MEDIUM,
      fontSize: fontSize.sm,
      color: theme.white,
      marginLeft: wp(2),
    },
  });
};

export default Schedule;
