import React, { FC, useContext } from 'react';
import { Pressable, StyleProp, StyleSheet, ViewStyle } from 'react-native';
import { ShadowedView } from 'react-native-fast-shadow';

import { DEFAULT_ICON_SIZE } from '@/constants';
import { ThemeContext } from '@/contexts/theme';
import MoveNotificationIcon from '@/ui/icon/MoveLocation';

export interface MapLocationButtonProps {
  onPress: () => void;
  containerStyle: StyleProp<ViewStyle>;
}

const MapLocationButton: FC<MapLocationButtonProps> = ({
  onPress,
  containerStyle,
}) => {
  const { theme } = useContext(ThemeContext);

  return (
    <ShadowedView style={styles.wrapper}>
      <Pressable onPress={onPress} style={[styles.container, containerStyle]}>
        <MoveNotificationIcon color={theme.white} size={DEFAULT_ICON_SIZE} />
      </Pressable>
    </ShadowedView>
  );
};

export default MapLocationButton;

const styles = StyleSheet.create({
  wrapper: {
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  container: {
    width: DEFAULT_ICON_SIZE * 1.75,
    height: DEFAULT_ICON_SIZE * 1.75,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
