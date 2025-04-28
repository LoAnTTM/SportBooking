import React, { FC, useCallback, useContext, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { TimelineEventProps, TimelineList, TimelineProps } from 'react-native-calendars';

import TimelineDay from '@/components/booking/Timeline';
import { DISABLE_COLOR, IColorScheme } from '@/constants';
import { ThemeContext } from '@/contexts/theme';
import {
  numberTimeToDateTime, numberTimeToString, stringDateToNumberTime
} from '@/helpers/function';
import { deepClone } from '@/helpers/object';
import { TimeRange } from '@/services/types';

type Props = {
  events: { [date: string]: TimelineEventProps[] };
  unavailableHours: { start: number; end: number }[];
  currentDate: string;
  setNewEvent: (newEvent: { [date: string]: TimeRange } | undefined) => void;
};

const Timelines: FC<Props> = ({
  events,
  unavailableHours,
  currentDate,
  setNewEvent,
}) => {
  const { theme } = useContext(ThemeContext);
  const styles = createStyles(theme);

  const timelineProps: Partial<TimelineProps> = {
    format24h: true,
    unavailableHours: unavailableHours,
    unavailableHoursColor: DISABLE_COLOR,
  };

  const handleAddNewEvent = (startTime: number, endTime: number) => {
    setNewEvent({
      [currentDate]: {
        startTime: numberTimeToString(startTime),
        endTime: numberTimeToString(endTime),
      },
    });
  };

  const initialTime = useMemo(() => {
    const startTime = numberTimeToDateTime(unavailableHours[0]?.end);
    return {
      hour: startTime.getHours(),
      minutes: startTime.getMinutes(),
    };
  }, [unavailableHours]);

  const disableHours = useCallback(() => {
    const result = deepClone(unavailableHours);
    if (events && Object.keys(events).length > 0 && events[currentDate]) {
		events[currentDate].forEach((event) => {
			result.push({
				start: stringDateToNumberTime(event.start),
				end: stringDateToNumberTime(event.end),
			});
		});
    }
	
    // Sort by start
    return result.sort((a, b) => a.start - b.start);
  }, [unavailableHours, events, currentDate]);

  return (
    <View style={styles.container}>
      <TimelineList
        events={events}
        timelineProps={timelineProps}
        showNowIndicator
        initialTime={initialTime}
        scrollToNow
        renderItem={(props: TimelineProps) => (
          <TimelineDay
            {...props}
            disableHours={disableHours()}
            key={props.date as string}
            onAddNewEvent={handleAddNewEvent}
          />
        )}
      />
    </View>
  );
};

const createStyles = (theme: IColorScheme) =>
  StyleSheet.create({
    container: {
      width: '100%',
      //   height: hp(65),
      flex: 1,
      backgroundColor: theme.backgroundLight,
      overflow: 'hidden',
    },
  });

export default Timelines;
