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
  >
    <route.icon color={isActive ? iconActiveColor : iconInactiveColor} />
    <Text style={[styles.tabText]}>{route.title}</Text>
  </Pressable>
);

export default memo(UnitTabButton);
