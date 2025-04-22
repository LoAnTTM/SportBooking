import React, { ReactNode, useContext, useRef } from 'react';
import { Animated, Pressable, StyleSheet, ViewStyle } from 'react-native';

import { IColorScheme } from '@/constants';
import { ThemeContext } from '@/contexts/theme';
import { RootParamList } from '@/screens';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export type BackButtonProps = {
  styles?: ViewStyle;
  icon: ReactNode;
  onPress?: () => void;
};

function BackButton(props: BackButtonProps) {
  const { theme } = useContext(ThemeContext);
  const styles = createStyles(theme);
  const navigation = useNavigation<NativeStackNavigationProp<RootParamList>>();

  // Create animated value for scale
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const defaultOnPress = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    }
  };

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.9,
      useNativeDriver: true,
      speed: 50,
      bounciness: 4,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 50,
      bounciness: 4,
    }).start();
  };

  const animatedStyle = {
    transform: [{ scale: scaleAnim }],
  };

  return (
    <Pressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={props.onPress || defaultOnPress}
      style={styles.container}
    >
      <Animated.View style={[animatedStyle, props.styles]}>
        {props.icon}
      </Animated.View>
    </Pressable>
  );
}

const createStyles = (_: IColorScheme) => {
  return StyleSheet.create({
    container: {
      width: 50,
      height: 50,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });
};

export default BackButton;
