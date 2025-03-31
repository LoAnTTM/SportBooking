import { useEffect, useState } from 'react';
import { Animated } from 'react-native';

export const useSearchAnimation = (resultsLength: number) => {
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: resultsLength > 0 ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [resultsLength, fadeAnim]);

  return fadeAnim;
};
