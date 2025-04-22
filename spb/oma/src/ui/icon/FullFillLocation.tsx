import React from 'react';
import Svg, { Circle, Ellipse, Path } from 'react-native-svg';

import { DEFAULT_ICON_SIZE } from '@/constants';
import { IIconProps } from '@/ui/icon';

const FullFillLocationIcon: React.FC<IIconProps> = ({
  color,
  size = DEFAULT_ICON_SIZE,
  ...props
}) => {
  return (
    <Svg width={size} height={size + 12} viewBox="0 0 36 48" fill="none" {...props}>
      <Ellipse cx="18" cy="38" rx="10" ry="5" fill="rgba(0,0,0,0.2)" />
      <Path
        d="
	  M18 2
	  C11 2, 6 8, 6 14.5
	  C6 21, 10 27, 18 38
	  C26 27, 30 21, 30 14.5
	  C30 8, 25 2, 18 2
	  Z"
        fill={color}
      />
      <Circle cx="18" cy="14.5" r="5" fill="#FFFFFF" />
    </Svg>
  );
};

export default FullFillLocationIcon;
