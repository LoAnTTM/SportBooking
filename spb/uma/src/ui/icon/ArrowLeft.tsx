import React from 'react';
import VectorIcon from 'react-native-vector-icons/AntDesign';

import { IIconProps } from '@/ui/icon';

export interface IArrowLeftIconProps extends Omit<IIconProps, 'name'> {}

const ArrowLeftIcon: React.FC<IArrowLeftIconProps> = ({ color, size }) => {
  return <VectorIcon name="left" size={size} color={color} />;
};

export default ArrowLeftIcon;
