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
        d="M17 10L15.2527 11.763C13.8592 13.1689 13.1625 13.8719 12.3133 13.9801C12.1053 14.0066 11.8947 14.0066 11.6867 13.9801C10.8375 13.8719 10.1408 13.1689 8.74731 11.763L7 10"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </Svg>
  );
};

export default DownIcon;
