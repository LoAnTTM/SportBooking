import React, { FC, useCallback, useContext, useRef } from 'react';
import { Animated, PanResponder, StyleSheet, View } from 'react-native';
import { HOUR_BLOCK_HEIGHT, UnavailableHours } from 'react-native-calendars/src/timeline/Packer';

import { nextBlockValidate } from '@/components/booking/Timeline';
import { IColorScheme, Radius } from '@/constants';
import { ThemeContext } from '@/contexts/theme';
import { wp } from '@/helpers/dimensions';

type Props = {
  position: 'top' | 'bottom';
  animatedHeight: Animated.Value;
  animatedTop: Animated.Value;
  disableHours: UnavailableHours[] | undefined;
  scrollY: React.MutableRefObject<number>;
};

const EdgeResize: FC<Props> = ({
  position,
  animatedHeight,
  animatedTop,
  disableHours,
  scrollY,
}) => {
  const { theme } = useContext(ThemeContext);
  const styles = createStyles(theme);

  const snapSizePx = HOUR_BLOCK_HEIGHT / 2;
  const snapToInterval = useCallback((value: number) => {
    return Math.round(value / snapSizePx) * snapSizePx;
  }, []);

  const startHeight = useRef<number>(0);
  const startTop = useRef<number>(0);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,

      onPanResponderGrant: () => {
        animatedHeight.stopAnimation((value) => {
          startHeight.current = value;
        });
        if (position === 'top') {
          animatedTop.stopAnimation((value) => {
            startTop.current = value;
          });
        }
      },

      onPanResponderMove: (e, gestureState) => {
        if (position === 'bottom') {
          const newHeight = startHeight.current + gestureState.dy;
          if (newHeight < snapSizePx) {
            return;
          }

          // Check bottom box inside unavailable hours
          if (
            !nextBlockValidate(
              disableHours,
              // @ts-ignore
              newHeight + animatedTop.__getValue(),
              scrollY.current
            )
          ) {
            return;
          }

          animatedHeight.setValue(newHeight);
        } else {
          const newHeight = startHeight.current - gestureState.dy;
          if (newHeight < snapSizePx) {
            return;
          }

          const newTop = startTop.current + gestureState.dy;
          // Check top box inside unavailable hours
          if (!nextBlockValidate(disableHours, newTop, scrollY.current)) {
            return;
          }

          animatedHeight.setValue(newHeight);
          animatedTop.setValue(newTop);
        }
      },

      onPanResponderRelease: () => {
        animatedHeight.flattenOffset();
        // @ts-ignore
        animatedHeight.setValue(snapToInterval(animatedHeight.__getValue()));

        if (position === 'top') {
          animatedTop.flattenOffset();
          // @ts-ignore
          const deltaY = animatedTop.__getValue() - startTop.current;
          animatedTop.setValue(startTop.current + snapToInterval(deltaY));
        }
      },
    })
  ).current;

  return (
    <View
      style={[
        styles.edgeResize,
        position === 'top' && { top: 0, justifyContent: 'flex-start' },
        position === 'bottom' && { bottom: 0, justifyContent: 'flex-end' },
      ]}
      {...panResponder.panHandlers}
    >
      <View
        hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
        style={[
          styles.edgeBox,
          position === 'top' && { marginLeft: wp(2), marginTop: -wp(1) },
          position === 'bottom' && { marginRight: wp(2), marginBottom: -wp(1) },
        ]}
      />
    </View>
  );
};

const createStyles = (theme: IColorScheme) =>
  StyleSheet.create({
    edgeResize: {
      height: 2,
      width: '100%',
      position: 'absolute',
      bottom: 0,
      alignItems: 'center',
      zIndex: 10,
      flexDirection: 'row',
    },
    edgeBox: {
      width: wp(4),
      height: wp(4),
      backgroundColor: theme.color4,
      borderRadius: Radius.full,
      borderWidth: 1,
      borderColor: theme.color4,
    },
  });

export default React.memo(EdgeResize);
