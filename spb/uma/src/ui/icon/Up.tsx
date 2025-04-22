import React from 'react';
import Svg, { Path } from 'react-native-svg';

import { DEFAULT_ICON_SIZE } from '@/constants';
import { IIconProps } from '@/ui/icon';

const DownIcon: React.FC<IIconProps> = ({
  color,
  size = DEFAULT_ICON_SIZE,
  ...props
}) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
      <Path
        d="M7 14L8.74731 12.237C10.1408 10.8311 10.8375 10.1281 11.6867 10.0199C11.8947 9.99337 12.1053 9.99337 12.3133 10.0199C13.1625 10.1281 13.8592 10.8311 15.2527 12.237L17 14"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </Svg>
  );
};

export default DownIcon;
