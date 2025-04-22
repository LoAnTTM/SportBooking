import React, { FC, ReactNode } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  Extrapolation, interpolate, SharedValue, useAnimatedStyle
} from 'react-native-reanimated';

type SliderItemProps = {
  index: number;
  scrollX: SharedValue<number>;
  children: ReactNode;
  width: number;
};

const SliderItem: FC<SliderItemProps> = ({
  children,
  index,
  scrollX,
  width,
}) => {
  const rnAnimatedStyle = useAnimatedStyle(() => {
    const translateX = interpolate(
      scrollX.value,
      [(index - 1) * width, index * width, (index + 1) * width],
      [-width * 0.3, 0, width * 0.3],
      Extrapolation.CLAMP
    );

    return {
      transform: [{ translateX: translateX }],
    };
  });

  const styles = createStyles(width);

  return (
    <Animated.View style={[styles.container, rnAnimatedStyle]}>
      {children}
    </Animated.View>
  );
};

const createStyles = (width: number) =>
  StyleSheet.create({
    container: {
      width: width,
      justifyContent: 'flex-end',
      alignItems: 'center',
    },
  });

export default SliderItem;
