import React, { FC, memo } from 'react';
import { Pressable, Text } from 'react-native';

import { UnitTabButtonProps } from '@/components/home/types';

const UnitTabButton: FC<UnitTabButtonProps> = ({
  route,
  isActive,
  onPress,
  styles,
  iconActiveColor,
  iconInactiveColor,
}) => (
  <Pressable
    onPress={onPress}
    style={[styles.tab]}
    accessibilityRole="tab"
    accessibilityState={{ selected: isActive }}
    android_ripple={{
      color: `${iconActiveColor}20`,
      borderless: true,
      radius: 35
    }}
  >
    {route.icon && <route.icon color={isActive ? iconActiveColor : iconInactiveColor} />}
    <Text
      style={[
        styles.tabText,
        isActive && { color: iconActiveColor, fontWeight: '500' }
      ]}
    >
      {route.title}
    </Text>
  </Pressable>
);

export default memo(UnitTabButton);
