import React from 'react';
import Svg, { Path } from 'react-native-svg';

import { DEFAULT_ICON_SIZE } from '@/constants';
import { IIconProps } from '@/ui/icon';

const MapIcon: React.FC<IIconProps> = ({
  color,
  size = DEFAULT_ICON_SIZE,
  ...props
}) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
      <Path
        d="M9 4C7.94444 4 6.88889 4.33333 6 5L3.8 6.65C3.29639 7.02771 3 7.62049 3 8.25V16.879C3 18.474 4.82083 19.3844 6.09677 18.4274C6.95699 17.7823 7.97849 17.4597 9 17.4597M9 4C10.0556 4 11.1111 4.33333 12 5L12.0968 5.07258C12.957 5.71774 13.9785 6.04032 15 6.04032M9 4V4.75V16.75V17.4597M15 6.04032C16.0215 6.04032 17.043 5.71774 17.9032 5.07258C19.1792 4.11562 21 5.02604 21 6.62097V15.25C21 15.8795 20.7036 16.4723 20.2 16.85L18 18.5C17.1111 19.1667 16.0556 19.5 15 19.5M15 6.04032V6.75V18.75V19.5M15 19.5C13.9444 19.5 12.8889 19.1667 12 18.5L11.9032 18.4274C11.043 17.7823 10.0215 17.4597 9 17.4597"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </Svg>
  );
};

export default MapIcon;
