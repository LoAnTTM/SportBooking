import React, { FC } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { DEFAULT_ICON_SIZE } from '@/constants';
import { hp } from '@/helpers/dimensions';
import NotificationIcon from '@/ui/icon/Notification';

interface NotificationBellProps {
  hasNotifications?: boolean;
  onPress?: () => void;
  color: string;
  size?: number;
}

const NotificationBell: FC<NotificationBellProps> = ({
  hasNotifications = false,
  onPress,
  color,
  size = DEFAULT_ICON_SIZE,
}) => {
  return (
    <Pressable onPress={onPress} style={styles.container}>
      <NotificationIcon color={color} size={size} />
      {hasNotifications && <View style={styles.badge} />}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    paddingHorizontal: hp(1),
    justifyContent: 'center',
  },
  badge: {
    position: 'absolute',
    top: 0,
    right: hp(0.5),
    width: hp(1),
    height: hp(1),
    borderRadius: hp(0.5),
    backgroundColor: 'red',
  },
});

export default NotificationBell;
