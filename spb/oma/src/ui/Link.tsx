import React from 'react';
import {
  GestureResponderEvent,
  Pressable,
  StyleSheet,
  Text,
  TextStyle,
} from 'react-native';

import { fontFamily } from '@/constants';

export type LinkProps = {
  title: string;
  style: TextStyle;
  onPress: (event: GestureResponderEvent) => void;
};

const Link: React.FC<LinkProps> = ({ title, style, onPress }) => {
  return (
    <Pressable onPress={onPress}>
      <Text style={[styles.link, style]}> {title}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  link: {
    ...fontFamily.POPPINS_MEDIUM,
  },
});

export default Link;
