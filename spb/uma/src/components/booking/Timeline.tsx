import React, { FC, Fragment, useCallback, useContext, useEffect, useRef, useState } from 'react';
import {
  Animated, PanResponder, Pressable, StyleSheet, Text, TouchableOpacity, View
} from 'react-native';
import { Timeline, TimelineProps } from 'react-native-calendars';
import { PackedEvent } from 'react-native-calendars/src/timeline/EventBlock';
import { HOUR_BLOCK_HEIGHT, UnavailableHours } from 'react-native-calendars/src/timeline/Packer';

import EdgeResize from '@/components/booking/EdgeResize';
import { fontFamily, fontSize, IColorScheme, Radius } from '@/constants';
import { ThemeContext } from '@/contexts/theme';
import { compareDateWithToday } from '@/helpers/datetime';
import { hp, wp } from '@/helpers/dimensions';
import { stringDateToDate } from '@/helpers/function';
import i18n from '@/helpers/i18n';
import { toastError } from '@/helpers/toast';
import Button from '@/ui/button/BaseButton';

export const nextBlockValidate = (
  disableHours: UnavailableHours[] | undefined,
  newTop: number,
  scrollY: number
): boolean => {
  if (disableHours && disableHours.length > 0) {
    const newLocation = scrollY + newTop;
    const newHour = newLocation / HOUR_BLOCK_HEIGHT;

    if (disableHours.find((uh) => uh.start < newHour && newHour < uh.end)) {
      return false;
    }
  }
  return true;
};

type Props = TimelineProps & {
  onAddNewEvent: (startTime: number, endTime: number) => void;
  disableHours: UnavailableHours[] | undefined;
};

