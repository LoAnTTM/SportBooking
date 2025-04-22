import React from 'react';
import Svg, { Path } from 'react-native-svg';

import { DEFAULT_ICON_SIZE } from '@/constants';
import { IIconProps } from '@/ui/icon';

const MoveLocation: React.FC<IIconProps> = ({
  color,
  size = DEFAULT_ICON_SIZE,
  ...props
}) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 18 18" fill="none" {...props}>
      <Path
        d="M3.93903 7.48126L12.684 3.31726C13.959 2.70976 15.2895 4.04101 14.6828 5.31676L10.5188 14.061C9.94953 15.2558 8.22453 15.1823 7.75953 13.9425L6.99003 11.8883C6.91485 11.6879 6.79764 11.5059 6.64629 11.3545C6.49493 11.2032 6.31294 11.0859 6.11253 11.0108L4.05753 10.2405C2.81853 9.77551 2.74428 8.05051 3.93903 7.48126Z"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

export default MoveLocation;
