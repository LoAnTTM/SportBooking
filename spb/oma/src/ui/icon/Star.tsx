import React from 'react';
import Svg, { Path } from 'react-native-svg';

import { DEFAULT_ICON_SIZE } from '@/constants';
import { IIconProps } from '@/ui/icon';

const StarIcon: React.FC<IIconProps> = ({
  color,
  size = DEFAULT_ICON_SIZE,
  ...props
}) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
      <Path
        d="M13.9997 7.88603C14.3224 8.83867 15.2479 9.48366 16.2922 9.48366M5.09755 7.01471C6.66959 7.01471 8.06284 6.00245 8.54862 4.50736C9.63488 1.16422 14.3645 1.16422 15.4508 4.50736C15.9366 6.00245 17.3298 7.01471 18.9019 7.01471C22.417 7.01471 23.8786 11.5129 21.0347 13.579C19.7629 14.5031 19.2308 16.1409 19.7165 17.636C20.8028 20.9792 16.9764 23.7592 14.1326 21.693C12.8608 20.769 11.1386 20.769 9.86682 21.693C7.02297 23.7592 3.19661 20.9792 4.28286 17.636C4.76865 16.1409 4.23647 14.5031 2.96466 13.579C0.12082 11.5129 1.58236 7.01471 5.09755 7.01471Z"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </Svg>
  );
};

export default StarIcon;
