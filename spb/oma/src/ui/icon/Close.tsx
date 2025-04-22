import React from 'react';
import Svg, { Path } from 'react-native-svg';

import { DEFAULT_ICON_SIZE } from '@/constants';
import { IIconProps } from '@/ui/icon';

const CloseIcon: React.FC<IIconProps> = ({
  color,
  size = DEFAULT_ICON_SIZE,
  ...props
}) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
      <Path
        d="M5 5L19 19M5.00003 19L12 12L19 5"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </Svg>
  );
};

export default CloseIcon;
