import React from 'react';
import Svg, { Path } from 'react-native-svg';

import { DEFAULT_ICON_SIZE } from '@/constants';
import { IIconProps } from '@/ui/icon';

const LeftIcon: React.FC<IIconProps> = ({
  color,
  size = DEFAULT_ICON_SIZE,
  ...props
}) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
      <Path
        d="M14 17L12.237 15.2527C10.8311 13.8592 10.1281 13.1625 10.0199 12.3133C9.99337 12.1053 9.99337 11.8947 10.0199 11.6867C10.1281 10.8375 10.8311 10.1408 12.237 8.74731L14 7"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </Svg>
  );
};

export default LeftIcon;