const TimelineDay: FC<Props> = (props) => {
  const { theme } = useContext(ThemeContext);
  const styles = createStyles(theme);
  const [isPressed, setPressed] = useState<boolean>(false);
  const scrollY = useRef<number>(0);
  const animatedHeight = useRef(new Animated.Value(0)).current;
  const animatedTop = useRef(new Animated.Value(0)).current;
  const { disableHours, date } = props;
  const disableHoursRef = useRef(disableHours);

  useEffect(() => {
    disableHoursRef.current = disableHours;
  }, [disableHours]);

  // Format time for display (HH:MM format)
  const formatTime = (dateTime: string): string => {
    const date = new Date(dateTime);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const snapSizePx = HOUR_BLOCK_HEIGHT / 2;
  const snapToInterval = useCallback((value: number) => {
    return Math.round(value / snapSizePx) * snapSizePx;
  }, []);

  const startTop = useRef<number>(0);
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,

      onPanResponderGrant: () => {
        animatedTop.stopAnimation((value) => {
          startTop.current = value;
        });
      },

      onPanResponderMove: (e, g) => {
        let newTop = startTop.current + g.dy;
        // Can not move box outside range (0 hour to 24 hour)
        if (newTop < 0) {
          newTop = 0;
        }
        // Can not move box outside available hour range
        if (
          !nextBlockValidate(disableHoursRef.current, newTop, scrollY.current)
        ) {
          // Set newTop for nearest block
          return;
        }
        // @ts-ignore
        const newBottom = newTop + animatedHeight.__getValue();
        if (
          !nextBlockValidate(
            disableHoursRef.current,
            newBottom,
            scrollY.current
          )
        ) {
          return;
        }

        if (newBottom > hp(65)) {
          return;
        }

        animatedTop.setValue(newTop);
      },

      onPanResponderRelease: () => {
        animatedTop.flattenOffset();
        // @ts-ignore
        const deltaY = animatedTop.__getValue() - startTop.current;
        animatedTop.setValue(startTop.current + snapToInterval(deltaY));
      },
    })
  ).current;

  const nextSnapBlock = (yPosition: number, scrollY: number): number => {
    const deltaY = yPosition - scrollY;
    const gapScroll = snapToInterval(scrollY) - scrollY;
    return snapToInterval(deltaY - gapScroll) + gapScroll;
  };

  return (
    <View style={styles.timelineContainer}>
      <Timeline
        {...props}
        onBackgroundLongPress={(ts, time, yPosition) => {
          const currentDay = Array.isArray(date) ? date[0] || '' : date || '';
          if (
            currentDay !== '' &&
            compareDateWithToday(stringDateToDate(currentDay)) < 0
          ) {
            toastError(i18n.t('booking.select_date.select_in_past'));
            return;
          }

          props.onBackgroundLongPress?.(ts, time, yPosition);
          const nextSnapBlockVal = nextSnapBlock(yPosition, scrollY.current);

          let topVal: number;
          if (nextSnapBlockVal - (yPosition - scrollY.current) <= 0) {
            topVal = nextSnapBlockVal;
          } else {
            topVal = nextSnapBlockVal - snapSizePx;
          }

          animatedTop.setValue(topVal);
          animatedHeight.setValue(snapSizePx);
          setPressed(true);
        }}
        renderEvent={(event: PackedEvent) => (
          <TouchableOpacity
            style={[styles.event, { backgroundColor: event.color }]}
          >
            <Text style={styles.eventTime}>
              {formatTime(event.start)} - {formatTime(event.end)}
            </Text>
          </TouchableOpacity>
        )}
        showNowIndicator
        format24h
        scrollY={scrollY}
      />
      <View style={styles.footer}>
        <Button
          title={i18n.t('booking.select_date.submit')}
          onPress={() => {
            const startTime =
              // @ts-ignore
              Math.floor(scrollY.current + animatedTop.__getValue()) /
              HOUR_BLOCK_HEIGHT;
            const endTime =
              Math.floor(
                scrollY.current +
                  // @ts-ignore
                  animatedTop.__getValue() +
                  // @ts-ignore
                  animatedHeight.__getValue()
              ) / HOUR_BLOCK_HEIGHT;
            props.onAddNewEvent(startTime, endTime);
          }}
        />
      </View>
      {isPressed && (
        <Fragment>
          <Pressable
            style={styles.selectionLayer}
            onPress={() => {
              setPressed(false);
            }}
          />
          <Animated.View
            style={[
              styles.selectionBox,
              {
                top: animatedTop,
                height: animatedHeight,
                left: 72,
              },
            ]}
          >
            <View
              style={[
                styles.selectionBoxInside,
                { backgroundColor: theme.color1 },
              ]}
              {...panResponder.panHandlers}
            ></View>
            <EdgeResize
              position="top"
              animatedTop={animatedTop}
              animatedHeight={animatedHeight}
              disableHours={disableHours}
              scrollY={scrollY}
            />
            <EdgeResize
              position="bottom"
              animatedTop={animatedTop}
              animatedHeight={animatedHeight}
              disableHours={disableHours}
              scrollY={scrollY}
            />
          </Animated.View>
        </Fragment>
      )}
    </View>
  );
};

const createStyles = (theme: IColorScheme) =>
  StyleSheet.create({
    timelineContainer: {
      flex: 1,
    },
    event: {
      borderRadius: 4,
      padding: 8,
      opacity: 0.9,
    },
    eventTime: {
      ...fontFamily.POPPINS_REGULAR,
      fontSize: fontSize.sm,
      color: theme.white,
    },
    selectionLayer: {
      position: 'absolute',
      left: 0,
      right: 0,
      top: 0,
      bottom: hp(8),
      opacity: 0.5,
    },
    timelineWrapper: {
      flex: 1,
    },
    selectionBox: {
      position: 'absolute',
      left: 0,
      right: 0,
      borderWidth: 1,
      borderRadius: Radius.xs,
      borderStyle: 'dashed',
      borderColor: theme.color3,
    },
    selectionBoxInside: {
      width: '100%',
      height: '100%',
    },
    footer: {
      height: hp(8),
      paddingHorizontal: wp(4),
      backgroundColor: theme.backgroundLight,
      justifyContent: 'center',
    },
  });

export default TimelineDay;
