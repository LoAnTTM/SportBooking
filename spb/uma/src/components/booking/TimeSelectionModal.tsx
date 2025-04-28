import React, { FC, useContext, useEffect, useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { CalendarProvider, TimelineEventProps, WeekCalendar } from 'react-native-calendars';
import { MarkedDates } from 'react-native-calendars/src/types';
import { useShallow } from 'zustand/shallow';

import Timelines from '@/components/booking/Timelines';
import { DEFAULT_ICON_SIZE, fontFamily, fontSize, IColorScheme, Radius } from '@/constants';
import { ThemeContext } from '@/contexts/theme';
import { getDate } from '@/helpers/datetime';
import { hp, wp } from '@/helpers/dimensions';
import { stringDateToDate, stringTimeToNumberTime } from '@/helpers/function';
import i18n from '@/helpers/i18n';
import { TimeRange } from '@/services/types';
import CloseIcon from '@/ui/icon/Close';
import BaseModal from '@/ui/modal/BaseModal';
import { useUnitStore } from '@/zustand';

type Props = {
  onClose: () => void;
  visible: boolean;
  onSelectTime: (newEvent: { [date: string]: TimeRange } | undefined) => void;
};

const TimeSelectionModal: FC<Props> = ({ onClose, visible, onSelectTime }) => {
  const { theme } = useContext(ThemeContext);
  const styles = createStyles(theme);
  const unit = useUnitStore((s) => s.currentUnit);

  const [events, setEvents] = useState<{
    [date: string]: TimelineEventProps[];
  }>({});
  const [currentDate, setCurrentDate] = useState(getDate());
  const [markedDate, setMarkedDate] = useState<MarkedDates>();

  const fetchBookedTime = useUnitStore((s) => s.fetchBookedTime);
  const bookedTimes = useUnitStore(useShallow((s) => s.bookedTimes));

  useEffect(() => {
    fetchBookedTime(currentDate);
  }, [fetchBookedTime, currentDate]);

  useEffect(() => {
    if (
      !bookedTimes ||
      Object.keys(bookedTimes).length === 0 ||
      !bookedTimes[currentDate]
    )
      return;
    setMarkedDate((prev) => ({
      ...prev,
      [currentDate]: { marked: true },
    }));

    setEvents((prev) => ({
      ...prev,
      [currentDate]: bookedTimes[currentDate].map((item) => ({
        start: fullStringDate(item.startTime, currentDate),
        end: fullStringDate(item.endTime, currentDate),
        color: theme.color3,
      })),
    }));
  }, [bookedTimes, currentDate]);

  const fullStringDate = (timeHHmm: string, date: string): string => {
    return `${date} ${timeHHmm}:00`;
  };

  const onDateChanged = (date: string) => {
    setCurrentDate(date);
    fetchBookedTime(date);
  };

  const unavailableHours = useMemo(() => {
    const unitTimeRange = (unit?.price || []).map((item) => ({
      start: stringTimeToNumberTime(item.startTime),
      end: stringTimeToNumberTime(item.endTime),
    }));

    const DAY_START_HOURS: number = 0;
    const DAY_END_HOURS: number = 24;

    let result: { start: number; end: number }[] = [];
    let hour = DAY_START_HOURS;
    while (hour < DAY_END_HOURS) {
      if (unitTimeRange.length === 0) {
        result.push({ start: hour, end: DAY_END_HOURS });
        hour = DAY_END_HOURS;
        break;
      }
      if (hour < unitTimeRange[0].start) {
        result.push({ start: hour, end: unitTimeRange[0].start });
        hour = unitTimeRange[0].start;
      } else {
        hour = unitTimeRange[0].end;
        unitTimeRange.shift();
      }
    }
    return result;
  }, [unit]);

  return (
    <BaseModal visible={visible} onClose={onClose}>
      <View style={styles.modalContent}>
        <View style={styles.header}>
          <Text style={styles.title}>
            {i18n.t('booking.select_date.title')}
          </Text>
          <Pressable onPress={onClose} hitSlop={10}>
            <CloseIcon size={DEFAULT_ICON_SIZE} color={theme.textDark} />
          </Pressable>
        </View>
        <CalendarProvider
          date={currentDate}
          onDateChanged={onDateChanged}
          showTodayButton
        >
          <WeekCalendar
            firstDay={1}
            allowShadow={true}
            onDayPress={(date) => onDateChanged(date.dateString)}
            markedDates={markedDate}
          />
          <Timelines
            unavailableHours={unavailableHours}
            events={events}
            currentDate={currentDate}
            setNewEvent={(e) => {
              onSelectTime(e);
              onClose();
            }}
          />
        </CalendarProvider>
      </View>
    </BaseModal>
  );
};

const createStyles = (theme: IColorScheme) =>
  StyleSheet.create({
    modalContent: {
      backgroundColor: theme.backgroundLight,
      borderTopLeftRadius: Radius.xl,
      borderTopRightRadius: Radius.xl,
      height: hp(90),
      width: '100%',
      position: 'relative',
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: wp(4),
      height: hp(6),
      borderBottomWidth: 1,
      borderBottomColor: theme.borderLight,
    },
    title: {
      ...fontFamily.POPPINS_BOLD,
      fontSize: fontSize.md,
      color: theme.textDark,
    },
  });

export default React.memo(TimeSelectionModal);
